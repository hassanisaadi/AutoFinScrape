function detectBank() {
  const hostname = window.location.hostname;
  const registry = window.BankRegistry || [];

  for (const BankClass of registry) {
    const instance = new BankClass();
    if (instance.detect(hostname)) {
      console.log("Detected bank:", instance.constructor.name);
      return instance;
    }
  }

  console.log("No bank detected.");
  return null;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);

  const currentBank = detectBank();
  
  if (request.action === "detect_bank") {
    if (currentBank){
      sendResponse({
        bank: currentBank.id,
        name: currentBank.name,
        logo: currentBank.logoUrl || null
      });
    } else {
      sendResponse({ bank: "Unknown" });
    }
  }
  // else if (request.action === "scrape_accounts") {
  //   const bankId = detectBank();
  //   const bank = banks[bankId];
    
  //   if (bank && typeof bank.scrapeAccounts === 'function') {
  //     try {
  //       const accounts = bank.scrapeAccounts();
  //       if (accounts.length > 0) {
  //         // Open a new window to display accounts
  //         openAccountsWindow(accounts);
  //       }
  //       sendResponse({ accounts });
  //     } catch (error) {
  //       console.error("Error scraping accounts:", error);
  //       sendResponse({ error: error.message });
  //     }
  //   } else {
  //     sendResponse({ error: "Bank not supported or scraping function not available" });
  //   }
  // }
  // else if (request.action === "download_transactions") {
  //   const bankId = detectBank();
  //   const bank = banks[bankId];
  //   const { accountId, month, year } = request;
    
  //   if (!month) {
  //     sendResponse({ error: "Month not specified" });
  //     return true;
  //   }
    
  //   if (bank && typeof bank.downloadTransactions === 'function') {
  //     const startDate = new Date(year || new Date().getFullYear(), parseInt(month) - 1, 1);
  //     const endDate = new Date(year || new Date().getFullYear(), parseInt(month), 0);
      
  //     bank.downloadTransactions(accountId, startDate, endDate)
  //       .then(transactions => {
  //         if (transactions.length > 0) {
  //           saveTransactionsToJson(bankId, accountId || 'all', transactions);
  //         }
  //         sendResponse({ success: true, transactions });
  //       })
  //       .catch(error => {
  //         console.error("Error downloading transactions:", error);
  //         sendResponse({ error: error.message });
  //       });
      
  //     return true; // Keep the message channel open for async response
  //   } else {
  //     sendResponse({ error: "Bank not supported or download function not available" });
  //   }
  // }
  
  return true; // Keep the message channel open for async responses
});
