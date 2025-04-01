// utils/storage.js
export async function saveAccounts(bankId, accounts) {
    const today = new Date().toISOString().split("T")[0];
    const key = `accounts_${bankId}_${today}`;
    
    // Save to Chrome storage
    await chrome.storage.local.set({ [key]: accounts });
    
    // Export to JSON file
    const fileName = `${bankId}_accounts_${today}.json`;
    exportToJson(accounts, fileName);
  }
  
  export async function saveTransactions(bankId, accountId, month, year, transactions) {
    const key = `transactions_${bankId}_${accountId}_${year}_${month}`;
    
    // Save to Chrome storage
    await chrome.storage.local.set({ [key]: transactions });
    
    // Export to JSON file
    const fileName = `${bankId}_${accountId}_transactions_${year}_${month}.json`;
    exportToJson(transactions, fileName);
  }
  
  export async function getRecentAccounts(bankId) {
    // Retrieve most recent account data for a bank
  }
  
  export async function getTransactions(bankId, accountId, month, year) {
    // Retrieve transaction data for a specific account and time period
  }
  
  function exportToJson(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }