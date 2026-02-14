/**
 * BLACKBOX Popup Interface Script
 * Manages the extension popup UI and settings
 */

(function() {
  'use strict';

  // Default settings
  const DEFAULT_SETTINGS = {
    autoSave: true,
    autoSaveInterval: 5,
    offlineGuard: true,
    preventBack: true,
    preventClose: true
  };

  // DOM element references
  const dom = {
    autoSave: document.getElementById('autoSave'),
    offlineGuard: document.getElementById('offlineGuard'),
    preventBack: document.getElementById('preventBack'),
    preventClose: document.getElementById('preventClose'),
    syncRate: document.getElementById('syncRate'),
    syncRateWrapper: document.getElementById('sync-rate-wrapper')
  };

  // Debounce timer for input changes
  let saveDebounceTimer = null;
  const DEBOUNCE_DELAY = 500; // 500ms delay before saving

  /**
   * Initializes the popup interface
   */
  async function init() {
    try {
      // Verify Chrome extension API is available
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
        console.error('[BLACKBOX] Chrome extension API not available');
        return;
      }

      // Load settings from storage
      const data = await chrome.storage.local.get(['settings']);
      const settings = { ...DEFAULT_SETTINGS, ...data.settings };

      // Apply loaded settings to UI
      applySettingsToUI(settings);

      // Attach event listeners
      attachEventListeners();

    } catch (error) {
      console.error('[BLACKBOX] Initialization failed:', error);
    }
  }

  /**
   * Applies settings to UI elements
   * @param {Object} settings - Settings object
   */
  function applySettingsToUI(settings) {
    if (dom.autoSave) {
      dom.autoSave.checked = settings.autoSave;
      updatePulseSaveVisibility(settings.autoSave);
    }

    if (dom.offlineGuard) {
      dom.offlineGuard.checked = settings.offlineGuard;
    }

    if (dom.preventBack) {
      dom.preventBack.checked = settings.preventBack;
    }

    if (dom.preventClose) {
      dom.preventClose.checked = settings.preventClose;
    }

    if (dom.syncRate) {
      dom.syncRate.value = settings.autoSaveInterval;
    }
  }

  /**
   * Attaches event listeners to UI elements
   */
  function attachEventListeners() {
    if (dom.autoSave) {
      dom.autoSave.addEventListener('change', (e) => {
        updatePulseSaveVisibility(e.target.checked);
        debouncedSave();
      });
    }

    if (dom.offlineGuard) {
      dom.offlineGuard.addEventListener('change', debouncedSave);
    }

    if (dom.preventBack) {
      dom.preventBack.addEventListener('change', debouncedSave);
    }

    if (dom.preventClose) {
      dom.preventClose.addEventListener('change', debouncedSave);
    }

    if (dom.syncRate) {
      // Use input event for real-time updates
      dom.syncRate.addEventListener('input', handleSyncRateInput);
      dom.syncRate.addEventListener('change', debouncedSave);
    }
  }

  /**
   * Handles sync rate input with validation
   * @param {Event} e - Input event
   */
  function handleSyncRateInput(e) {
    let value = parseInt(e.target.value);
    
    // Validate and clamp value
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 999) {
      value = 999;
    }

    e.target.value = value;
    debouncedSave();
  }

  /**
   * Shows or hides the sync rate input based on auto-save state
   * @param {boolean} visible - Whether to show the sync rate input
   */
  function updatePulseSaveVisibility(visible) {
    if (!dom.syncRateWrapper) return;
    
    if (visible) {
      dom.syncRateWrapper.classList.remove('hidden');
    } else {
      dom.syncRateWrapper.classList.add('hidden');
    }
  }

  /**
   * Debounced save function to prevent excessive storage writes
   */
  function debouncedSave() {
    // Clear existing timer
    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
    }

    // Set new timer
    saveDebounceTimer = setTimeout(() => {
      save();
    }, DEBOUNCE_DELAY);
  }

  /**
   * Saves settings to Chrome storage and notifies content scripts
   */
  async function save() {
    try {
      // Gather settings from UI
      const settings = {
        autoSave: dom.autoSave ? dom.autoSave.checked : DEFAULT_SETTINGS.autoSave,
        autoSaveInterval: dom.syncRate ? parseInt(dom.syncRate.value) || 5 : DEFAULT_SETTINGS.autoSaveInterval,
        offlineGuard: dom.offlineGuard ? dom.offlineGuard.checked : DEFAULT_SETTINGS.offlineGuard,
        preventBack: dom.preventBack ? dom.preventBack.checked : DEFAULT_SETTINGS.preventBack,
        preventClose: dom.preventClose ? dom.preventClose.checked : DEFAULT_SETTINGS.preventClose
      };

      // Validate interval
      if (settings.autoSaveInterval < 1) settings.autoSaveInterval = 1;
      if (settings.autoSaveInterval > 999) settings.autoSaveInterval = 999;

      // Save to storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ settings });

        // Notify all BandLab tabs about the settings update
        try {
          await chrome.runtime.sendMessage({ 
            type: 'SETTINGS_UPDATED', 
            settings 
          });
        } catch (e) {
          // Background script might not be ready, that's okay
          console.log('[BLACKBOX] Settings saved, notification pending');
        }
      }
    } catch (error) {
      console.error('[BLACKBOX] Save failed:', error);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
    }
  });

})();
