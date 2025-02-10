chrome.runtime.onInstalled.addListener(() => {
    console.log("✅ Auto Fin Scraper Installed.");
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
      if (tab.url.includes("royalbank.com") || tab.url.includes("td.com")) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["content.js"]
        }).catch((error) => console.error("❌ Failed to inject content.js:", error));
      }
    }
  });
  