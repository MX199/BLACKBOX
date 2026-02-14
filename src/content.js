/**
 * BLACKBOX Content Script
 * Handles auto-save functionality, offline detection, and session protection for BandLab Studio
 */

// Default settings
let settings = {
  autoSave: true,
  autoSaveInterval: 5,
  offlineGuard: true,
  preventBack: true,
  preventClose: true
};

// Timer reference for pulse save
let pulseTimer = null;

// Track last save attempt to prevent rapid consecutive saves
let lastSaveAttempt = 0;
const MIN_SAVE_INTERVAL = 1000; // Minimum 1 second between saves

// Track navigation state
let navigationBlocked = false;

/**
 * Checks if the extension context is still valid
 * @returns {boolean} True if context is valid
 */
function isContextValid() {
  try {
    return !!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
  } catch (e) {
    console.warn('[BLACKBOX] Context invalidated:', e);
    return false;
  }
}

/**
 * Stops all running timers and removes UI elements
 */
function stopAllEngines() {
  if (pulseTimer) {
    clearInterval(pulseTimer);
    pulseTimer = null;
  }
  
  const indicator = document.getElementById('blackbox-status-indicator');
  if (indicator) {
    indicator.remove();
  }

  // Remove navigation protection
  disableNavigationProtection();
}

/**
 * Initialize the extension
 */
function initialize() {
  if (!isContextValid()) return;

  // Load settings from storage
  chrome.storage.local.get(['settings'], (res) => {
    if (!isContextValid()) return;
    
    if (chrome.runtime.lastError) {
      console.error('[BLACKBOX] Storage error:', chrome.runtime.lastError);
      return;
    }

    if (res.settings) {
      settings = { ...settings, ...res.settings };
      engage();
      injectStatusIndicator();
      
      // Enable navigation protection if in studio and settings allow
      if (window.location.pathname.includes('/studio')) {
        enableNavigationProtection();
      }
    }
  });

  // Listen for settings updates
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!isContextValid()) return;
    
    if (msg.type === 'SETTINGS_UPDATED') {
      settings = msg.settings;
      engage();
      
      // Update navigation protection
      if (window.location.pathname.includes('/studio')) {
        enableNavigationProtection();
      } else {
        disableNavigationProtection();
      }
    }
  });
}

/**
 * Starts or restarts the auto-save engine based on current settings
 */
function engage() {
  // Clear existing timer
  if (pulseTimer) {
    clearInterval(pulseTimer);
    pulseTimer = null;
  }

  // Start new timer if auto-save is enabled
  if (settings.autoSave) {
    const intervalMs = Math.max(1000, settings.autoSaveInterval * 1000);
    pulseTimer = setInterval(attemptSmartSave, intervalMs);
    console.log(`%c [BLACKBOX] Pulse Save Engaged (${settings.autoSaveInterval}s interval) `, 'color: #FF4B4B; font-weight: bold;');
  } else {
    console.log('%c [BLACKBOX] Pulse Save Disengaged ', 'color: #FF4B4B; font-weight: bold;');
  }
}

/**
 * Checks if there are unsaved changes in BandLab Studio
 * @returns {boolean} True if there are unsaved changes
 */
function hasUnsavedChanges() {
  const saveBtn = document.getElementById('studio-header-save-button');
  if (!saveBtn) return false;
  
  // Button is clickable when there are unsaved changes
  return !(
    saveBtn.disabled || 
    saveBtn.classList.contains('disabled') || 
    saveBtn.getAttribute('aria-disabled') === 'true'
  );
}

/**
 * Attempts to save if conditions are met
 */
function attemptSmartSave() {
  // Validate context
  if (!isContextValid()) {
    stopAllEngines();
    return;
  }

  // Only attempt save on BandLab Studio pages
  if (!window.location.pathname.includes('/studio')) {
    return;
  }

  // Check online status
  if (!navigator.onLine) {
    return;
  }

  // Rate limiting: prevent saves too close together
  const now = Date.now();
  if (now - lastSaveAttempt < MIN_SAVE_INTERVAL) {
    return;
  }

  // Find and click save button if there are unsaved changes
  const saveBtn = document.getElementById('studio-header-save-button');
  if (saveBtn && hasUnsavedChanges()) {
    try {
      saveBtn.click();
      lastSaveAttempt = now;
      console.log('%c [BLACKBOX] Pulse Save Applied - Waiting for confirmation... ', 'color: #FF4B4B; font-weight: bold;');
      
      // Verify save success by checking for BandLab's success message
      verifySaveSuccess();
    } catch (error) {
      console.error('[BLACKBOX] Save failed:', error);
    }
  }
}

