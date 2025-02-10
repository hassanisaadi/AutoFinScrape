document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "detect_bank" }, (response) => {
            if (response && response.bank) {
                document.getElementById("detected-bank").innerText = response.bank;
                document.getElementById("bank-logo").src = `icons/${response.bank.toLowerCase()}_logo.svg`;
            }
        });
    });

    document.getElementById("scrape").addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "scrape_accounts" });
        });
    });

    const downloadButton = document.getElementById("download");
    if (downloadButton) {
        downloadButton.addEventListener("click", () => {
            const monthSelect = document.getElementById("month-select");

            if (!monthSelect) {
                console.error("Month selector element not found.");
                return;
            }

            const selectedMonth = monthSelect.value;
            if (!selectedMonth) {
                console.error("No month selected. Please choose a month.");
                return;
            }

            console.log(`Selected month: ${selectedMonth}`);

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "download_transactions", month: selectedMonth },
                    (response) => {
                        if (response && response.success) {
                            console.log("Transactions downloaded successfully.");
                        } else {
                            console.error("Failed to download transactions.");
                        }
                    }
                );
            });
        });
    }

    // document.getElementById("download").addEventListener("click", () => {
    //     const monthSelect = document.getElementById("month-select");
    //     const selectedMonth = monthSelect.value; // Ensure a valid selection

    //     if (!selectedMonth) {
    //         console.error("Invalid selectedMonth value: undefined+++");
    //         return;
    //     }

    //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //         chrome.tabs.sendMessage(
    //             tabs[0].id,
    //             { action: "download_transactions", month: selectedMonth },
    //             (response) => {
    //                 if (response && response.success) {
    //                     console.log("Transactions downloaded successfully.");
    //                 } else {
    //                     console.error("Failed to download transactions. Please check the bank page or try again.");
    //                 }
    //             }
    //         );
    //     });
    // });
});
