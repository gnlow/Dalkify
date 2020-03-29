let packList;

chrome.runtime.onMessage.addListener(
    (req, sender, res) => {
        console.log(req);
        switch(req.type){
            case "log":
                document.querySelector("load-info").innerText = req.data;
                break;
            case "pack":
                packList = req.data;
                break;
            case "load":
                document.querySelector("header").classList.add("reel");
                break;
        }
        res(req);
    }
)