log("waiting for window")
window.addEventListener("load",
    () => {
        log("window loaded")
        injectScript(chrome.extension.getURL("node_modules/dalkak/dist/dalkak.umd.js"), "body").addEventListener("load",
            () => {
                log("dalkak loaded")
                injectScript(chrome.extension.getURL("dalkify.js"), "body").addEventListener("load",
                    () => {
                        log("package loaded")
                        injectScript(chrome.extension.getURL("inject.js"), "body").addEventListener("load", () => {

                        })
                    }
                )
            }
        )
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