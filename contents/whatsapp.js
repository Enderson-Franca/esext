chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "send":
            var sending = setInterval(() => {
                var send = document.querySelector("[data-icon='send']");
                if(send){
                    clearInterval(sending);
                    setTimeout(() => {
                        send.click();

                        setTimeout(() => {
                            sendResponse({success: true});
                        }, 2000);
                    }, 500); 
                }
            }, 1000);
            return true;
        break;
    }
});