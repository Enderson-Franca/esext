function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function verifyInvalid(item){
    if(item){
        return true;
    }else{
        return false;
    }
}

function verifySend(item){
    if(item){
        return true;
    }else{
        return false;
    }
}

function verifyIconTime(item){
    if(item){
        return true;
    }else{
        return false;
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "send":
            (async () => {
                var sending = false;
                while(true){
                    var send = document.querySelector("[data-icon='send']");
                    var invalid = document.querySelector("[aria-label='O número de telefone compartilhado por url é inválido.']");

                    if(await verifyInvalid(invalid)){
                        console.log("Numero inválido");
                        sendResponse({success: false});
                    }

                    if(await verifySend(send)){
                        send.click();
                        sending = true;
                    }

                    await sleep(1000);

                    if(sending){
                        var rows = document.querySelectorAll("[role=row]");
                        var lastRow = rows[rows.length - 1];
                        console.log(lastRow);
                        var iconTime = lastRow.querySelector('[data-icon="msg-time"]');

                        if(!await verifyIconTime(iconTime)){
                            sendResponse({success: true});
                            break;
                        }
                    }

                   await sleep(10);
                }
            })();
            return true;

            /*var sending = setInterval(() => {
                var send = document.querySelector("[data-icon='send']");
                var iconTime = document.querySelector("[data-icon='msg-time']");
                if(send){
                    clearInterval(sending);
                    setTimeout(() => {
                        send.click();

                        setTimeout(() => {
                            sendResponse({success: true});
                        }, 4000);
                    }, 500); 
                }
            }, 1000);
            return true;*/
        break;
    }
});