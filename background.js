

//set initial state for the extension
chrome.storage.local.set({'login': false})

//on startup reset state for fresh login requirement
chrome.runtime.onStartup.addListener(function(){
    chrome.storage.local.set({'login': false, 'passwords': []});
})
