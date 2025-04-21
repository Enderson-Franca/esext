console.log("Script injetado na simples dental");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "confirmation":
            confirmation();
        break;
    }
});

//Definição de variáveis globais

var patientsIncorrects = [];
var informations;
var formattedDate;
var screenText;

(async () => {
    //obtem dados da storage
    informations = await chrome.storage.local.get("informations");
    informations = informations["informations"];
    //Criar tela para impedir de ter interações com a página e colocar o aviso de confirmando pacientes

    var screen = document.createElement("div");
    screen.style = "position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999999999999;";

    screenText = document.createElement("span");
    screenText.innerText = "Confirmando pacientes, aguarde!";
    screenText.style = "color: white; font-size: 3em; font-weight: bold;";

    screen.appendChild(screenText);
    document.body.appendChild(screen);
    
})();

//Definição de funções globais

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

//Função responsável por configurar a interface da simples dental da forma correta para as confirmações

async function configInterface(){
    return new Promise(async (resolve) => {
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
    
        //Navegar entre os dias
    
        var nextDayBtn = document.querySelector("[data-testid='btnProximoPeriodo']");
        
        while(true){
            var daySimples = document.querySelector(".header-agenda-group span:nth-child(1)");
            if(await verifyIsItem(daySimples)){
                break;
            }
            await sleep(10);
        }
    
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
                break;
            }else{
                nextDayBtn.click();
            }
            await sleep(300);
        }

        resolve();
    });
}

async function dateFormatString(){
    return new Promise(async (resolve) => {
        while(true){
            day = document.querySelector(".header-agenda-group span:nth-child(1)");
            if(await verifyIsItem(day)){
                break;
            }
            await sleep(10);
        }
    
        var now = new Date();
        
        var day = day.innerText.trim();
        day = String(day).padStart(2, "0");
        var month = document.querySelector(".header-agenda-group span:nth-child(2)").innerText.trim();
        month = month.replace("/", "");
        month = String(month).padStart(2, "0");
        var year = now.getFullYear();
        
        formattedDate = `${day}/${month}/${year}`;
        resolve();
    });
}

async function confirmation(){
    await configInterface();
    await dateFormatString();

    while(true){
        var allHours = document.querySelectorAll("[data-consulta-id]");
        if(await verifyIsList(allHours)){
            break;
        }
        await sleep(10);
    }

    for(let element of allHours){
        //consulta-status0 - agendado
        //consulta-status6 - Cancelado pelo paciente
        //consulta-status5 - Cancelado pelo profissional
        //consulta-status1 - Confirmado
        //consulta-status4 - aguardando
        //compromisso

        var status = ["consulta-status1", "consulta-status4", "consulta-status5", "consulta-status6", "compromisso"];
        
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

        while(true){
            var cardName = document.querySelector(".mat-mdc-card-header-text .mat-mdc-tooltip-trigger");
            if(await verifyIsItem(cardName)){
                break;
            }
            await sleep(10);
        }

        cardName = cardName.innerText;

        while(true){
            var cardPhone = document.querySelector(".mat-mdc-card-header-text .mat-mdc-card-subtitle");
            if(await verifyIsItem(cardPhone)){
                break;
            }
            await sleep(10);
        }

        cardPhone = cardPhone.innerText;

        while(true){
            var cardDr = document.querySelectorAll(".mat-mdc-card-content .mat-mdc-tooltip-trigger")[0];
            if(await verifyIsItem(cardDr)){
                break;
            }
            await sleep(10);
        }

        cardDr = cardDr.innerText;

        while(true){
            var cardHour = document.querySelectorAll(".mat-mdc-card-content .mat-mdc-tooltip-trigger")[3].querySelector("span");
            if(await verifyIsItem(cardHour)){
                break;
            }
            await sleep(10);
        }

        cardHour = cardHour.innerText;

        var cardDate = formattedDate;

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

        var background = document.querySelector(".preview-backdrop");
        background.click();

        if(!await sendWhatsapp(cardName, cardPhone, cardDr, cardHour, cardDate)){
            cardPhone = cardPhone.replace("+55", "");
            patientsIncorrects.push({
                name: cardName,
                phone: cardPhone.replace(/\D/g, "")
            });
        }

        await sleep(4000);
    }

    if(patientsIncorrects.length){
        await sendReport();
    }

    chrome.storage.local.set({init: false});
    chrome.runtime.sendMessage({action: "log", message: "Confirmação finalizada com sucesso!"});
    screenText.innerText = "FINALIZADO.";
}

async function sendWhatsapp(cardName, cardPhone, cardDr, cardHour, cardDate){
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({action: "forWhatsapp", name: cardName, phone: cardPhone, dr: cardDr, hour: cardHour, date: cardDate}, (response) => {
            console.log(response);
            if(response.success){
                resolve(true);
            }else{
                resolve(false);
            }
        });
    });
}

async function sendReport(){
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({action: "report", patients: patientsIncorrects}, (response) => {
            resolve();
        });
    });
}