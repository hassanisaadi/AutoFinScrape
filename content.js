/* ==========================
 * 📜 content.js - Detects bank, scrapes accounts, and handles transactions
 * ========================== */
function detectBank() {
    let hostname = window.location.hostname;
    if (hostname.includes("royalbank.com")) return "RBC";
    if (hostname.includes("cibc.com")) return "CIBC";
    if (hostname.includes("td.com")) return "TD";
    return "Unknown";
}

function scrapeRBCAccounts() {
    let accounts = [];
    let accountElements = document.querySelectorAll("ul.accounts-list li.accounts-table__row");

    accountElements.forEach(accountElement => {
        let accountNameElement = accountElement.querySelector(".accounts-table__account-name");
        let balanceElement = accountElement.querySelector(".balance-amount--light");
        let currencyElement = accountElement.querySelector(".balance-currency");

        if (accountNameElement && balanceElement && currencyElement) {
            accounts.push({
                accountName: accountNameElement.innerText.trim(),
                balance: balanceElement.innerText.trim(),
                currency: currencyElement.innerText.trim()
            });
        }
    });
    return accounts;
}

function saveDataToJson(bank, accounts) {
    let today = new Date().toISOString().split("T")[0];
    let fileName = `${bank}_${today}.json`;
    if (document.querySelector(`a[data-file="${fileName}"]`)) return; // Prevent duplicate saves
  
    let blob = new Blob([JSON.stringify(accounts, null, 2)], { type: "application/json" });
    let url = URL.createObjectURL(blob);
  
    let a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.setAttribute("data-file", fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function openDataWindow(accounts) {
    let dataWindow = window.open("", "Scraped Accounts", "width=600,height=800");
    dataWindow.document.body.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <div class="container mt-4">
        <h2 class="mb-3">Scraped Account Balances</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Balance</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            ${accounts.map((account) => `
              <tr>
                <td>${account.accountName}</td>
                <td>${account.balance}</td>
                <td>${account.currency}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
  

async function downloadRBCTransactions(selectedMonth) {
// Ensure selectedMonth is valid
if (!selectedMonth) {
    console.error("Invalid selectedMonth value:", selectedMonth);
    return;
}

    const accounts = document.querySelectorAll("ul.accounts-list li.accounts-table__row");
    const startDate = `${new Date().getFullYear()}-${selectedMonth}-01`;
    const endDate = new Date(new Date().getFullYear(), parseInt(selectedMonth), 0).toISOString().split('T')[0];


    for (let account of accounts) {
        const accountLink = account.querySelector("a");
        if (accountLink) {
            accountLink.click();
            console.log("-----------0");
            // await waitForElement("button.filter-button-selector"); // Update with the actual Filter button selector
            setTimeout(() => {document.getElementById("openFilterButton").click()}, 5000);
            console.log("-----------1");

            document.querySelector("button.filter-button-selector").click();
            await waitForElement("#from-date-selector"); // Update with the actual date input selector

            document.querySelector("#from-date-selector").value = startDate;
            document.querySelector("#to-date-selector").value = endDate;

            document.querySelector("button.apply-filter-selector").click(); // Update with Apply button selector
            await waitForElement("table.transaction-table"); // Update with the actual transaction table selector

            const transactions = scrapeTransactionTable();
            const transactionCountElement = document.querySelector(".transaction-count"); // Update with actual selector
            const transactionCount = transactionCountElement ? parseInt(transactionCountElement.textContent.match(/\d+/)[0]) : 0;

            if (transactions.length !== transactionCount) {
                alert(`Error: Mismatch in transaction count for ${account.querySelector(".accounts-table__account-name").innerText}`);
                return;
            }

            saveTransactionsToJson("RBC", transactions);

            document.querySelector("a.my-accounts-link").click(); // Update with My Accounts link selector
            await waitForElement("ul.accounts-list");
        }
    }
}

function scrapeTransactionTable() {
    const rows = document.querySelectorAll("table.transaction-table tr");
    let transactions = [];

    rows.forEach(row => {
        const columns = row.querySelectorAll("td");
        if (columns.length > 0) {
            transactions.push({
                date: columns[0].innerText.trim(),
                description: columns[1].innerText.trim(),
                amount: columns[2].innerText.trim()
            });
        }
    });

    return transactions;
}

function saveTransactionsToJson(bank, transactions) {
    let today = new Date().toISOString().split("T")[0];
    let fileName = `${bank}_transactions_${today}.json`;

    let blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function waitForElement(selector) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "detect_bank") {
        sendResponse({ bank: detectBank() });
    }
    else if (request.action === "scrape_accounts") {
        let accounts = scrapeRBCAccounts();
        if (accounts.length > 0) {
            saveDataToJson(detectBank(), accounts);
            openDataWindow(accounts);
        }
        sendResponse({ accounts });
    }
    else if (request.action === "download_transactions") {
        const  selectedMonth  = request.month;
        if (!selectedMonth) {
            console.error("Invalid selectedMonth value: undefined!!!!");
            return;
        }
        const bank = detectBank();

        if (bank === "RBC") {
            downloadRBCTransactions(selectedMonth).then(() => {
                sendResponse({ success: true });
            }).catch(err => {
                console.error("❌ Error downloading transactions:", err);
                sendResponse({ success: false, message: err.message });
            });
        } else {
            console.log("🚧 TODO: Implement transaction download for TD");
            sendResponse({ success: false, message: "Feature not yet implemented" });
        }
        return true; // Keep the message channel open for async response
    }
});
