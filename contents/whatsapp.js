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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        switch(message.action){
            case "send":
            var sending = false;
            while(true){
                var send = document.querySelector("[data-icon='send']");
                var invalid = document.querySelector("[aria-label='O número de telefone compartilhado por url é inválido.']");

                if(verifyIsItem(invalid)){
                    await chrome.runtime.sendMessage({action: "log", message: "Invalid"});
                    sendResponse({success: false});
                    break;
                }

                if(verifyIsItem(send)){
                    send.click();
                    sending = true;
                }

                await sleep(1000);

                if(sending){
                    var rows = document.querySelectorAll("[role=row]");
                    var lastRow = rows[rows.length - 1];
                    console.log(lastRow);
                    var iconTime = lastRow.querySelector('[data-icon="msg-time"]');

                    if(!await verifyIsItem(iconTime)){
                        await chrome.runtime.sendMessage({action: "log", message: "Enviada enviou true"});
                        sendResponse({success: true});
                        break;
                    }
                }

                await sleep(10);
            }
            await chrome.runtime.sendMessage({action: "log", message: "fim da função."});
            break;
        }
    })();
    return true;
});