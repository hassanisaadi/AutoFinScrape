document.getElementById("get-balance").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) {
            console.error("No active tab found.");
            document.getElementById("balance-result").innerText = "Error: No active tab.";
            return;
        }

        console.log("Sending message to content.js...");

        chrome.tabs.sendMessage(tabs[0].id, { action: "extract_balance" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError);
                document.getElementById("balance-result").innerText = "Error: Content script not loaded.";
            } else if (response && response.balance) {
                console.log("Balance response received:", response);
                document.getElementById("balance-result").innerText = "Balance: " + response.balance;
            } else {
                document.getElementById("balance-result").innerText = "Failed to fetch balance.";
            }
        });
    });
});



document.getElementById("download").addEventListener("click", () => {
    let startDate = document.getElementById("start-date").value;
    let endDate = document.getElementById("end-date").value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "download_csv", startDate, endDate }, (response) => {
            if (response?.success) {
                alert("Downloading CSV...");
            } else {
                alert("Failed to download.");
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.sync.get(["defaultStartDate", "defaultEndDate"], function (data) {
        document.getElementById("start-date").value = data.defaultStartDate || "";
        document.getElementById("end-date").value = data.defaultEndDate || "";
    });
});
