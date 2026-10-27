import { concepts } from "./concepts.js";

const grid = document.querySelector("#concepts");
const dialog = document.querySelector("#detail");
const status = document.querySelector("#status");
const selected = new Set();
let mode = "overview";
let detailTrigger = null;

function mark(concept, size, label) {
  return `<svg class="mark" viewBox="0 0 64 64" ${size ? `style="width:${size}px;height:${size}px"` : ""} ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><use href="./${concept.id}.svg#mark"></use></svg>`;
}

function lockup(concept) {
  return `<svg class="lockup" viewBox="0 0 ${concept.width} 64" role="img" aria-label="orvui ${concept.name} 字标组合"><use href="./${concept.id}-wordmark.svg#lockup"></use></svg>`;
}

function downloads(concept) {
  return `<div class="downloads"><a class="download primary" href="./${concept.id}.svg" download="orvui-${concept.id}.svg">下载图标 <span aria-hidden="true">↓</span></a><a class="download" href="./${concept.id}-wordmark.svg" download="orvui-${concept.id}-wordmark.svg">下载字标 <span aria-hidden="true">↓</span></a></div>`;
}

function navbar(concept) {
  return `<p class="section-label">导航栏 / 56 px</p><div class="nav-sample"><div class="nav-brand">${mark(concept)}<span>orvui</span></div><span>组件 &nbsp; / &nbsp; 文档</span></div>`;
}

function sizes(concept) {
  return `<p class="section-label">小尺寸 / 实际像素</p><div class="sizes">${[16, 24, 32].map(size => `<div class="size-cell"><div>${mark(concept, size, `${concept.name} ${size} 像素`)}</div><span>${size} px</span></div>`).join("")}</div>`;
}

function render() {
  const list = mode === "compare" ? concepts.filter(c => selected.has(c.id)) : concepts;
  grid.classList.toggle("comparison", mode === "compare");
  grid.innerHTML = list.map(c => `<article class="concept ${selected.has(c.id) ? "is-selected" : ""}" data-id="${c.id}" aria-labelledby="title-${c.id}">
    <div class="artboard">
      <span class="artboard-label">${c.letter} / ${c.english.toUpperCase()}</span>
      <label class="select-control"><input type="checkbox" data-select="${c.id}" ${selected.has(c.id) ? "checked" : ""} aria-label="将 ${c.letter} ${c.name} 加入对比"/><span>对比</span></label>
      <button type="button" class="open-artboard" data-detail="${c.id}" aria-label="查看 ${c.letter} ${c.name} 方案详情">${mark(c)}${lockup(c)}</button>
    </div>
    <div class="concept-caption"><div><h2 id="title-${c.id}"><span>${c.letter}</span>${c.name}</h2><p>${c.tags}</p></div><button type="button" class="detail-link" data-detail="${c.id}" aria-label="查看 ${c.name} 应用效果">查看方案 <span aria-hidden="true">↗</span></button></div>
    ${mode === "compare" ? `<p class="concept-description">${c.description}</p><div class="application">${navbar(c)}</div><div class="application">${sizes(c)}</div>${downloads(c)}` : ""}
  </article>`).join("");
  updateControls();
}

function updateControls() {
  document.querySelector("#compare-count").textContent = selected.size;
  document.querySelector("#compare").disabled = selected.size < 2;
  document.querySelector("#overview").setAttribute("aria-pressed", String(mode === "overview"));
  document.querySelector("#compare").setAttribute("aria-pressed", String(mode === "compare"));
  document.querySelector("#view-note").textContent = mode === "compare"
    ? `正在对比 ${selected.size} 款方案。可直接下载 SVG，或返回全部方案调整选择。`
    : "勾选至少两款即可并排对比；点击图形查看完整应用效果。";
}

function openDetail(concept, trigger) {
  detailTrigger = trigger;
  document.querySelector("#detail-number").textContent = `DIRECTION ${concept.letter} / 06`;
  document.querySelector("#detail-content").innerHTML = `
    <div class="detail-layout"><div class="detail-stage">${mark(concept, null, concept.name)}</div>
      <div class="detail-info"><h2 id="detail-title">${concept.name}</h2><p class="detail-english">${concept.english} / ${concept.tags}</p>${lockup(concept)}<p id="detail-description">${concept.description}</p><p>${concept.detail}</p></div>
    </div>
    <div class="detail-applications"><section>${navbar(concept)}</section><section>${sizes(concept)}</section></div>
    <div class="background-pair" aria-label="明暗背景对照"><div class="sample-light">${mark(concept)}<span>LIGHT</span></div><div class="sample-dark">${mark(concept)}<span>DARK</span></div></div>
    ${downloads(concept)}
  `;
  dialog.showModal();
  dialog.scrollTop = 0;
}

grid.addEventListener("click", event => {
  const trigger = event.target.closest("[data-detail]");
  if (trigger) openDetail(concepts.find(c => c.id === trigger.dataset.detail), trigger);
});

grid.addEventListener("change", event => {
  const input = event.target.closest("[data-select]");
  if (!input) return;
  if (input.checked) selected.add(input.dataset.select);
  else selected.delete(input.dataset.select);
  input.closest(".concept").classList.toggle("is-selected", input.checked);
  // Preserve keyboard focus during ordinary selection; rerender only a changed view.
  if (mode === "compare") {
    const focusedId = input.dataset.select;
    if (selected.size < 2) mode = "overview";
    render();
    (grid.querySelector(`[data-select="${focusedId}"]`) ?? document.querySelector("#overview")).focus();
  } else updateControls();
  status.textContent = `已选择 ${selected.size} 款方案用于对比。`;
});

document.querySelector("#overview").addEventListener("click", () => { mode = "overview"; render(); });
document.querySelector("#compare").addEventListener("click", () => {
  if (selected.size < 2) return;
  mode = "compare";
  render();
  status.textContent = `正在并排对比 ${selected.size} 款方案。`;
});

document.querySelector(".studio-brand").addEventListener("click", () => {
  mode = "overview";
  render();
});

document.querySelectorAll(".theme-switch button").forEach(button => {
  button.addEventListener("click", () => {
    document.documentElement.dataset.theme = button.dataset.theme;
    document.querySelectorAll(".theme-switch button").forEach(item => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    status.textContent = button.dataset.theme === "dark" ? "已切换至深色背景。" : "已切换至浅色背景。";
  });
});

document.querySelector("#close-detail").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener("close", () => detailTrigger?.focus());

render();
