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

//Validação inputs

inputConfirmation.addEventListener("change", () => {
    if(inputType.value !== "Selecione"){
        var confirmation = inputConfirmation.value === "true" ? "confirmations" : "cancellations";
        inputMessage.value = configs["messages"][confirmation][inputType.value];
    }
});

inputType.addEventListener("change", () => {
    var confirmation = inputConfirmation.value === "true" ? "confirmations" : "cancellations";
    console.log(configs);
    inputMessage.value = configs["messages"][confirmation][inputType.value];
});

//Iniciar confirmação

btnConfirm.addEventListener("click", () => {
    if(inputType.value !== "Selecione"){
        console.log(document.querySelectorAll(".actions__values"));
        informations["confirmation"] = inputConfirmation.value;
        informations["type"] = inputType.value;
        informations["doctor"] = inputDoctor.value;
        informations["date"] = inputDate.value;
        informations["message"] = inputMessage.value;

        chrome.storage.local.set({informations: informations});

        interfaceConfig.classList.add("close-interface");
        loading.classList.remove("close-interface");
        chrome.storage.local.set({init: true});
        chrome.runtime.sendMessage({action: "execute", settings: configs}, (response) => {
            console.log(response);
        });
    }else{
        alert("É necessário preencher todos os campos para iniciar a confirmação.");
    }
    
});

//Cancelar confirmação

btnCancel.addEventListener("click", () => {
    interfaceConfig.classList.remove("close-interface");
    loading.classList.add("close-interface");
    chrome.storage.local.set({init: false});
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