/**
 * Verifies that the save was successful by detecting BandLab's "Project saved" popup
 */
function verifySaveSuccess() {
  let checkAttempts = 0;
  const maxAttempts = 30; // Check for 3 seconds (30 * 100ms)
  
  const verifyInterval = setInterval(() => {
    checkAttempts++;
    
    // Look for BandLab's success message
    // BandLab shows a toast/notification that says "Project saved"
    const successMessages = document.querySelectorAll('[class*="toast"], [class*="notification"], [class*="snackbar"], [class*="message"]');
    
    let saveConfirmed = false;
    successMessages.forEach(element => {
      const text = element.textContent.toLowerCase();
      if (text.includes('project saved') || text.includes('saved successfully') || text.includes('changes saved')) {
        saveConfirmed = true;
      }
    });
    
    if (saveConfirmed) {
      clearInterval(verifyInterval);
      console.log('%c [BLACKBOX] ✓ Save Confirmed - Project saved successfully ', 'color: #00FF00; font-weight: bold;');
      return;
    }
    
    // Stop checking after max attempts
    if (checkAttempts >= maxAttempts) {
      clearInterval(verifyInterval);
      
      // Check if save button is still clickable (means save might have failed)
      if (hasUnsavedChanges()) {
        console.log('%c [BLACKBOX] ⚠ Save verification timeout - Unable to confirm ', 'color: #FFA500; font-weight: bold;');
      } else {
        // Button is disabled, so save probably worked even if we didn't see the popup
        console.log('%c [BLACKBOX] ✓ Save likely successful (button disabled) ', 'color: #00FF00; font-weight: bold;');
      }
    }
  }, 100); // Check every 100ms
}

/**
 * Enables navigation protection to prevent accidental back/close
 */
function enableNavigationProtection() {
  if (!window.location.pathname.includes('/studio')) return;
  
  // Prevent back button navigation
  if (settings.preventBack) {
    enableBackButtonProtection();
  } else {
    disableBackButtonProtection();
  }

  // Prevent page close/reload
  if (settings.preventClose) {
    enableCloseProtection();
  } else {
    disableCloseProtection();
  }
}

/**
 * Disables all navigation protection
 */
function disableNavigationProtection() {
  disableBackButtonProtection();
  disableCloseProtection();
}

/**
 * Enables back button protection
 */
function enableBackButtonProtection() {
  if (navigationBlocked) return;
  
  // Push a dummy state to history
  history.pushState(null, '', location.href);
  
  // Listen for popstate events (back button)
  window.addEventListener('popstate', handleBackButton);
  
  navigationBlocked = true;
  console.log('%c [BLACKBOX] Back Navigation Locked ', 'color: #FF4B4B; font-weight: bold;');
}

/**
 * Disables back button protection
 */
function disableBackButtonProtection() {
  window.removeEventListener('popstate', handleBackButton);
  navigationBlocked = false;
  console.log('%c [BLACKBOX] Back Navigation Unlocked ', 'color: #FF4B4B; font-weight: bold;');
}

/**
 * Handles back button presses
 */
function handleBackButton(event) {
  if (!settings.preventBack) return;
  
  // Check if there are unsaved changes
  if (hasUnsavedChanges()) {
    // Push state again to prevent navigation
    history.pushState(null, '', location.href);
    
    // Show warning
    showNavigationWarning();
  } else {
    // Allow navigation if no unsaved changes
    window.removeEventListener('popstate', handleBackButton);
  }
}

/**
 * Shows a warning when trying to navigate away with unsaved changes
 */
