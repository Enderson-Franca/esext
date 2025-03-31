chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch(message.action){
        case "send":
            await send();

            await sleep(2000);

            sendResponse({success: true});
            return true;
        break;
    }
});

async function send(){
    return new Promise(resolve => {
        var sending = setInterval(() => {
            var send = document.querySelector("[data-icon='send']");
            if(send){
                setTimeout(() => {
                    send.click();
                    clearInterval(sending);
                    resolve();
                }, 500); 
            }
        }, 1000);
    });
}