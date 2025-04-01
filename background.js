import { supportedDomains } from "./banks/supported";

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Auto Fin Scraper Installed.");
});

// When a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only run when the page is fully loaded
  if (changeInfo.status === "complete" && tab.url) {
    // Check if the current URL is a supported bank website
    const isSupportedBank = supportedDomains.some(domain => tab.url.includes(domain));
    
    if (isSupportedBank) {
      console.log("Supported bank detected: " + tab.url);
      
      // Inject the content script
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      }).then(() => {
        console.log("✅ Content script injected successfully");
      }).catch((error) => {
        console.error("❌ Failed to inject content.js:", error);
      });
    } else {
      // Disable popup and notify user
      chrome.browserAction.disable(tabId);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon.png',
        title: 'Unsupported Bank',
        message: 'This webpage URL is not supported.'
      });
    }
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background script received message:", request);
  
  // Add any background script message handling here
  
  return true; // Keep the message channel open for async responses
});

  