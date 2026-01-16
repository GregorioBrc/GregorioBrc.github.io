// Configuración de Marked (idéntica a la anterior)
marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-",
});

async function loadProjects() {
  const grid = document.getElementById("projects-grid");
  const response = await fetch("./data/projects.json");
  const projects = await response.json();

  grid.innerHTML = "";
  projects.forEach((proj) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
            <span class="project-tag">${proj.tag}</span>
            <h4>${proj.title}</h4>
            <p>${proj.shortDesc}</p>
            <div class="project-tech">${proj.tech
              .map((t) => `<span>${t}</span>`)
              .join("")}</div>
        `;
    card.addEventListener("click", () => openProjectDrawer(proj));
    grid.appendChild(card);
  });
}

async function openProjectDrawer(project) {
  const drawer = document.getElementById("project-drawer");
  const header = document.getElementById("drawer-header");
  const body = document.getElementById("drawer-body");
  drawer.classList.add("open");
  document.body.style.overflow = "hidden";

  if (document.getElementById("div_tabs_") != null) {
    document.getElementById("div_tabs_").remove();
  }

  // 1. Construir cabecera y Contenedor de Tabs
  let tabsHTML = "";
  if (Array.isArray(project.readmePath)) {
    tabsHTML = `
            <div class="drawer-tabs">
                ${project.readmePath
                  .map(
                    (src, idx) => `
                    <button class="tab-btn ${idx === 0 ? "active" : ""}" 
                            onclick="switchTab(this, '${formatLink(
                              src.path
                            )}')">
                        ${src.label}
                    </button>
                `
                  )
                  .join("")}
            </div>
        `;
    let heat = document.createElement("header");
    heat.id = "div_tabs_";
    heat.innerHTML = `${tabsHTML}`;
    header.appendChild(heat);
  }

  body.innerHTML = `<div id="readme-loader" class="markdown-body">
                    <p class="code-prefix">// cargando_doc...</p>
                    </div>`;

  //2. Cargar el primer documento por defecto
  if (Array.isArray(project.readmePath)) {
    renderMarkdown(formatLink(project.readmePath[0].path));
  } else {
    renderMarkdown(formatLink(project.readmePath));
  }
}

function formatLink(link) {
  if (link.includes("http")) {
    return link;
  } else {
    return "./data/" + link;
  }
}

// Función para cambiar de pestaña
window.switchTab = (btn, path) => {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderMarkdown(path);
};

// Función núcleo de renderizado
async function renderMarkdown(path) {
  const container = document.getElementById("readme-loader");
  container.innerHTML = "<p class='code-prefix'>// fetching_content...</p>";

  try {
    const response = await fetch(path);
    const md = await response.text();
    container.innerHTML = marked.parse(md);

    // Renderizar Mermaid
    const mermaidBlocks = container.querySelectorAll(".language-mermaid");
    if (mermaidBlocks.length > 0) {
      mermaid.initialize({
        theme: "dark",
        startOnLoad: false,
      });
      await mermaid.run({ nodes: mermaidBlocks });
    }

    // Highlight Code
    container
      .querySelectorAll("pre code")
      .forEach((el) => hljs.highlightElement(el));
  } catch (err) {
    container.innerHTML =
      "<p class='code-prefix'>// Error_404: doc_not_found</p>";
  }
}

// Inicialización (Cerrar drawer, etc.) - Igual que antes
document.addEventListener("DOMContentLoaded", loadProjects);
document.getElementById("close-drawer").onclick = () => {
  document.getElementById("project-drawer").classList.remove("open");
  document.body.style.overflow = "auto";
};
