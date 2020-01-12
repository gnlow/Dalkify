injectScript(chrome.extension.getURL("node_modules/dalkak/dist/dalkak.umd.js"), "body").addEventListener("load",
    () => {
        injectScript(chrome.extension.getURL("dalkify.js"), "body").addEventListener("load",
            () => {
                injectScript("https://unpkg.com/@dalkak/sample", "body").addEventListener("load",
                    () => {
                        injectScript(chrome.extension.getURL("content.js"), "body")
                    }
                )
            }
        )
    }
)

/*
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete") {
        if (tab.url) {
            var url = new URL(tab.url);
            if (url.pathname.length > 4 || url.pathname == "/ws") {
                (async () => {
                    ///*
                    await execScript({file: "node_modules/dalkak/dalkak.umd.js"});
                    await execScript({file: "dalkify.js"});
                    await execScript({code: await getCode("@dalkak/sample")});
                    await execScript({code: `dalkify.inject(sample)`});
                    //
                    ///*
                   var inj = await getCode("@dalkak/sample");
                    chrome.tabs.executeScript(null, {
                        file: "node_modules/dalkak/dist/dalkak.umd.js"
                    }, chrome.tabs.executeScript(null, {
                        file: "dalkify.js"
                    }, chrome.tabs.executeScript(null, {
                        code: inj
                    }, chrome.tabs.executeScript(null, {
                        code: `dalkify.inject(sample);console.log("xx")`
                    }, ()=>console.log(chrome.runtime.lastError)
                    ))));
                    //
                   injectScript(chrome.extension.getURL("node_modules/dalkak/dist/dalkak.umd.js"), "body");
                   injectScript(chrome.extension.getURL("dalkify.js"), "body");
                   injectScript("https://unpkg.com/@dalkak/sample", "body");
                   injectScript(chrome.extension.getURL("content.js"), "body");
                })();
            }
        }
    }
});
*/
var getCode = packName => new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        resolve(this.responseText)
    });
    req.open("GET", "https://unpkg.com/" + packName);
    req.send();
});

var execScript = option => new Promise(function (o, x) {
    chrome.tabs.executeScript(
        null, option, o
    )
})

function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
    return script
}

function injectCode(code, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.innerText = code;
    script.defer = true;
    node.appendChild(script);
}