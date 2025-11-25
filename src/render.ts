import type { Tank } from "./types";

export function renderTanks(tanks: Tank[]) {
  const container = document.getElementById("tanks");

  if (!container) {
    console.error("Container #tanks not found");
    return;
  }

  container.innerHTML = ""; // очистка

  tanks.forEach(tank => {
    const card = document.createElement("div");
    card.className = "tank-card";
    card.dataset.tank = tank.id;

    card.innerHTML = `
      <img src="${tank.image}" alt="${tank.name}">
      <span class="tank-card__name">${tank.name}</span>
    `;

    container.appendChild(card);
  });
}
