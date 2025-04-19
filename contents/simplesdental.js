const now = new Date();

var day;
var month;
const year = now.getFullYear();
var dateString;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    var profissional = document.querySelector(".ng-tns-c3082329526-6");
    var profissionalText = profissional.innerText.trim();

    var cadeira = document.querySelector(".ng-tns-c3082329526-8");
    var cadeiraText = cadeira.innerText.trim();

    var type = document.querySelector(".ng-tns-c3082329526-3");
    var typeText = document.querySelector(".ng-tns-c3082329526-3").innerText.trim();

    function verifyReady(item){
        if(item.length > 0){
            console.log(item);
            return true;
        }else{
            return false;
        }
    }

    await sleep(2000);

    if(profissionalText !== "Todos os profissionais"){
        profissional.click();

        while(true){
            var optionClick = document.querySelectorAll(".mat-option-text");
            if(await verifyReady(optionClick)){
                await sleep(500);
                optionClick[0].click();
                console.log("finalizou");
                break;
            }
            await sleep(200);
        }
        await sleep(1000);
    }


    if(cadeiraText !== "Todas as cadeiras"){
        cadeira.click();
        while(true){
            var optionClick = document.querySelectorAll(".mat-option-text");
            if(await verifyReady(optionClick)){
                await sleep(500);
                optionClick[0].click();
                console.log("finalizou");
                break;
            }

            await sleep(200);
        }
        await sleep(1000);
    }


    if(typeText !== "Dia"){
        type.click();
        while(true){
            var optionClick = document.querySelectorAll(".mat-option-text");
            if(await verifyReady(optionClick)){
                await sleep(500);
                optionClick[1].click();
                console.log("finalizou");
                break;
            }

            await sleep(200);
        }
        await sleep(1000);
    }


    /*Navegar entre os dias até a data escolhida*/
    /*
    var nextDayBtn = document.querySelector("[data-testid='btnProximoPeriodo']");
    
    while(true){
        var daySimples = document.querySelector(".header-agenda-group span:nth-child(1)").innerText.trim();
        if(daySimples == 25){
            console.log("Dia correto");
            break;
        }else{
            nextDayBtn.click();
            console.log(daySimples);
        }
        await sleep(200);
    }
    */

    /*formatar data antes de enviar*/

    day = document.querySelector(".header-agenda-group span:nth-child(1)").innerText.trim();
    day = String(day).padStart(2, "0");
    month = document.querySelector(".header-agenda-group span:nth-child(2)").innerText.trim();
    month = month.replace("/", "");
    month = String(month).padStart(2, "0");

    dateString = `${day}/${month}/${year}`;

    confirmation();
})();

async function confirmation(){
    await sleep(4000);
    var allHours = document.querySelectorAll("[data-consulta-id]");
    console.log(allHours);
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

        var cardName = document.querySelector(".mat-mdc-card-header-text .mat-mdc-tooltip-trigger").innerText;
        var cardPhone = document.querySelector(".mat-mdc-card-header-text .mat-mdc-card-subtitle").innerText;
        var cardDr = document.querySelectorAll(".mat-mdc-card-content .mat-mdc-tooltip-trigger")[0].innerText;
        var cardHour = document.querySelectorAll(".mat-mdc-card-content .mat-mdc-tooltip-trigger")[3].querySelector("span").innerText;
        var cardDate = stringDate;

        await sleep(500);

        document.querySelectorAll(".preview-row")[2].querySelector(".mat-select-trigger").click();

        await sleep(500);
        
        document.querySelectorAll(".mat-select-panel .mat-option-text")[7].click();

        await sleep(500);
        background.click();
        if(!await sendWhatsapp(cardName, cardPhone, cardDr, cardHour, cardDate)){
            
        }
    }

    console.log("FINALIZOU AS MENSAGENS");
}

async function sendWhatsapp(cardName, cardPhone, cardDr, cardHour){
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({action: "forWhatsapp", name: cardName, phone: cardPhone, dr: cardDr, hour: cardHour}, (response) => {
            if(response.success){
                resolve(true);
            }else{
                resolve(false);
            }
        });
    });
}