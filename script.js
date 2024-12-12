const modal = document.getElementById("settingsModal");
const optionsButton = document.getElementById("optionsButton");
const closeButton = document.getElementById("closeButton");
const colorPicker = document.getElementById("colorPicker");
const temperatureSlider = document.getElementById("temperatureSlider");
const temperatureValue = document.getElementById("temperatureValue");
const radioButtons = document.getElementsByName("colorType");

const setRadioType = (type) => {
  radioButtons.forEach((radio) => {
    radio.checked = radio.value === type;
  });
};

const handleInputChange = (type) => {
  temperatureValue.textContent = `${temperatureSlider.value}K`;
  setRadioType(type);
  updateColor();
};

const updateSelectedTypeStyle = (type) => {
  document.querySelectorAll("label").forEach((label) => {
    label.classList.toggle(
      "selected-type",
      label.querySelector(`input[value="${type}"]`) !== null,
    );
  });
};

const updateColor = () => {
  let selectedType;
  for (const radio of radioButtons) {
    if (radio.checked) {
      selectedType = radio.value;
      break;
    }
  }
  updateSelectedTypeStyle(selectedType);
  let newColor;
  switch (selectedType) {
    case "custom":
      newColor = colorPicker.value;
      localStorage.setItem("colorType", "custom");
      localStorage.setItem("customColor", newColor);
      break;
    case "temperature":
      newColor = temperatureToRGB(temperatureSlider.value);
      localStorage.setItem("colorType", "temperature");
      localStorage.setItem("temperature", temperatureSlider.value);
      break;
  }

  document.documentElement.style.setProperty("--page-background", newColor);
};

// Convert color temperature to RGB, based on https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
function temperatureToRGB(temperature) {
  temperature = temperature / 100;
  let red, green, blue;

  // Calculate Red
  if (temperature <= 66) {
    red = 255;
  } else {
    red = temperature - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    red = Math.max(0, Math.min(255, red));
  }

  // Calculate Green
  if (temperature <= 66) {
    green = temperature;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    green = Math.max(0, Math.min(255, green));
  } else {
    green = temperature - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    green = Math.max(0, Math.min(255, green));
  }

  // Calculate Blue
  if (temperature >= 66) {
    blue = 255;
  } else {
    if (temperature <= 19) {
      blue = 0;
    } else {
      blue = temperature - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      blue = Math.max(0, Math.min(255, blue));
    }
  }

  return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
}
// Add event listeners
optionsButton.addEventListener("click", () => modal.showModal());
closeButton.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

temperatureSlider.addEventListener("input", () =>
  handleInputChange("temperature"),
);
colorPicker.addEventListener("input", () => handleInputChange("custom"));
radioButtons.forEach((radio) => {
  radio.addEventListener("change", updateColor);
});

// Update the state on page load
const savedColorType = localStorage.getItem("colorType");
const savedCustomColor = localStorage.getItem("customColor");
const savedTemperature = localStorage.getItem("temperature");
colorPicker.value = savedCustomColor ?? "#ffffff";
temperatureSlider.value = savedTemperature ?? 6500;

if (savedColorType === "temperature") {
  handleInputChange("temperature");
} else {
  handleInputChange("custom");
}
modal.showModal();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/remote-meeting-lighting/sw.js")
      .then(() => {
        console.log("ServiceWorker registration successful");
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}
