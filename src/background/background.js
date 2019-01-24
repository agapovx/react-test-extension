chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "open_extension" });
  });
});

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  suggest({ filename: downloadItem.filename, conflictAction: "overwrite" });
});
