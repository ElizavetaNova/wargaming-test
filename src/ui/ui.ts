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


function showTooltip(card: HTMLElement, event?: MouseEvent) {
  const tooltip = document.getElementById("tooltip") as HTMLElement;
  const arrow = tooltip.querySelector(".tooltip__arrow") as HTMLElement;

  const mode = getLayoutMode();

  // Мобильный режим → Fullscreen
  if (mode === "mobile") {
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
  const padding = 40;
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



export function setupTooltip() {
  const tooltip = document.getElementById("tooltip") as HTMLElement;
  let hoveredCard: HTMLElement | null = null;
  let isHoveringTooltip = false;

  const closeBtn = tooltip.querySelector(".tooltip__close");
  closeBtn?.addEventListener("click", () => {
    tooltip.classList.remove("visible");
  });

  const cards = document.querySelectorAll(".tank-card");

  function hideIfAllowed() {
    if (!hoveredCard && !isHoveringTooltip && getLayoutMode() !== "mobile") {
      tooltip.classList.remove("visible");
    }
  }

  tooltip.addEventListener("mouseenter", () => {
    isHoveringTooltip = true;
  });

  tooltip.addEventListener("mouseleave", () => {
    isHoveringTooltip = false;
    hideIfAllowed();
  });

  cards.forEach(card => {
    card.addEventListener("mouseenter", (event) => {
      if (getLayoutMode() === "mobile") return;
      hoveredCard = event.currentTarget as HTMLElement;
      showTooltip(hoveredCard, event as MouseEvent);
    });

    card.addEventListener("click", (event) => {
      if (getLayoutMode() !== "mobile") return;
      showTooltip(event.currentTarget as HTMLElement);
    });

    card.addEventListener("mouseleave", () => {
      if (getLayoutMode() === "mobile") return;
      hoveredCard = null;
      setTimeout(() => {
        if (!hoveredCard && !isHoveringTooltip) {
          hideIfAllowed();
        }
      }, 200)
    });
  });
}
