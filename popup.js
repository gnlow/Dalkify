let packList = [];

window.addEventListener("load", () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, "get", res => {
            packList = res;
        });
    })
});
chrome.runtime.onMessage.addListener(
    (req, sender, res) => {
        console.log(req);
        switch(req.type){
            case "new":
                packList = [];
                break;
            case "log":
                document.querySelector("load-info").innerText = req.data;
                break;
            case "pack":
                packList.push(req.data);
                break;
            case "load":
                document.querySelector("header").classList.add("reel");
                break;
        }
        res(req);
    }
);