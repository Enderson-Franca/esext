function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var settings;

chrome.storage.local.get("settings", (item) => {
    settings = item["settings"];
});

var informations;

chrome.storage.local.get("informations", (item) => {
    informations = item["informations"];
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "execute":
        chrome.tabs.create({url: settings["configs"]["url_simples-dental"]}, async (tabCreate) => {
            await chrome.storage.local.set({simplesId: tabCreate.id});
        
            chrome.tabs.onUpdated.addListener(async function listener(tabId, tabInfo, tab){
                if(tabId == tabCreate.id && tabInfo.status == "complete"){
                    await chrome.scripting.executeScript({
                        target: {tabId: tabCreate.id},
                        files: ["contents/simplesdental.js"]
                    });
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tabCreate.id, {action: "confirmation"});
                }
            });

        });
        break;
        case "forWhatsapp":
                (async () => {
                    //Dados vindos do formulário
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

                    var linkBase = `https://web.whatsapp.com/send?phone=${phone}&text=${messageBase}`;
                    
                    chrome.tabs.create({url: linkBase}, (tabCreate) => {
                        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo){
                            if(tabId == tabCreate.id && changeInfo.status == "complete"){
                                chrome.scripting.executeScript({
                                    target: {tabId: tabCreate.id},
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
                                chrome.storage.local.set({whatsappTabId: tabCreate.id});
                            }
                        });
                    });
                })();
                return true;
            break;
            case "report":
                (async () => {
                    var patients = message.patients;
                    var messageBase = settings["messages"]["report"];
                    var stringBase = "";
                    var id;

                    console.log(messageBase);
                    console.log(patients);

                    for(let patient of patients){
                        console.log(patient);
                        stringBase += `\n\n- ${patient.name}\n> ${patient.phone}`;
                    }

                    messageBase = messageBase.replace("{patients}", stringBase);
                    messageBase = encodeURIComponent(messageBase);

                    var linkBase = `https://web.whatsapp.com/send?phone=${settings["configs"]['phone_clinical']}&text=${messageBase}`;

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
                return true;
            break;
            case "log":
                console.log(message.message);
            break;
    }
});