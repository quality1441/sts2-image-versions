const IMAGE_ROOT = "https://raw.githubusercontent.com/quality1441/sts2-image-versions/main/";

const data = await fetch(new URL("card-changes.json", import.meta.url)).then((response) => {
  if (!response.ok) throw new Error("Could not load card-changes.json");
  return response.json();
});

const heroSelect = document.querySelector("#hero");
const kindSelect = document.querySelector("#kind");
const queryInput = document.querySelector("#query");
const heroesRoot = document.querySelector("#heroes");
const emptyNote = document.querySelector("#empty");

const params = new URLSearchParams(location.search);
const knownHeroes = new Set(data.heroes.map((hero) => hero.id));
let heroId = knownHeroes.has(params.get("hero")) ? params.get("hero") : "all";
let kind = ["changed", "added", "removed", "all"].includes(params.get("kind")) ? params.get("kind") : "changed";
let query = params.get("q") || "";

heroSelect.innerHTML = `<option value="all">All heroes</option>` + data.heroes.map((hero) => `<option value="${hero.id}">${escapeHtml(hero.name)}</option>`).join("");
heroSelect.value = heroId;
kindSelect.value = kind;
queryInput.value = query;

renderStats();
renderChart();
document.querySelector("#enchant-note").innerHTML = `<strong>Enchant names are not in this diff.</strong> The v0.107.1 index also listed ${data.enchantRows} enchant labels, including the enchant tab, with no hero. They are not cards.`;
renderList();

heroSelect.addEventListener("change", () => { heroId = heroSelect.value; renderList(); });
kindSelect.addEventListener("change", () => { kind = kindSelect.value; renderList(); });
queryInput.addEventListener("input", () => { query = queryInput.value; renderList(); });

function renderStats() {
  const cards = data.heroes.flatMap((hero) => hero.cards);
  const counts = {
    changed: cards.filter((card) => card.kind === "changed").length,
    added: cards.filter((card) => card.kind === "added").length,
    removed: cards.filter((card) => card.kind === "removed").length,
  };
  document.querySelector("#stats").innerHTML = `
    <article class="stat"><b>${counts.changed}</b><span>Cards with a text, cost, rarity, or type change</span></article>
    <article class="stat added"><b>${counts.added}</b><span>Cards new in v0.113.1</span></article>
    <article class="stat removed"><b>${counts.removed}</b><span>Cards removed since v0.107.1</span></article>`;
}

