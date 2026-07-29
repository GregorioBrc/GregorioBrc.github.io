marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-",
});

async function loadProjects() {
  const grid = document.getElementById("projects-grid");
  try {
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
  } catch (error) {
    console.error("Error cargando proyectos:", error);
  }
}

async function openProjectDrawer(project) {
  const drawer = document.getElementById("project-drawer");
  const header = document.getElementById("drawer-header");
  const body = document.getElementById("drawer-body");
  drawer.classList.add("open");
  document.body.style.overflow = "hidden";

  // Limpiar contenido previo de pestañas
  const existingTabs = document.getElementById("div_tabs_");
  if (existingTabs) {
    existingTabs.remove();
  }

  let headerContent = "";

  // 2. Construir pestañas si es un arreglo de READMEs
  if (Array.isArray(project.readmePath)) {
    const tabsHTML = `
            <div class="drawer-tabs">
                ${project.readmePath
                  .map(
                    (src, idx) => `
                    <button class="tab-btn ${idx === 0 ? "active" : ""}" 
                            onclick="switchTab(this, '${formatLink(src.path)}')">
                        ${src.label}
                    </button>
                `,
                  )
                  .join("")}
            </div>
        `;
    headerContent += tabsHTML;
  }

  const headerElem = document.createElement("div");
  headerElem.id = "div_tabs_";
  headerElem.innerHTML = headerContent;
  header.appendChild(headerElem);

  body.innerHTML = `<div id="readme-loader" class="markdown-body">
                    <p class="code-prefix">// cargando_doc...</p>
                    </div>`;

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

// Cargar y renderizar Markdown
async function renderMarkdown(path) {
  const container = document.getElementById("readme-loader");
  container.innerHTML = "<p class='code-prefix'>// fetching_content...</p>";

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("HTTP error " + response.status);
    const md = await response.text();
    container.innerHTML = marked.parse(md);

    // Highlight Code
    container
      .querySelectorAll("pre code")
      .forEach((el) => hljs.highlightElement(el));
  } catch (err) {
    container.innerHTML =
      "<p class='code-prefix'>// Error_404: doc_not_found</p>";
  }
}

// Función para cerrar el drawer
function closeDrawer() {
  const drawer = document.getElementById("project-drawer");
  if (drawer) {
    drawer.classList.remove("open");
    document.body.style.overflow = "auto";
  }
}

// Inicialización de Eventos
document.addEventListener("DOMContentLoaded", () => {
  loadProjects();

  const closeBtn = document.getElementById("close-drawer");
  if (closeBtn) closeBtn.onclick = closeDrawer;

  // Cerrar Drawer presionando la tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
});
