import { products } from "./products.js";
import { previewProducts } from "./preview-products.js";
import { upgradePreviewProducts } from "./upgrade-preview.js";
import { next25PreviewProducts } from "./next25-preview.js";

const heroStats = document.querySelector("#hero-stats");
const liveRoot = document.querySelector("#products-root");
const previewRoot = document.querySelector("#preview-products-root");
const upgradeRoot = document.querySelector("#upgrade-preview-root");
const next25Root = document.querySelector("#next25-preview-root");

const allProducts = [...products, ...previewProducts, ...next25PreviewProducts];
const totalUnits = allProducts.reduce((sum, product) => sum + product.ytdUnits, 0);
const totalDiffBlocks = allProducts.reduce((sum, product) => sum + product.blockDiffs.length, 0);
const productCodes = allProducts.map((product) => product.code).join(", ");
const deployedCount = products.length + previewProducts.length + next25PreviewProducts.length;

heroStats.innerHTML = [
  statCard("Nasazeno", `${deployedCount} produktů`, "Všechna SKU v této microsite už jsou v produkci"),
  statCard("Poslední vlna", `${next25PreviewProducts.length} produktů`, "Dalších 25 kusů už je nově nasazených v e-shopu"),
  statCard("Silnější upgrade", `${upgradePreviewProducts.length} produktů`, "Decision-page pattern nasazený na celé sadě"),
  statCard("Součet prodejů", formatNumber(totalUnits), "Kusy za rok 2026 v aktuálním okně"),
  statCard("Rozšířené bloky", `${totalDiffBlocks} změn`, "Rozpad po sekcích pro content tým"),
  statCard("Kódy", productCodes, "Produkty v ukázce")
].join("");

next25Root.innerHTML = next25PreviewProducts
  .map((product) =>
    renderProduct(product, {
      badge: "Hotovo v produkci · finální GEO upgrade",
      afterLabel: "finální produkční copy po ručním passu"
    })
  )
  .join("");
liveRoot.innerHTML = products
  .map((product) =>
    renderProduct(product, {
      badge: "Hotovo v produkci",
      afterLabel: "první nasazená GEO verze"
    })
  )
  .join("");
previewRoot.innerHTML = previewProducts
  .map((product) =>
    renderProduct(product, {
      badge: "Hotovo v produkci",
      afterLabel: "finální produkční copy"
    })
  )
  .join("");
upgradeRoot.innerHTML = upgradePreviewProducts
  .map((product) =>
    renderProduct(product, {
      badge: "Hotovo v produkci · finální upgrade",
      afterLabel: "silnější verze nasazená v produkci"
    })
  )
  .join("");

function statCard(label, value, note) {
  return `
    <article class="stat-card">
      <span class="mini-label">${label}</span>
      <strong>${value}</strong>
      <p>${note}</p>
    </article>
  `;
}

function renderProduct(product, options = {}) {
  const statusBadge = options.badge
    ? `<span class="pill preview-pill">${escapeHtml(options.badge)}</span>`
    : "";
  const afterLabel = options.afterLabel ?? "navržený GEO přepis";

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
              ${statusBadge}
            </div>
            <h3>${escapeHtml(product.title)}</h3>
            <a class="product-link" href="${product.url}" target="_blank" rel="noreferrer">
              Otevřít aktuální produktovou stránku
            </a>
          </div>
        </div>
      </div>

      <section class="section-stack">
        <div class="section-subhead">
          <p class="section-kicker">SEO vrstva</p>
          <h4>Title, meta, H1 a rozšířený popis</h4>
        </div>

        <div class="product-columns seo-columns">
          <section class="product-column before">
            <div class="column-head">
              <h3>Před</h3>
              <span class="mini-label">aktuální live web</span>
            </div>
            ${textBlock("Title", product.before.title)}
            ${textBlock("Meta description", product.before.meta)}
            ${textBlock("H1", product.before.h1)}
          </section>

          <section class="product-column after">
            <div class="column-head">
              <h3>Po</h3>
              <span class="mini-label">${escapeHtml(afterLabel)}</span>
            </div>
            ${textBlock("Nový title", product.after.title)}
            ${textBlock("Nová meta description", product.after.meta)}
            ${textBlock("Nový H1", product.after.h1)}
          </section>
        </div>
      </section>

      <section class="section-stack">
        <div class="section-subhead">
          <p class="section-kicker">Rozšířený popis</p>
          <h4>Celý blok product-description před a po</h4>
        </div>

        <div class="product-columns description-columns">
          ${descriptionCard("Před", "aktuální product-description", "before", product.before.description)}
          ${descriptionCard("Po", afterLabel, "after", product.after.description)}
        </div>
      </section>

      <section class="section-stack">
        <div class="section-subhead">
          <p class="section-kicker">Blokový diff</p>
          <h4>Co se má změnit po jednotlivých sekcích</h4>
        </div>

        <div class="diff-grid">
          ${product.blockDiffs.map(renderDiffCard).join("")}
        </div>
      </section>

      <div class="change-grid">
        <section class="change-panel">
          <h3>Co je dnes problém</h3>
          <ul class="change-list">
            ${product.before.issues.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>

        <section class="change-panel">
          <h3>Co nově přidat na stránku</h3>
          <ul class="structure-list">
            ${product.after.structure.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
      </div>

      <section class="change-panel">
        <h3>Dotazy, které má produkt nově lépe pokrýt</h3>
        <ul class="chips">
          ${product.queries.map((query) => `<li>${escapeHtml(query)}</li>`).join("")}
        </ul>
      </section>
    </article>
  `;
}

function descriptionCard(title, label, tone, description) {
  const content = description.html
    ? `<article class="description-sheet raw-html">${description.html}</article>`
    : `
      <article class="description-sheet">
        <header class="description-header">
          <div class="description-headline">${escapeHtml(description.headline)}</div>
          <p>${escapeHtml(description.intro)}</p>
        </header>

        <div class="description-sections">
          ${description.sections.map(renderDescriptionSection).join("")}
        </div>
      </article>
    `;

  return `
    <section class="product-column ${tone}">
      <div class="column-head">
        <h3>${title}</h3>
        <span class="mini-label">${label}</span>
      </div>
      ${content}
    </section>
  `;
}

function renderDescriptionSection(section) {
  const paragraphs = (section.paragraphs ?? [])
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  const bullets = renderList(section.bullets);
  const ordered = renderOrderedList(section.ordered);
  const note = section.note ? `<div class="section-note">${escapeHtml(section.note)}</div>` : "";

  return `
    <section class="description-section">
      <h4>${escapeHtml(section.title)}</h4>
      ${paragraphs}
      ${bullets}
      ${ordered}
      ${note}
    </section>
  `;
}

function renderList(items = []) {
  if (!items.length) {
    return "";
  }

  return `
    <ul class="section-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderOrderedList(items = []) {
  if (!items.length) {
    return "";
  }

  return `
    <ol class="section-ordered">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ol>
  `;
}

function renderDiffCard(diff) {
  return `
    <article class="diff-card">
      <div class="diff-card-top">
        <span class="mini-label">Blok</span>
        <h4>${escapeHtml(diff.title)}</h4>
      </div>

      <div class="diff-lines">
        <div class="diff-line">
          <span>Před</span>
          <p>${escapeHtml(diff.before)}</p>
        </div>
        <div class="diff-line after-line">
          <span>Po</span>
          <p>${escapeHtml(diff.after)}</p>
        </div>
      </div>

      <div class="diff-impact">
        <span class="mini-label">Dopad</span>
        <p>${escapeHtml(diff.impact)}</p>
      </div>
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
