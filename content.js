const load = path => new Promise((o, x) => {
    injectScript(path, "body")
    .addEventListener("load", o);
});

log("waiting for window")
window.addEventListener("load",
    async () => {
        log("window loaded");
        await load("node_modules/dalkak/dist/dalkak.umd.js");
        log("dalkak loaded");
        await load("dalkify.js");
        log("package loaded");
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