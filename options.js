document.addEventListener('DOMContentLoaded', function() {
  // Get form elements
  const settingsForm = document.getElementById('settings-form');
  const defaultExportFormat = document.getElementById('default-export-format');
  const autoSaveData = document.getElementById('auto-save-data');
  const resetDefaultsButton = document.getElementById('reset-defaults');
  const statusAlert = document.getElementById('status');
  
  // Load saved settings
  loadSavedSettings();
  
  // Save settings when form is submitted
  settingsForm.addEventListener('submit', function(event) {
    event.preventDefault();
    saveSettings();
  });
  
  // Reset to defaults when button is clicked
  resetDefaultsButton.addEventListener('click', function() {
    resetToDefaults();
  });
  
  // Function to load saved settings from storage
  function loadSavedSettings() {
    chrome.storage.sync.get({
      // Default values
      defaultExportFormat: 'json',
      autoSaveData: true,
      bankSettings: {
        RBC: {
          includeChecking: true,
          includeSavings: true,
          includeCredit: true,
          includeInvestments: true
        },
        CIBC: {
          includeChecking: true,
          includeSavings: true,
          includeCredit: true,
          includeInvestments: true
        },
        TD: {
          // TD specific settings
        }
      }
    }, function(items) {
      // Set general settings
      defaultExportFormat.value = items.defaultExportFormat;
      autoSaveData.checked = items.autoSaveData;
      
      // Set RBC settings
      if (items.bankSettings.RBC) {
        document.getElementById('rbc-include-checking').checked = items.bankSettings.RBC.includeChecking;
        document.getElementById('rbc-include-savings').checked = items.bankSettings.RBC.includeSavings;
        document.getElementById('rbc-include-credit').checked = items.bankSettings.RBC.includeCredit;
        document.getElementById('rbc-include-investments').checked = items.bankSettings.RBC.includeInvestments;
      }
      
      // Set CIBC settings
      if (items.bankSettings.CIBC) {
        document.getElementById('cibc-include-checking').checked = items.bankSettings.CIBC.includeChecking;
        document.getElementById('cibc-include-savings').checked = items.bankSettings.CIBC.includeSavings;
        document.getElementById('cibc-include-credit').checked = items.bankSettings.CIBC.includeCredit;
        document.getElementById('cibc-include-investments').checked = items.bankSettings.CIBC.includeInvestments;
      }
      
      // Set other bank settings as they are added
    });
  }
  
  // Function to save settings to storage
  function saveSettings() {
    // Get RBC settings
    const rbcSettings = {
      includeChecking: document.getElementById('rbc-include-checking').checked,
      includeSavings: document.getElementById('rbc-include-savings').checked,
      includeCredit: document.getElementById('rbc-include-credit').checked,
      includeInvestments: document.getElementById('rbc-include-investments').checked
    };
    
    // Get CIBC settings
    const cibcSettings = {
      includeChecking: document.getElementById('cibc-include-checking').checked,
      includeSavings: document.getElementById('cibc-include-savings').checked,
      includeCredit: document.getElementById('cibc-include-credit').checked,
      includeInvestments: document.getElementById('cibc-include-investments').checked
    };
    
    // Save all settings
    chrome.storage.sync.set({
      defaultExportFormat: defaultExportFormat.value,
      autoSaveData: autoSaveData.checked,
      bankSettings: {
        RBC: rbcSettings,
        CIBC: cibcSettings
        // Add other bank settings here
      }
    }, function() {
      // Show success message
      statusAlert.textContent = 'Settings saved!';
      statusAlert.classList.remove('d-none');
      
      // Hide message after 3 seconds
      setTimeout(function() {
        statusAlert.classList.add('d-none');
      }, 3000);
    });
  }
  
  // Function to reset settings to defaults
  function resetToDefaults() {
    // Set default values
    defaultExportFormat.value = 'json';
    autoSaveData.checked = true;
    
    // RBC defaults
    document.getElementById('rbc-include-checking').checked = true;
    document.getElementById('rbc-include-savings').checked = true;
    document.getElementById('rbc-include-credit').checked = true;
    document.getElementById('rbc-include-investments').checked = true;
    
    // CIBC defaults
    document.getElementById('cibc-include-checking').checked = true;
    document.getElementById('cibc-include-savings').checked = true;
    document.getElementById('cibc-include-credit').checked = true;
    document.getElementById('cibc-include-investments').checked = true;
    
    // Save the defaults
    saveSettings();
  }
});
