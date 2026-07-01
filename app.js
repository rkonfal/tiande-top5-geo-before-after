import { products } from "./products.js";

const heroStats = document.querySelector("#hero-stats");
const root = document.querySelector("#products-root");

const totalUnits = products.reduce((sum, product) => sum + product.ytdUnits, 0);
const productCodes = products.map((product) => product.code).join(", ");

heroStats.innerHTML = [
  statCard("TOP výběr", "5 produktů", "Vybráno čistě podle YTD prodaných kusů"),
  statCard("Součet prodejů", formatNumber(totalUnits), "Kusy za rok 2026 v aktuálním okně"),
  statCard("Největší problém", "varianty", "Hlavně u řady Nefritová svěžest"),
  statCard("Kódy", productCodes, "Produkty v ukázce")
].join("");

root.innerHTML = products.map(renderProduct).join("");

function statCard(label, value, note) {
  return `
    <article class="stat-card">
      <span class="mini-label">${label}</span>
      <strong>${value}</strong>
      <p>${note}</p>
    </article>
  `;
}

function renderProduct(product) {
  return `
    <article class="product-card" id="product-${product.code}">
      <div class="product-topbar">
        <div class="product-header">
          <div class="product-rank">${product.rank}</div>
          <div class="product-title-stack">
            <div class="product-meta">
              <span class="pill">Kód ${product.code}</span>
              <span class="pill">${formatNumber(product.ytdUnits)} ks YTD</span>
              <span class="pill">${product.price}</span>
            </div>
            <h3>${product.title}</h3>
            <a class="product-link" href="${product.url}" target="_blank" rel="noreferrer">
              Otevřít aktuální produktovou stránku
            </a>
          </div>
        </div>
      </div>

      <div class="product-columns">
        <section class="product-column before">
          <div class="column-head">
            <h3>Před</h3>
            <span class="mini-label">aktuální stav</span>
          </div>

          ${textBlock("Title", product.before.title)}
          ${textBlock("Meta description", product.before.meta)}
          ${textBlock("H1", product.before.h1)}
          ${textBlock("Úvodní odstavec", product.before.intro)}
        </section>

        <section class="product-column after">
          <div class="column-head">
            <h3>Po</h3>
            <span class="mini-label">navržený GEO přepis</span>
          </div>

          ${textBlock("Nový title", product.after.title)}
          ${textBlock("Nová meta description", product.after.meta)}
          ${textBlock("Nový H1", product.after.h1)}
          ${textBlock("Nový úvod", product.after.intro)}
        </section>
      </div>

      <div class="change-grid">
        <section class="change-panel">
          <h3>Co se má změnit</h3>
          <ul class="change-list">
            ${product.before.issues.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>

        <section class="change-panel">
          <h3>Co nově přidat na stránku</h3>
          <ul class="structure-list">
            ${product.after.structure.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>
      </div>

      <section class="change-panel">
        <h3>Dotazy, které má produkt nově lépe pokrýt</h3>
        <ul class="chips">
          ${product.queries.map((query) => `<li>${query}</li>`).join("")}
        </ul>
      </section>
    </article>
  `;
}

function textBlock(label, value) {
  return `
    <div class="text-block">
      <label>${label}</label>
      <div class="text-box">${escapeHtml(value)}</div>
    </div>
  `;
}

function formatNumber(number) {
  return new Intl.NumberFormat("cs-CZ").format(number);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
