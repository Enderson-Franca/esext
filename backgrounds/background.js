var status = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "execute":
           chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const tab = tabs[0];  // A aba ativa
                console.log('Página ativa:', tab);

                // Injetar o script na aba ativa
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['contents/simplesdental.js']  // Caminho para o script a ser injetado
                }).then(() => {
                    console.log('Script injetado com sucesso na página ativa!');
                }).catch((err) => {
                    console.error('Erro ao injetar o script:', err);
                });
            });
            
        break;
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
            /*var messageBase = 'Olá {name}, é aqui da clínica Espaço Sorriso. O motivo do meu contato é para confirmar a sua consulta com o(a) {dr} amanhã dia {data} às {hour}.';*/
            var messageBase = `Bom dia {name}, é daqui da Clinica Espaço Sorriso! O motivo do contato e para confirmar sua consulta com o(a) {dr} amanhã dia {data} às {hour}?
⚠ Observações
* A tolerância de atrasos é de 10 minutos.
* Caso não compareça e não desmarque com 2 horas de antecedência sera gerada uma multa no valor de 20,00. (pois há reserva de horarios)
* *Aguardamos o seu retorno até 11:00, caso não seja confirmado destinaremos o horário para outro paciente.


SUA CONFIRMAÇÃO É DE EXTREMA IMPORTÂNCIA`;
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