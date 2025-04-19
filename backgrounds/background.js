var status = false;
var configs;
var messages;

chrome.storage.local.get("init", (result) => {
    console.log(result["init"]);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message["configs"] !== undefined){
        if(message["configs"]["configs"] !== undefined && message["configs"]["messages"] !== undefined){
            configs = message["configs"]["configs"];
            messages = message["configs"]["messages"];
        }
    }

    switch(message.action){
        case "execute":
            var idTabSimples;

            chrome.tabs.create({url: configs["url_simples-dental"]}, (tab) => {
                idTabSimples = tab.id;
            });

            chrome.tabs.onUpdated.addListener(function listener(tabId, tabInfo, tab){
                if(tab.id == idTabSimples && tabInfo.status == "complete"){
                    chrome.scripting.executeScript({
                        target: {tabId: idTabSimples},
                        files: ["contents/simplesdental.js"]
                    });
                    chrome.tabs.onUpdated.removeListener(listener);
                }

            });
        break;
        case "forWhatsapp":
            console.log("FOR WHATSAAO");
            var id;
            chrome.tabs.create({url: "https://web.whatsapp.com/send?phone=55610000000&text=Vejamos......"}, (tab) => {
                id = tab;
            });

            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo){
                if(tabId == id.id && changeInfo.status == "complete"){
                    chrome.scripting.executeScript({
                        target: {tabId: id.id},
                        files: ["contents/whatsapp.js"]
                    }).then(() => {
                        chrome.tabs.sendMessage(tabId, {action: "send"}, (response) => {
                            sendResponse(response);
                            chrome.storage.local.get("whatsappTabId", (result) => {
                                chrome.tabs.remove(result["whatsappTabId"]);
                            });
                        });
                    });

                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.storage.local.set({whatsappTabId: id.id});
                }
            });
        break;
        case "log":
            console.log(message.message);
        break;
    }

    return true;
});

/*chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "log":
            console.log(message.message);
        break;
        case "forWhatsapp":
            var id;
            var linkBase = "https://web.whatsapp.com/send?phone=55{phone}&text={message}";
            var name = message.name;
            var phone = message.phone.replace(/\D/g, "");
            var data = new Date();
            data.setDate(data.getDate() + 1);
            data = data.toLocaleDateString("pt-BR");
            var hour = message.hour;
            var hour = hour.replace(" ", "");
            hour = hour.split("-");
            hour = hour[0];
            var dr = message.dr;
            messageBase =  messageBase.replaceAll("{name}", name)
            .replaceAll("{dr}", dr)
            .replaceAll("{data}", data)
            .replaceAll("{hour}", hour);
            
            linkBase = linkBase.replaceAll("{phone}", phone).replaceAll("{message}", encodeURIComponent(messageBase));

            chrome.tabs.create({url: linkBase}, (tab) => {
                console.log(tab);
                id = tab;
            });

            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo){
                if(tabId == id.id && changeInfo.status == "complete"){
                    chrome.scripting.executeScript({
                        target: {tabId: id.id},
                        files: ["contents/whatsapp.js"]
                    }).then(() => {
                        chrome.tabs.sendMessage(tabId, {action: "send"}, (response) => {
                            sendResponse(response);
                            chrome.storage.local.get("whatsappTabId", (result) => {
                                chrome.tabs.remove(result["whatsappTabId"]);
                            });
                        });
                    });

                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.storage.local.set({whatsappTabId: id.id});
                }
            });

            return true;
        break;
        case "forSimplesDental":

        break;
        case "closeTab":
            chrome.tabs.remove(message.tabId);
        break;
    }
    return true; // Necessário para manter sendResponse assíncrono
});

*/