function renderChart() {
  const heroes = data.heroes;
  const max = Math.max(1, ...heroes.flatMap((hero) => ["changed", "added", "removed"].map((name) => countKind(hero, name))));
  const rows = heroes.map((hero) => {
    const lines = ["changed", "added", "removed"].map((name) => {
      const value = countKind(hero, name);
      const width = value === 0 ? 0 : Math.max(2, Math.round((value / max) * 100));
      const label = name === "added" ? "New" : name[0].toUpperCase() + name.slice(1);
      return `<div class="bar-line"><span>${label}</span><div class="track">${value ? `<div class="fill ${name}" style="width:${width}%"></div>` : ""}</div><b>${value}</b></div>`;
    }).join("");
    return `<div class="chart-row"><button type="button" class="chart-name" data-hero="${hero.id}">${escapeHtml(hero.name)}</button><div class="chart-bars">${lines}</div></div>`;
  }).join("");
  document.querySelector("#chart").innerHTML = `
    <p class="legend"><span class="changed"><i></i>Changed</span><span class="added"><i></i>New</span><span class="removed"><i></i>Removed</span></p>
    ${rows}`;
  document.querySelectorAll(".chart-name").forEach((button) => {
    button.addEventListener("click", () => {
      heroId = button.dataset.hero;
      heroSelect.value = heroId;
      renderList();
      document.querySelector("#filters").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderList() {
  const needle = query.trim().toLowerCase();
  const visible = data.heroes
    .filter((hero) => heroId === "all" || hero.id === heroId)
    .map((hero) => ({
      hero,
      cards: hero.cards.filter((card) => {
        if (kind !== "all" && card.kind !== kind) return false;
        if (!needle) return true;
        const blob = [card.name, card.id, ...card.levels.flatMap((level) => [level.before.desc, level.after.desc])].join(" ").toLowerCase();
        return blob.includes(needle);
      }),
    }))
    .filter((hero) => hero.cards.length > 0);

  heroesRoot.innerHTML = visible.map(({ hero, cards }) => {
    const open = heroId !== "all" || hero.id !== "fool";
    return `<details class="hero" ${open ? "open" : ""}>
      <summary><strong>${escapeHtml(hero.name)}</strong><span class="count">${cards.length}</span><span class="meta">${countKind(hero, "changed")} changed · ${countKind(hero, "added")} new · ${countKind(hero, "removed")} removed</span></summary>
      <div class="cards">${cards.map(cardArticle).join("")}</div>
    </details>`;
  }).join("");
  emptyNote.hidden = visible.length > 0;
  writeUrl();
}

function cardArticle(card) {
  const kindLabel = card.kind === "added" ? "New" : card.kind === "removed" ? "Removed" : "Changed";
  return `<article class="card">
    <div class="thumbs">${thumbs(card)}</div>
    <div>
      <div class="card-head"><h3>${escapeHtml(card.name)}</h3><span class="pill ${card.kind}">${kindLabel}</span></div>
      <table>
        <thead><tr><th>Form</th><th>Change</th><th>v0.107.1</th><th>v0.113.1</th></tr></thead>
        <tbody>${card.levels.map((level) => `<tr>
          <td data-label="Form">${level.up ? "Upgraded" : "Base"}</td>
          <td data-label="Change">${escapeHtml(fieldLabel(level.fields))}</td>
          <td data-label="v0.107.1">${rich(snapshot(level.before, level.fields))}</td>
          <td data-label="v0.113.1">${rich(snapshot(level.after, level.fields))}</td>
        </tr>`).join("")}</tbody>
      </table>
    </div>
  </article>`;
}

function thumbs(card) {
  const shots = [];
  if (card.image) shots.push(["Base", card.image]);
  if (card.imageUp && card.imageUp !== card.image) shots.push(["Upgraded", card.imageUp]);
  return shots.map(([label, path]) => {
    const url = imageUrl(path);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}<img src="${url}" alt="${escapeHtml(card.name)}" loading="lazy"></a>`;
  }).join("");
}

function imageUrl(path) {
  return IMAGE_ROOT + path.split("/").map(encodeURIComponent).join("/");
}

function countKind(hero, name) {
  return hero.cards.filter((card) => card.kind === name).length;
}

function fieldLabel(fields) {
  if (fields.length === 1 && fields[0] === "added") return "New";
  if (fields.length === 1 && fields[0] === "removed") return "Removed";
  return fields.join(", ");
}

function snapshot(side, fields) {
  if (fields.length === 1 && (fields[0] === "added" || fields[0] === "removed")) {
    if (!side.desc && !side.cost) return "";
    const cost = side.cost === "" ? "no cost" : side.cost + " energy";
    return cost + " · " + side.desc;
  }
  const parts = [];
  if (fields.includes("cost")) parts.push("cost " + (side.cost === "" ? "(none)" : side.cost));
  if (fields.includes("rarity")) parts.push(side.rarity || "(none)");
  if (fields.includes("type")) parts.push(side.type || "(none)");
  if (fields.includes("text")) parts.push(side.desc || "(none)");
  return parts.join(" · ");
}

function rich(text) {
  return escapeHtml(text).replaceAll("{E}", '<span class="energy">{E}</span>');
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function writeUrl() {
  const next = new URLSearchParams();
  if (heroId !== "all") next.set("hero", heroId);
  if (kind !== "changed") next.set("kind", kind);
  if (query.trim()) next.set("q", query.trim());
  const search = next.toString();
  history.replaceState(null, "", location.pathname + (search ? "?" + search : ""));
}
