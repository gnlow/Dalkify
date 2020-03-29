var load = url => new Promise((o, x) => {
    var sc = document.createElement("script");
    sc.src = url;
    sc.addEventListener("load", o);
    document.body.appendChild(sc);
});

const getPackageName = name => /(@[^@/]+\/[^@/]+)(?:@.*)?/.exec(name)[1];

if ("Entry" in window && Entry.variableContainer) {
    (async () => {
        try {
            dalkLog("🏁 inject start");
            var packList = Entry.variableContainer.getListByName("dalk_pack").getArray().map(o => o.data);
            window.postMessage({type: "pack", data: packList, dalkify: true}, "*");
            let i = 0;
            for (var packName of packList) {
                i++;
                dalkLog("⌛ loading: " + packName);
                await load("https://unpkg.com/" + packName);
                dalkify.inject(window[getPackageName(packName)], Entry, getPackageName(packName));
                dalkLog(`✔️(${i}/${packList.length}) injected: ${packName}`);
            }
            dalkLog("✔️ inject end");
            dalkLog(`✔️ ${packList.length} package${packList.length > 1?"s":""} injected`);
            window.postMessage({type: "load", dalkify: true}, "*");
        } catch (e) {
            dalkErr(e);
            dalkErr("inject failed");
            throw e;
        }
    })();
} else {
    dalkErr("project not found");
    dalkErr("inject failed");
}


function dalkLog(text) {
    (new Entry.Toast).success("Dalkify", text);
    console.log(`%c Dalkify %c ${text} `, "background: #F56EC1; color: #FFF", "background: #FFCCDB; color: #000");
    window.postMessage({type: "log", data: text, dalkify: true}, "*");
}

function dalkErr(text) {
    (new Entry.Toast).alert("Dalkify", text);
    console.log(`%c Dalkify %c ${text} `, "background: #F56EC1; color: #FFF", "background: #FFF; color: red");
    window.postMessage({type: "log", data: text, dalkify: true}, "*");
}