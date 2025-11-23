browser.browserAction.onClicked.addListener(() => {
    browser.windows.create({
        url: "pages/index.html",
        type: "popup",
        width: 400,
        height: 600
    });
});
