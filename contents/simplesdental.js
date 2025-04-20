console.log("Script injetado na simples dental");


var elementHtml = document.createElement("div");
elementHtml.style = "position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999999999999;";

elementHtmlText = document.createElement("span");
elementHtmlText.innerText = "Confirmando pacientes, aguarde!";
elementHtmlText.style = "color: white; font-size: 3em; font-weight: bold;";

elementHtml.appendChild(elementHtmlText);
document.body.appendChild(elementHtml);

var patientsIncorrects = [];
var informations;

const now = new Date();

var day;
var month;
const year = now.getFullYear();
var dateString;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function verifyIsItem(item){
    if(item){
        return true;
    }else{
        return false;
    }
}

function verifyIsList(list){
    if(list.length > 0){
        return true;
    }else{
        return false;
    }
}

(async () => {
    while(true){
        var profissional = document.querySelector(".ng-tns-c3082329526-6");
        if(await verifyIsItem(profissional)){
            break;
        }
        await sleep(10);
    }
    
    var profissionalText = profissional.innerText.trim();
    
    if(profissionalText !== "Todos os profissionais"){
        profissional.click();
        
        while(true){
            var optionClick = document.querySelectorAll(".mat-option-text");
            if(await verifyIsList(optionClick)){
                await sleep(500);
                optionClick[0].click();
                break;
            }
            await sleep(200);
        }
        
        await sleep(1000);
    }
    
    
    while(true){
        var cadeira = document.querySelector(".ng-tns-c3082329526-8");
        if(await verifyIsItem(cadeira)){
            break;
        }
        
        await sleep(10);
    }
    
    
    var cadeiraText = cadeira.innerText.trim();
    
    if(cadeiraText !== "Todas as cadeiras"){
        cadeira.click();
        while(true){
            var optionClick = document.querySelectorAll(".mat-option-text");
            if(await verifyIsList(optionClick)){
                await sleep(500);
                optionClick[0].click();
                console.log("finalizou");
                break;
            }
            
            await sleep(200);
        }
        await sleep(1000);
    }
    
    while(true){
        var type = document.querySelector(".ng-tns-c3082329526-3");
        if(await verifyIsItem(type)){
            break;
        }
        
        await sleep(10);
    }
    
    
    var typeText = document.querySelector(".ng-tns-c3082329526-3").innerText.trim();
    
    if(typeText !== "Dia"){
        type.click();
        while(true){
            var optionClick = document.querySelectorAll(".mat-option-text");
            if(await verifyIsList(optionClick)){
                await sleep(500);
                optionClick[1].click();
                console.log("finalizou");
                break;
            }
            
            await sleep(200);
        }
        await sleep(1000);
    }
    
    //Navegar entre os dias até a data escolhida
    
    var nextDayBtn = document.querySelector("[data-testid='btnProximoPeriodo']");
    
    while(true){
        var daySimples = document.querySelector(".header-agenda-group span:nth-child(1)");
        if(await verifyIsItem(daySimples)){
            break;
        }
        
        await sleep(10);
    }

    informations = await chrome.storage.local.get("informations");
    informations = informations["informations"];
    var dateForm = informations["date"];
    dateForm = dateForm.split("-");
    dateForm = {
        day: dateForm[2],
        month: dateForm[1],
        year: dateForm[0]
    };
    var daySelected = new Date(dateForm.year, dateForm.month - 1, dateForm.day);
    daySelected = daySelected.getDate();

    while(true){
        daySimples = document.querySelector(".header-agenda-group span:nth-child(1)");
        var daySimplesValue = daySimples.innerText.trim();
        if(daySimplesValue == daySelected){
            console.log("Dia correto");
            break;
        }else{
            nextDayBtn.click();
            console.log(daySimplesValue);
        }
        
        await sleep(200);
    }
           
    //formatar data antes de enviar

    while(true){
        day = document.querySelector(".header-agenda-group span:nth-child(1)");
        if(await verifyIsItem(day)){
            break;
        }
        
        await sleep(10);
    }
    
    day = day.innerText.trim();
    day = String(day).padStart(2, "0");
    month = document.querySelector(".header-agenda-group span:nth-child(2)").innerText.trim();
    month = month.replace("/", "");
    month = String(month).padStart(2, "0");
    
    dateString = `${day}/${month}/${year}`;
    confirmation();
})();

async function confirmation(){
    console.log("confirmation");
    
    while(true){
        var allHours = document.querySelectorAll("[data-consulta-id]");
        if(await verifyIsList(allHours)){
            break;
        }

        await sleep(10);
    }

    for(let element of allHours){
        
        if(element.classList.contains("compromisso")){
            continue;
            //consulta-status0 - agendado
            //consulta-status6 - Cancelado pelo paciente
            //consulta-status5 - Cancelado pelo profissional
            //consulta-status1 - Confirmado
            //consulta-status4 - aguardando
        }

        var status = ["consulta-status1", "consulta-status4", "consulta-status5", "consulta-status6"];
        
        var statusOn = false;

        for(let i = 0; i < status.length; i++){
            if(element.classList.contains(status[i])){
                statusOn = true;
            }
        }

        if(statusOn){
            continue;
        }
        
        element.click();
        console.log(element);

        var background = document.querySelector(".preview-backdrop");

        await sleep(1000);

        while(true){
            var cardName = document.querySelector(".mat-mdc-card-header-text .mat-mdc-tooltip-trigger").innerText;
            if(await verifyIsItem(cardName)){
                break;
            }
            
            await sleep(10);
        }

        var cardPhone = document.querySelector(".mat-mdc-card-header-text .mat-mdc-card-subtitle").innerText;
        var cardDr = document.querySelectorAll(".mat-mdc-card-content .mat-mdc-tooltip-trigger")[0].innerText;
        var cardHour = document.querySelectorAll(".mat-mdc-card-content .mat-mdc-tooltip-trigger")[3].querySelector("span").innerText;
        var cardDate = dateString;

        while(true){
            var statusConsulta = document.querySelectorAll(".preview-row")[2].querySelector(".mat-select-trigger");
            if(await verifyIsItem(cardName)){
                break;
            }
            
            await sleep(10);
        }

        statusConsulta.click();
        
        while(true){
            statusConsultaItem = document.querySelectorAll(".mat-select-panel .mat-option-text")[7];
            if(await verifyIsItem(cardName)){
                break;
            }
            
            await sleep(10);
        }

        statusConsultaItem.click();

        await sleep(500);

        background.click();

        if(!await sendWhatsapp(cardName, cardPhone, cardDr, cardHour, cardDate)){
            patientsIncorrects.push(cardName);
        }
    }

    chrome.storage.local.set({init: false});
    chrome.runtime.sendMessage({action: "log", message: "Confirmação finalizada com sucesso!"});
    chrome.runtime.sendMessage({action: "log", message: patientsIncorrects});
    elementHtmlText.innerText = "FINALIZADO."; 
}

async function sendWhatsapp(cardName, cardPhone, cardDr, cardHour, cardDate){
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({action: "forWhatsapp", name: cardName, phone: cardPhone, dr: cardDr, hour: cardHour, date: cardDate}, (response) => {
            if(response.success){
                resolve(true);
            }else{
                resolve(false);
            }
        });
    });
}