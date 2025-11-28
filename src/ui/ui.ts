import type { Tank } from "../types";

function getLayoutMode() {
  const width = window.innerWidth;
  if (width < 600) return "mobile";     // 1 в ряд
  if (width < 800) return "tablet";    // 2 в ряд
  return "desktop";                     // 3 в ряд
}

function getItemsPerRow() {
  const mode = getLayoutMode();
  if (mode === "mobile") return 1;
  if (mode === "tablet") return 2;
  return 3;
}

function getRowIndex(card: HTMLElement, itemsPerRow: number) {
  const cards = [...document.querySelectorAll(".tank-card")] as HTMLElement[];
  const index = cards.indexOf(card);
  return Math.floor(index / itemsPerRow);
}

function isClickMode() {
  const mode = getLayoutMode();
  return mode === "mobile" || mode === "tablet";
}


function showTooltip(card: HTMLElement, tanks: Tank[], event?: MouseEvent) {
  const tooltip = document.getElementById("tooltip") as HTMLElement;
  const arrow = tooltip.querySelector(".tooltip__arrow") as HTMLElement;

  const mode = getLayoutMode();

  // FULLSCREEN MODE для tablet + mobile
  if (isClickMode()) {
    document.body.style.overflow = "hidden";

    const tankId = card.dataset.tank;
    const tankTitleEl = document.getElementById("tooltip-title") as HTMLElement;

    if (tankId) {
      const tank = tanks.find(t => t.id === tankId);
      if (tank) tankTitleEl.textContent = tank.name;
    }

    tooltip.classList.add("fullscreen");
    tooltip.classList.add("visible");
    tooltip.style.left = "";
    tooltip.style.top = "";
    return;
  }

  tooltip.classList.remove("fullscreen");

  const rect = card.getBoundingClientRect();
  const itemsPerRow = getItemsPerRow();
  const row = getRowIndex(card, itemsPerRow);

  // Определяем где показывать (сверху или снизу)
  let placement: "top" | "bottom";
  placement = "bottom";

  if (mode === "desktop") {
    // desktop: 3 ряда → верхний и нижний
    const total = document.querySelectorAll(".tank-card").length;
    const rows = Math.ceil(total / itemsPerRow);
    placement = row === 0 ? "bottom" : row === rows - 1 ? "top" : "bottom";
  }

  if (mode === "tablet") {
    placement = row === 0 ? "bottom" : "top";
  }

  // Центровка тултипа относительно карточки
  let tooltipX = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;

  // ограничение внутри окна
  const padding = mode === "desktop" ? 40 : 30;
  tooltipX = Math.max(
    padding,
    Math.min(tooltipX, window.innerWidth - tooltip.offsetWidth - padding)
  );

  // позиция по вертикали
  let tooltipY;

  if (placement === "top") {
    tooltipY = rect.top + window.scrollY - tooltip.offsetHeight - 28;
    arrow.style.top = `${tooltip.offsetHeight - 2}px`; // стрелка снизу тултипа
    arrow.style.rotate = "180deg";
  } else {
    tooltipY = rect.bottom + window.scrollY + 28;
    arrow.style.top = `-28px`; // стрелка сверху тултипа
    arrow.style.rotate = "360deg";
  }

  tooltip.style.left = tooltipX + "px";
  tooltip.style.top = tooltipY + "px";

  // Стрелка по центру карточки
  const arrowX = rect.left + rect.width / 2 - tooltipX - arrow.clientWidth / 2;
  arrow.style.left = `${arrowX}px`;

  tooltip.classList.add("visible");
}

export function setupTooltip(tanks: Tank[]) {
  const tooltip = document.getElementById("tooltip") as HTMLElement;
  const cards = document.querySelectorAll(".tank-card");

  let hoveredCard: HTMLElement | null = null;
  let isHoveringTooltip = false;

  const closeBtn = tooltip.querySelector(".tooltip__close");
  closeBtn?.addEventListener("click", () => {
    tooltip.classList.remove("visible");
    document.body.style.overflow = "";
  });

  function hideIfAllowed() {
    if (isClickMode()) return;
    if (!hoveredCard && !isHoveringTooltip) {
      tooltip.classList.remove("visible");
    }
  }

  tooltip.addEventListener("mouseenter", () => {
    if (!isClickMode()) isHoveringTooltip = true;
  });

  tooltip.addEventListener("mouseleave", () => {
    if (!isClickMode()) {
      isHoveringTooltip = false;
      hideIfAllowed();
    }
  });

  cards.forEach(card => {
    card.addEventListener("mouseenter", (event) => {
      if (isClickMode()) return;
      hoveredCard = event.currentTarget as HTMLElement;
      showTooltip(hoveredCard, tanks);
    });

    card.addEventListener("click", (event) => {
      if (!isClickMode()) return;
      showTooltip(event.currentTarget as HTMLElement, tanks);
    });

    card.addEventListener("mouseleave", () => {
      if (isClickMode()) return;
      hoveredCard = null;
      setTimeout(() => {
        if (!hoveredCard && !isHoveringTooltip) {
          hideIfAllowed();
        }
      }, 200)
    });
  });
}

export function setupScrollUpButton() {
  const button = document.getElementById("scrollUpButton");

  button?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,         // скроллим к верху страницы
      behavior: "smooth" // плавная прокрутка
    });
  })
}