function showNavigationWarning() {
  // Remove existing warning if any
  const existing = document.getElementById('blackbox-nav-warning');
  if (existing) existing.remove();
  
  const warning = document.createElement('div');
  warning.id = 'blackbox-nav-warning';
  warning.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: #141414;
    border: 2px solid #FF3131;
    border-radius: 12px;
    padding: 24px 32px;
    color: white;
    font-family: 'Inter', sans-serif;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
    animation: blackboxFadeIn 0.2s ease;
  `;
  
  warning.innerHTML = `
    <style>
      @keyframes blackboxFadeIn {
        from { opacity: 0; transform: translate(-50%, -48%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
      }
    </style>
    <h2 style="margin: 0 0 12px; color: #FF3131; font-size: 18px; font-weight: 800; letter-spacing: 2px;">⚠️ UNSAVED WORK</h2>
    <p style="margin: 0 0 20px; color: #999; font-size: 13px;">You have unsaved changes in your project.</p>
    <button id="blackbox-dismiss-warning" style="
      background: #FF3131;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
    ">Got It</button>
  `;
  
  document.body.appendChild(warning);
  
  // Add dismiss handler
  document.getElementById('blackbox-dismiss-warning').addEventListener('click', () => {
    warning.remove();
  });
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    if (warning && warning.parentNode) {
      warning.remove();
    }
  }, 3000);
}

/**
 * Enables page close/reload protection
 */
function enableCloseProtection() {
  window.addEventListener('beforeunload', handleBeforeUnload);
  console.log('%c [BLACKBOX] Page Close Protection Enabled ', 'color: #FF4B4B; font-weight: bold;');
}

/**
 * Disables page close/reload protection
 */
function disableCloseProtection() {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  console.log('%c [BLACKBOX] Page Close Protection Disabled ', 'color: #FF4B4B; font-weight: bold;');
}

/**
 * Handles beforeunload event to warn about unsaved changes
 */
function handleBeforeUnload(event) {
  if (!settings.preventClose) return;
  
  // Only show warning if there are unsaved changes
  if (hasUnsavedChanges()) {
    event.preventDefault();
    event.returnValue = ''; // Chrome requires returnValue to be set
    return ''; // Some browsers require a return value
  }
}

/**
 * Injects the status indicator into the page
 */
function injectStatusIndicator() {
  // Prevent duplicate indicators
  if (document.getElementById('blackbox-status-indicator')) {
    return;
  }

  const div = document.createElement('div');
  div.id = 'blackbox-status-indicator';
  
  // Get logo URL safely
  let logoUrl;
  try {
    logoUrl = isContextValid() ? chrome.runtime.getURL('logo-png.png') : '';
  } catch (e) {
    logoUrl = '';
  }
  
  // Subtle indicator at bottom center
  div.style.cssText = `
    position: fixed; 
    bottom: 12px; 
    left: 50%; 
    transform: translateX(-50%);
    z-index: 2147483647; 
    background: transparent;
    padding: 4px 12px; 
    display: flex; 
    align-items: center; 
    gap: 8px;
    pointer-events: none; 
    color: rgba(255, 49, 49, 0.5);
    font-family: 'Inter', sans-serif; 
    font-size: 7px; 
    font-weight: 800;
    letter-spacing: 2px; 
    text-transform: uppercase;
    user-select: none;
  `;
  
  div.innerHTML = `
    <img src="${logoUrl}" style="height: 10px; opacity: 0.3; filter: drop-shadow(0 0 1px rgba(255, 49, 49, 0.4));" alt="BLACKBOX">
    <span>Blackbox Active</span>
  `;
  
  // Add to page when DOM is ready
  if (document.body) {
    document.body.appendChild(div);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(div);
    });
  }
}

/**
 * Creates the offline guard overlay
 */
function createOfflineOverlay() {
  const div = document.createElement('div');
  div.id = 'blackbox-offline';
  div.style.cssText = `
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background: rgba(5, 5, 5, 0.98); 
    z-index: 2147483647; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: white; 
    font-family: 'Inter', sans-serif; 
    backdrop-filter: blur(20px);
  `;
  div.innerHTML = `
    <div style="text-align: center;">
      <h1 style="color: #FF4B4B; letter-spacing: 10px; font-weight: 800; margin: 0;">OFFLINE</h1>
      <p style="color: #444; font-size: 12px; text-transform: uppercase; margin: 10px 0 0;">Signal Lost. Workspace Frozen.</p>
    </div>
  `;
  return div;
}

/**
 * Handle offline event
 */
function handleOffline() {
  if (!settings.offlineGuard) return;
  
  // Prevent duplicate overlays
  if (document.getElementById('blackbox-offline')) return;
  
  const overlay = createOfflineOverlay();
  document.body.appendChild(overlay);
  
  console.log('%c [BLACKBOX] Offline Guard Activated ', 'color: #FF4B4B; font-weight: bold;');
}

/**
 * Handle online event
 */
function handleOnline() {
  const guard = document.getElementById('blackbox-offline');
  if (guard) {
    guard.remove();
    console.log('%c [BLACKBOX] Connection Restored ', 'color: #FF4B4B; font-weight: bold;');
  }
}

// Event listeners
window.addEventListener('offline', handleOffline);
window.addEventListener('online', handleOnline);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopAllEngines();
});

// Initialize the extension
if (isContextValid()) {
  initialize();
}