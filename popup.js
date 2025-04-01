import { supportedDomains } from "./banks/supported.js";

document.addEventListener('DOMContentLoaded', function() {
  const scrapeButton = document.getElementById('scrape');
  const downloadButton = document.getElementById('download');
  const monthSelect = document.getElementById('month-select');
  const bankLogo = document.getElementById('bank-logo');
  const detectedBank = document.getElementById('detected-bank');
  const notSupportedMessage = document.getElementById('not-supported-message');
  
  let currentBankId = null;
  // let currentAccounts = [];

  // Initially set UI to loading state
  detectedBank.textContent = "Checking...";
  scrapeButton.disabled = true;
  downloadButton.disabled = true;
  monthSelect.disabled = true;
  
  // Check current tab for bank website
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs || tabs.length === 0) {
      showNotSupported("Cannot access current tab");
      return;
    }
    
    const currentTab = tabs[0];
    
    // Check if we're on a website (not a chrome:// page or other special URL)
    if (!currentTab.url || !currentTab.url.startsWith('http')) {
      showNotSupported("This extension only works on bank websites");
      return;
    }
    
    // Extract domain from URL
    const url = new URL(currentTab.url);
    const domain = url.hostname;
    
    // Check if we're on a supported bank website
    const isSupported = supportedDomains.some(supportedDomain => 
      domain.includes(supportedDomain)
    );
    
    if (isSupported) {
      // Try to communicate with the content script
      chrome.tabs.sendMessage(
        currentTab.id, 
        {action: "detect_bank"}, 
        function(response) {
          if (chrome.runtime.lastError) {
            console.log("Error:", chrome.runtime.lastError.message);
            showNotSupported("Content script not loaded. Try refreshing the page.");
            return;
          }
          
          if (response && response.bank && response.bank !== "Unknown") {
            // We got a valid bank response
            // response.name is the full bank name
            currentBankId = response.bank;
            detectedBank.textContent = response.name || response.bank;
            scrapeButton.disabled = false;
            downloadButton.disabled = false;
            monthSelect.disabled = false;
            
            // Show bank logo if available
            if (response.logo) {
              bankLogo.src = response.logo;
              bankLogo.classList.remove('d-none');
            }
          } else {
            showNotSupported("Not a supported bank website");
          }
        }
      );
    } else {
      // Show a message with the current domain
      showNotSupported(`The website "${domain}" is not a supported bank website`);
    }
  });
  
  // Placeholder for the scrape function
  function scrapeAccounts() {
    // TODO: Implement account scraping logic here
  }

  // Placeholder for the scrape function
  function downloadTransactions() {
    // TODO: Implement account scraping logic here
  }

  // Event listener for the scrape button
  if (scrapeButton) {
    scrapeButton.addEventListener('click', scrapeAccounts);
  }

  // Handle download button click
  if (downloadButton) {
    downloadButton.addEventListener('click', downloadTransactions);
  }

  // Helper functions
  function showNotSupported(message) {
    detectedBank.textContent = "Not supported";
    notSupportedMessage.textContent = message;
    notSupportedMessage.classList.remove('d-none');
    scrapeButton.disabled = true;
    downloadButton.disabled = true;
    bankLogo.classList.add('d-none');
    
    // Add a red border to the message for better visibility
    notSupportedMessage.classList.add('alert-danger');
  }
});
