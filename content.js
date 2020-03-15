const load = path => new Promise((o, x) => {
    injectScript(chrome.extension.getURL(path), "body")
    .addEventListener("load", o);
});

log("⌛ waiting for window")
window.addEventListener("load",
    async () => {
        log("⌛ window loaded");
        await load("node_modules/dalkak/dist/dalkak.umd.js");
        log("⌛ dalkak loaded");
        await load("node_modules/@dalkak/basic/dist/index.umd.js");
        log("⌛ type data loaded");
        await load("dalkify.js");
        log("⌛ dalkify loaded");
        await load("inject.js");
    }

);

function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
    return script
}

function log(text) {
    console.log(`%c Dalkify %c ${text} `, "background: #F56EC1; color: #FFF", "background: #FFCCDB; color: #000");
}