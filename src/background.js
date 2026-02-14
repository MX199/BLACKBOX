/**
 * BLACKBOX Background Service Worker
 * Manages extension lifecycle and message passing between popup and content scripts
 */

// Log installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[BLACKBOX] Extension installed/updated:', details.reason);
  console.log('[BLACKBOX] ENGINE: STABLE V1.1 INITIALIZED');

  // Initialize default settings on first install
  if (details.reason === 'install') {
    chrome.storage.local.set({
      settings: {
        autoSave: true,
        autoSaveInterval: 5,
        offlineGuard: true,
        preventBack: true,
        preventClose: true
      }
    }).catch(error => {
      console.error('[BLACKBOX] Failed to initialize settings:', error);
    });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SETTINGS_UPDATED') {
    // Broadcast settings update to all BandLab tabs
    broadcastSettingsUpdate(msg.settings);
  }
});

/**
 * Broadcasts settings updates to all active BandLab tabs
 * @param {Object} settings - Updated settings object
 */
async function broadcastSettingsUpdate(settings) {
  try {
    const tabs = await chrome.tabs.query({ url: 'https://www.bandlab.com/*' });
    
    console.log(`[BLACKBOX] Broadcasting settings to ${tabs.length} tab(s)`);

    // Send message to each tab
    const messagePromises = tabs.map(tab => {
      return chrome.tabs.sendMessage(tab.id, {
        type: 'SETTINGS_UPDATED',
        settings
      }).catch(error => {
        // Tab might not have content script loaded yet, that's okay
        console.log(`[BLACKBOX] Could not reach tab ${tab.id}:`, error.message);
      });
    });

    await Promise.allSettled(messagePromises);
  } catch (error) {
    console.error('[BLACKBOX] Broadcast failed:', error);
  }
}

// Handle extension context invalidation
chrome.runtime.onSuspend.addListener(() => {
  console.log('[BLACKBOX] Service worker suspending');
});

// Keep service worker alive if needed (optional)
// This ensures the extension remains responsive
let keepAliveInterval = null;

function startKeepAlive() {
  if (keepAliveInterval) return;
  
  keepAliveInterval = setInterval(() => {
    chrome.storage.local.get(['settings'], () => {
      // Simple ping to keep service worker alive
    });
  }, 20000); // Every 20 seconds
}

// Uncomment if you need to keep the service worker alive
// startKeepAlive();
