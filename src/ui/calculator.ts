export function setupCalculator() {
  const slider = document.getElementById("slider") as HTMLInputElement;
  const input = document.getElementById("battlesInput") as HTMLInputElement;
  const xpView = document.querySelector(".tooltip__xp-value") as HTMLElement;

  slider.addEventListener("input", () => {
    input.value = slider.value;
    updateXP();
  });

  input.addEventListener("input", () => {
    const val = Number(input.value);

    if (val < 0 || val > 300) {
      input.classList.add("invalid");
      return;
    }

    input.classList.remove("invalid");
    slider.value = val.toString();

    updateXP();
  });

  document.querySelectorAll('input[name="config"]').forEach(radio => {
    radio.addEventListener("change", updateXP);
  });

  function updateXP() {
    const battles = Number(slider.value);
    const config = document.querySelector('input[name="config"]:checked') as HTMLInputElement;

    let multiplier = 3;

    if (config.value === "elite") multiplier = 3.1;
    if (config.value === "premium") multiplier = 3.2;

    animateXP(Math.round(battles * multiplier));
  }

  let lastXP = 0;
  function animateXP(target: number) {
    const duration = 300;
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(lastXP + (target - lastXP) * progress);

      xpView.textContent = value.toString();

      if (progress < 1) requestAnimationFrame(step);
      else lastXP = target;
    }

    requestAnimationFrame(step);
  }
}
