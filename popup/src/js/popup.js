/*interfaces*/

var interfaceConfig = document.querySelector(".interface-config");
var loading = document.querySelector(".loading");

/*buttons*/

var btnConfirm = document.querySelector(".btn-confirm input");
var btnCancel = document.querySelector(".btn-cancel input");

/*Inputs*/

var inputConfirmation = document.querySelectorAll(".actions__values")[0];
var inputType = document.querySelectorAll(".actions__values")[1];
var inputDoctor = document.querySelectorAll(".actions__values")[2];
var inputDate = document.querySelectorAll(".actions__values")[3];
var inputMessage = document.querySelectorAll(".actions__values")[4];

/*Mensagens pré formatadas*/

var settings;

/*set close interface*/

interfaceConfig.classList.add("close-interface");
loading.classList.add("close-interface");

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
    //Obter dados do arquivo JSON com informações pré formatadas
    var request = await fetch(chrome.runtime.getURL("backgrounds/config.json"));
    var result = await request.json();
    chrome.storage.local.set({settings: result});
    settings = await chrome.storage.local.get("settings");
    settings = settings["settings"];

    //Iniciar interface de acordo com o estado da requisção

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

//Validação inputs

inputConfirmation.addEventListener("change", () => {
    if(inputType.value !== "Selecione"){
        var confirmation = inputConfirmation.value === "true" ? "confirmations" : "cancellations";
        inputMessage.value = settings["messages"][confirmation][inputType.value];
    }
});

inputType.addEventListener("change", () => {
    var confirmation = inputConfirmation.value === "true" ? "confirmations" : "cancellations";
    console.log(settings);
    inputMessage.value = settings["messages"][confirmation][inputType.value];
});

//Iniciar confirmação

btnConfirm.addEventListener("click", () => {
    if(inputType.value !== "Selecione"){
        informations["confirmation"] = inputConfirmation.value;
        informations["type"] = inputType.value;
        informations["doctor"] = inputDoctor.value;
        informations["date"] = inputDate.value;
        informations["message"] = inputMessage.value;

        chrome.storage.local.set({informations: informations});
        chrome.storage.local.set({settings: settings});

        interfaceConfig.classList.add("close-interface");
        loading.classList.remove("close-interface");

        chrome.storage.local.set({init: true});

        chrome.runtime.sendMessage({action: "execute"});
    }else{
        alert("É necessário preencher todos os campos para iniciar a confirmação.");
    }
});

//Cancelar confirmação

btnCancel.addEventListener("click", () => {
    interfaceConfig.classList.remove("close-interface");
    loading.classList.add("close-interface");
    chrome.storage.local.set({init: false});

    chrome.storage.local.clear();

    chrome.storage.local.get("simplesId", (item) => {
        chrome.tabs.remove(item["simplesId"]);
    });

    chrome.storage.local.get("whatsappTabId", (result) => {
        chrome.tabs.remove(result["whatsappTabId"]);
    });
});

/*Setar data para amanhã*/

var tomorrow = new Date();
var tmDay = tomorrow.getDate() + 1;
tmDay = String(tmDay).padStart(2, "0");
var tmMonth = tomorrow.getMonth() + 1;
tmMonth = String(tmMonth).padStart(2, "0");
var tmYear = tomorrow.getFullYear();

var tmFormat = `${tmYear}-${tmMonth}-${tmDay}`;

inputDate.value = tmFormat;

/*Setar data mínima em input*/

const now = new Date();
const day = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();

var dateBase = "{year}-{month}-{day}";

dateBase = dateBase.replace("{year}", year)
.replace("{month}", String(month).padStart(2, "0"))
.replace("{day}", String(day).padStart(2, "0"));

inputDate.min = dateBase;