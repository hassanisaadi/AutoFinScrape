chrome.runtime.onInstalled.addListener(() => {
    console.log("✅ Bank Scraper Extension Installed.");
});

// Force inject content.js when a bank page is loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("royalbank.com")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
        }).then(() => {
            console.log("✅ Injected content.js on page load");
        }).catch((error) => {
            console.error("❌ Failed to inject content script:", error);
        });
    }
});
