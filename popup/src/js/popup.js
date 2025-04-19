/*interfaces*/

var interfaceConfig = document.querySelector(".interface-config");
var loading = document.querySelector(".loading");

/*buttons*/

var btnConfirm = document.querySelector(".btn-confirm input");
var btnCancel = document.querySelector(".btn-cancel input");

/*set close interface*/

interfaceConfig.classList.add("close-interface");
loading.classList.add("close-interface");

/*Mensagens pré formatadas*/

var configs;

/*Valores do formulário*/

var informations = {
    confirmation: null,
    type: null,
    doctor: null,
    date: null,
    message: null
}

/*load interface*/

window.addEventListener("load", async () => {
    var request = await fetch(chrome.runtime.getURL("backgrounds/config.json"));
    var result = await request.json();
    configs = result;

    chrome.storage.local.get("init", (result) => {
        console.log(result["init"]);
        if(result['init'] !== undefined && result["init"]){
            interfaceConfig.classList.add("close-interface");
            loading.classList.remove("close-interface");
        }else{
            interfaceConfig.classList.remove("close-interface");
            loading.classList.add("close-interface");
        }
    });
});

btnConfirm.addEventListener("click", () => {
    console.log(document.querySelectorAll(".actions__values"));
    informations["confirmation"] = document.querySelectorAll(".actions__values")[0].value;
    informations["type"] = document.querySelectorAll(".actions__values")[1].value;
    informations["doctor"] = document.querySelectorAll(".actions__values")[2].value;
    informations["date"] = document.querySelectorAll(".actions__values")[3].value;
    informations["message"] = document.querySelectorAll(".actions__values")[4].value;

    chrome.storage.local.set({informations: informations});

    interfaceConfig.classList.add("close-interface");
    loading.classList.remove("close-interface");
    chrome.storage.local.set({init: true});
    chrome.runtime.sendMessage({action: "execute", configs: configs}, (response) => {
        console.log(response);
    });
});

btnCancel.addEventListener("click", () => {
    interfaceConfig.classList.remove("close-interface");
    loading.classList.add("close-interface");
    chrome.storage.local.set({init: false});
});

/*Setar data mínima em input*/

var inputDate = document.querySelectorAll(".actions__values")[3];
const now = new Date();

const day = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();

var dateBase = "{year}-{month}-{day}";

dateBase = dateBase.replace("{year}", year)
.replace("{month}", String(month).padStart(2, "0"))
.replace("{day}", String(day).padStart(2, "0"));

inputDate.min = dateBase;

/*

btnConfirm.addEventListener("click", async () => {
    chrome.storage.local.set({init: true}, () => {
        confirm.style.display = "none";
        loading.style.display = "flex";
        chrome.runtime.sendMessage({action: "log", message: "Confirmação de pacientes iniciada."});
    });

    chrome.runtime.sendMessage({ action: "execute" }, (response) => {
        console.log("Resposta do background:", response);
    });
});

btnCancel.addEventListener("click", () => {
    chrome.runtime.onSuspend.addListener(function() {
        // Código para finalizar processos ou encerrar operações
        console.log("Extensão suspensa!");
    });
});

*/