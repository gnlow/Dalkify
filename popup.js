let packList = [];

const { text, el, list, mount } = redom;

class Li {
    constructor() {
        this.el = el("li", [
            el("span", text("■ ")),
            text(""),
        ]);
    }
    update(data) {
        const [bullet, name] = this.el.childNodes;
        name.textContent = data.name;
        bullet.style.color = "#" + (data.color || 0xF56EC1).toString(16);
    }
}
const ul = list("ul", Li);

mount(document.querySelector("div"), ul);


window.addEventListener("load", () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, "get", res => {
            packList = res;
            if(packList.length){
                document.querySelector("header").classList.add("reeled");
            }
            ul.update(packList);
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
                ul.update(packList);
                break;
        }
        res(req);
    }
);