// export function setupTooltip() {
//   const tooltip = document.getElementById("tooltip") as HTMLElement;

//   document.querySelectorAll(".tank-card").forEach(card => {
//     card.addEventListener("mouseenter", (event) => {
//       const target = event.currentTarget as HTMLElement;
//       const rect = target.getBoundingClientRect();

//       tooltip.style.top = `${rect.bottom + 10 + window.scrollY}px`;
//       tooltip.style.left = `${rect.left + window.scrollX}px`;

//       tooltip.classList.add("visible");
//     });

//     card.addEventListener("mouseleave", () => {
//       tooltip.classList.remove("visible");
//     });
//   });
// }

function showTooltip(card: HTMLElement, event?: MouseEvent) {
  const tooltip = document.getElementById("tooltip") as HTMLElement;
  const arrow = tooltip.querySelector(".tooltip__arrow") as HTMLElement;

  const rect = card.getBoundingClientRect();

  // ставим тултип как обычно
  const tooltipX = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
  const tooltipY = rect.top + window.scrollY - tooltip.offsetHeight - 16;

  tooltip.style.left = tooltipX + "px";
  tooltip.style.top = tooltipY + "px";

  // если есть mouseover event → ставим стрелочку под курсор
  if (event) {
    const relativeX = event.clientX - tooltipX;
    arrow.style.left = `${relativeX - 12}px`;
  } else {
    arrow.style.left = `${tooltip.offsetWidth / 2 - 12}px`;
  }

  tooltip.classList.add("visible");
}


export function setupTooltip() {
  const tooltip = document.getElementById("tooltip") as HTMLElement;
  let hoveredCard: HTMLElement | null = null;
  let isHoveringTooltip = false;

  const cards = document.querySelectorAll(".tank-card");

  cards.forEach(card => {
    card.addEventListener("mouseenter", (event) => {
  hoveredCard = event.currentTarget as HTMLElement;
  showTooltip(hoveredCard, event as MouseEvent);
});


    card.addEventListener("mouseleave", () => {
      hoveredCard = null;
      hideIfAllowed();
    });
  });

  tooltip.addEventListener("mouseenter", () => {
    isHoveringTooltip = true;
  });

  tooltip.addEventListener("mouseleave", () => {
    isHoveringTooltip = false;
    hideIfAllowed();
  });

  function hideIfAllowed() {
    if (!hoveredCard && !isHoveringTooltip) {
      tooltip.classList.remove("visible");
    }
  }
}
