chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        var url = new URL(changeInfo.url);
        if (url.pathname.length >= 4 || url.pathname == "/ws") {
            chrome.tabs.executeScript(
                null, {
                    file: "dalkify.js"
                },
                () => {
                    chrome.tabs.executeScript(
                        null, {
                            code: `console.log('${JSON.stringify(changeInfo)}');`
                        }
                    )
                }
            );
        }
    }
});