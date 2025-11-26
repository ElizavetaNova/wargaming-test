export function setupSliders() {
  const sliders = document.querySelectorAll<HTMLInputElement>(".range");

  sliders.forEach((slider) => {
    const updateProgress = () => {
      const percent = (Number(slider.value) / Number(slider.max)) * 100;
      slider.style.setProperty("--progress", percent + "%");
    };

    slider.addEventListener("input", updateProgress);
    updateProgress(); // вызвать при старте
  });
}
