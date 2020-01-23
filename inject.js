var load = url => new Promise((o, x) => {
    $("script").load(url, null, (res, stat) => {
        if (stat == "error") {
            x("package loading error");
        } else {
            o();
        }
    });
});

if ("Entry" in window && Entry.variableContainer) {
    (async () => {
        try {
            dalkLog("inject start");
            var packList = Entry.variableContainer.getListByName("dalk_pack").getArray()
            for (var packName of packList) {
                dalkLog("loading: " + packName.data);
                await load("https://unpkg.com/" + packName.data);
                dalkify.inject(window[packName.data], Entry);
                dalkLog("injected: " + packName.data);
            }
            dalkLog("inject end");
            dalkLog(`${packList.length} package${packList.length > 1?"s":""} injected`);
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
    console.log(`%c Dalkify %c ${text} `, "background: #F56EC1; color: #FFF", "background: #FFCCDB; color: #000");
}

function dalkErr(text) {
    console.log(`%c Dalkify %c ${text} `, "background: #F56EC1; color: #FFF", "background: #FFF; color: red");
}