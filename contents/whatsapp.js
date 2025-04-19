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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "send":
            (async () => {
                while(true){
                    var send = document.querySelector("[data-icon='send']");
                    var iconTime = document.querySelector("[data-icon='msg-time']");
                    var invalid = document.querySelector("[aria-label='O número de telefone compartilhado por url é inválido.']");

                    if(await verifyInvalid(invalid)){
                        sendResponse({success: true});
                    }

                    /*if(await verifySend()){

                    }*/
                   await sleep(200);
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