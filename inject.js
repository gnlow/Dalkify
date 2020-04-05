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
            window.postMessage({type: "new", dalkify: true}, "*");
            dalkLog("🏁 inject start");
            var packList = Entry.variableContainer.getListByName("dalk_pack").getArray().map(o => o.data);
            document.querySelector(".entrylmsModalCommon").style.whiteSpace = "pre-line";
            if(await entrylms.confirm(
`작품에서 다음 확장기능을 불러오려고 합니다.
"${packList.join(`"\n"`)}"
불러오시겠습니까? `
            , "Dalkify") == false){
                throw "Rejected";
            }
            let i = 0;
            for (var packName of packList) {
                i++;
                dalkLog("⌛ loading: " + packName);
                await load("https://unpkg.com/" + packName);
                dalkify.inject(window[getPackageName(packName)], Entry, getPackageName(packName));
                const {
                    name,
                    color,
                } = window[getPackageName(packName)];
                window.postMessage({type: "pack", data: {name, color}, dalkify: true}, "*");
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