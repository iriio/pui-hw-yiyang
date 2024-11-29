export class TabManager {
  constructor(webSynth) {
    this.webSynth = webSynth;
    this.currentTab = "sequence";
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        this.switchTab(button.dataset.tab);
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update button states
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    // Update panel visibility
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `${tabId}-panel`);
    });
  }
}
