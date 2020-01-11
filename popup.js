chrome.tabs.onUpdated.addListener(() => {
    chrome.tabs.executeScript(
        null, {
            code: `console.log("xx");`
        }
    );
});