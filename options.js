document.addEventListener("DOMContentLoaded", function () {
    loadOptions();

    document.getElementById("save-options").addEventListener("click", saveOptions);
});

function saveOptions() {
    let bankUrl = document.getElementById("bank-url").value;
    let startDate = document.getElementById("default-start-date").value;
    let endDate = document.getElementById("default-end-date").value;

    chrome.storage.sync.set({
        bankUrl: bankUrl,
        defaultStartDate: startDate,
        defaultEndDate: endDate
    }, function () {
        let status = document.getElementById("status");
        status.textContent = "Settings saved!";
        setTimeout(() => { status.textContent = ""; }, 2000);
    });
}

function loadOptions() {
    chrome.storage.sync.get(["bankUrl", "defaultStartDate", "defaultEndDate"], function (data) {
        document.getElementById("bank-url").value = data.bankUrl || "";
        document.getElementById("default-start-date").value = data.defaultStartDate || "";
        document.getElementById("default-end-date").value = data.defaultEndDate || "";
    });
}
