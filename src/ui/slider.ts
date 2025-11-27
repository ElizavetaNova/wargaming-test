export function setupSliders() {
  const sliders = document.querySelectorAll<HTMLInputElement>(".range");

  sliders.forEach((slider) => {
    slider.addEventListener("input", () => updateSliderProgress(slider));
    updateSliderProgress(slider);
  });
}

export function updateSliderProgress(slider: HTMLInputElement) {
  const percent = (Number(slider.value) / Number(slider.max)) * 100;
  slider.style.setProperty("--progress", percent + "%");
}