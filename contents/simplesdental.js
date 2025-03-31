var day = document.querySelector(".weekday");
var dayString = day.innerText.trim();
if(dayString == "Sáb."){
    nextDay();
}else{
    var nextDayBtn = document.querySelector("[data-testid='btnProximoPeriodo']");
    nextDayBtn.click();
    confirmation();
}

function nextDay(){
    var nextDayBtn = document.querySelector("[data-testid='btnProximoPeriodo']");
    nextDayBtn.click();
    setTimeout(() => {
        nextDayBtn = document.querySelector("[data-testid='btnProximoPeriodo']");
        nextDayBtn.click();
        confirmation();
    }, 2000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function confirmation(){
    await sleep(2000);
    var allHours = document.querySelectorAll(".fc-event-draggable");
    console.log(allHours);
    for(let element of allHours){
        await sleep(300);
        
        element.click();
        var background = document.querySelector(".preview-backdrop");

        await sleep(300);

        var cardName = document.querySelector(".mat-mdc-card-header-text .mat-mdc-tooltip-trigger").innerText;
        var cardPhone = document.querySelector(".mat-mdc-card-header-text .mat-mdc-card-subtitle").innerText;
        var cardDr = document.querySelectorAll(".mat-mdc-card-content .mat-mdc-tooltip-trigger")[0].innerText;
        var cardHour = document.querySelectorAll(".mat-mdc-card-content .mat-mdc-tooltip-trigger")[3].querySelector("span").innerText;
        console.log(cardName, cardPhone, cardDr, cardHour);

        await sleep(300);

        document.querySelectorAll(".preview-row")[2].querySelector(".mat-select-trigger").click();

        await sleep(300);
        
        document.querySelectorAll(".mat-select-panel .mat-option-text")[7].click();

        await sleep(300);
        background.click();
        await sendWhatsapp(cardName, cardPhone, cardDr, cardHour);
    }
}

async function sendWhatsapp(cardName, cardPhone, cardDr, cardHour){
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({action: "forWhatsapp", name: cardName, phone: cardPhone, dr: cardDr, hour: cardHour}, (response) => {
            if(response.success){
                resolve();
            }
        });
    });
}