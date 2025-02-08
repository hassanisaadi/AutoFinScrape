function extractBalance() {
    let balanceElement = document.querySelector("span[data-testid='currentBalanceValue']");
    if (balanceElement) {
        return balanceElement.innerText.trim();
    }
    return "Balance not found";
}


function setDateRange(startDate, endDate) {
    let startInput = document.querySelector("#start-date-input");
    let endInput = document.querySelector("#end-date-input");
    if (startInput && endInput) {
        startInput.value = startDate;
        endInput.value = endDate;
        return true;
    }
    return false;
}

function clickDownloadButton() {
    let downloadBtn = document.querySelector("#download-button");
    if (downloadBtn) {
        downloadBtn.click();
        return true;
    }
    return false;
}

console.log("✅ content.js has been injected!");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);

    if (request.action === "extract_balance") {
        let balanceElement = document.querySelector("span[data-testid='currentBalanceValue']");
        let balance = balanceElement ? balanceElement.innerText.trim() : null;

        console.log("Extracted Balance:", balance);

        sendResponse({ balance: balance || "Balance not found" });
        return true; // Ensures asynchronous response
    }
});



// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "extract_balance") {
//         sendResponse({ balance: extractBalance() });
//     } else if (request.action === "download_csv") {
//         let success = setDateRange(request.startDate, request.endDate);
//         if (success) {
//             setTimeout(() => {
//                 clickDownloadButton();
//             }, 2000);
//         }
//         sendResponse({ success });
//     }
// });
