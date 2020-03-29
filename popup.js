

chrome.runtime.onMessage.addListener(
    (req, sender, res) => res(req)
)