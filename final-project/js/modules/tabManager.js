/**
 * TabManager Class
 * Manages tab switching and visibility
 */
export class TabManager {
  /**
   * creates a new TabManager instance
   * @param {WebSynth} webSynth - its parent WebSynth instance
   */
  constructor(webSynth) {
    this.webSynth = webSynth;
    this.currentTab = "sequence";
    this.setupEventListeners();
  }

  /**
   * sets up event listeners for tab switching
   */
  setupEventListeners() {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        this.switchTab(button.dataset.tab);
      });
    });
  }

  /**
   * switches active tab
   * @param {string} tabId - ID of the tab to switch to
   */
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
