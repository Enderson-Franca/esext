var status = false;
var configs;
var messages;

chrome.storage.local.get("init", (result) => {
    console.log(result["init"]);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message["settings"] !== undefined){
        if(message["settings"]["configs"] !== undefined && message["settings"]["messages"] !== undefined){
            configs = message["settings"]["configs"];
            messages = message["settings"]["messages"];
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
            (async () => {
                var id;
                //Dados vindos do formulário
                var informations = await chrome.storage.local.get("informations");
                informations = informations["informations"];
                var type = informations["type"];
                var doctor = informations["doctor"];
                var date = informations["date"];
                var messageBase = informations["message"];

                //dados vindos da simples dental
                var name = message.name;
                var dr = message.dr;
                dr = dr.split(" ");
                dr = dr[1];
                var hour = message.hour;
                hour = hour.replace(" ", "");
                hour = hour.split("-");
                hour = hour[0];
                var dateConsulta = message.date;
                var phone = message.phone.replace(/\D/g, "");

                var greeting;
                var currentTime = new Date();
                currentTime = {
                    hour: currentTime.getHours(),
                    minutes: currentTime.getMinutes()
                };

                if(currentTime.hour >= 6 && currentTime.hour <= 11){
                    greeting = "Bom dia";
                }else if(currentTime.hour >= 12 && currentTime.hour <= 17){
                    greeting = "Boa tarde";
                }else if(currentTime.hour >= 18 && currentTime.hour <= 23){
                    greeting = "Boa noite";
                }

                var msgTomorrow;
                var today = new Date();
                var tomorrow = dateConsulta.split("/");
                tomorrow = new Date(tomorrow[2], Number(tomorrow[1]) - 1, tomorrow[0]);

                today.setHours(0, 0, 0, 0);
                tomorrow.setHours(0, 0, 0, 0);

                var diff = tomorrow - today;

                if(diff == 86400000){
                    msgTomorrow = "*AMANHÃ*,";
                }else if(tomorrow.getTime() == today.getTime()){
                    msgTomorrow = "*HOJE*,";
                }else{
                    msgTomorrow = "no";
                }

                switch(type){
                    case "clinical":
                        var messageBase = messageBase
                        .replaceAll("{greeting}", greeting)
                        .replaceAll("{name}", name)
                        .replaceAll("{dr}", dr)
                        .replaceAll("{amanha}", msgTomorrow)
                        .replaceAll("{hour}", hour)
                        .replaceAll("{data}", dateConsulta);
                    break;
                    case "orthodontics":
                        var messageBase = messageBase
                        .replaceAll("{greeting}", greeting)
                        .replaceAll("{name}", name)
                        .replaceAll("{dr}", dr)
                        .replaceAll("{amanha}", msgTomorrow)
                        .replaceAll("{hour}", hour)
                        .replaceAll("{data}", dateConsulta);
                    break;
                    case "today":
                        var messageBase = messageBase
                        .replaceAll("{name}", name)
                        .replaceAll("{hour}", hour);
                    break;
                }

                messageBase = encodeURIComponent(messageBase);
                console.log(messageBase);

                var linkBase = `https://web.whatsapp.com/send?phone=${phone}&text=${messageBase}`;

                chrome.tabs.create({url: linkBase}, (tab) => {
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
            })();
        break;
        case "report":
            var linkBase = `https://web.whatsapp.com/send?phone=${config['phone_clinical']}&text=${messageBase}`;

                chrome.tabs.create({url: linkBase}, (tab) => {
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
            var phone = 
            var data = new Date();
            data.setDate(data.getDate() + 1);
            data = data.toLocaleDateString("pt-BR");
            c
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