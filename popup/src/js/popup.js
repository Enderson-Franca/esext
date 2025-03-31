var btnConfirm = document.querySelector(".btn-confirm input");
var confirm = document.querySelector(".btn-confirm");
var loading = document.querySelector(".loading");

window.addEventListener("load", () => {
    chrome.storage.local.clear();
    chrome.storage.local.get("init", (result) => {
        if(result["init"] !== undefined){
            confirm.style.display = "none";
            loading.style.display = "flex";
        }
    });
});


btnConfirm.addEventListener("click", async () => {
    chrome.storage.local.set({init: true}, () => {
        chrome.runtime.sendMessage({action: "log", message: "Confirmação de pacientes iniciada."});
    });

    chrome.runtime.sendMessage({ action: "execute" }, (response) => {
        console.log("Resposta do background:", response);
    });
});