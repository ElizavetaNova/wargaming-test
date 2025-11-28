import { updateSliderProgress } from "./slider";

export function setupCalculator() {
  const slider = document.getElementById("slider") as HTMLInputElement;
  const input = document.getElementById("battlesInput") as HTMLInputElement;
  const xpView = document.getElementById("xp-value") as HTMLElement;

  slider.addEventListener("input", () => {
    input.value = slider.value;
    updateXP();
  });

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");

    let val = Number(input.value);

    if (val > 300) val = 300;
    if (val < 0 || isNaN(val)) val = 0;

    input.value = val.toString();

    // Обновляем слайдер
    slider.value = val.toString();
    updateSliderProgress(slider);

    updateXP();
  });

  document.querySelectorAll('input[name="config"]').forEach(radio => {
    radio.addEventListener("change", updateXP);
  });

  function updateXP() {
    const battles = Number(slider.value);
    const config = document.querySelector('input[name="config"]:checked') as HTMLInputElement;

    const multiplier = 3;
    let percentageOfComplete = 0

    if (config.value === "elite") percentageOfComplete = 0.1;
    if (config.value === "premium") percentageOfComplete = 0.2;

    const xpWOBonus = battles * multiplier;

    animateXP(Math.round(xpWOBonus + xpWOBonus * percentageOfComplete));
  }

  let lastXP = 0;
  function animateXP(target: number) {
    const duration = 300;
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const startXP = lastXP || 0;
      const value = Math.floor(startXP  + (target - startXP ) * progress);

      xpView.textContent = value.toString();

      if (progress < 1) requestAnimationFrame(step);
      else lastXP = target;
    }

    requestAnimationFrame(step);
  }

  // ИНИЦИАЛИЗАЦИЯ ПРИ ПЕРВОМ ОТКРЫТИИ СТРАНИЦЫ
  input.value = slider.value;
  updateSliderProgress(slider);
  updateXP();
}
