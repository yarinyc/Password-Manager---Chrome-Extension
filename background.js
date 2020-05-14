

//set initial state for the extension
const url = chrome.runtime.getURL('./baseUrl.json');
let baseUrl_ = '';
fetch(url)
    .then((response) => response.json())
	.then((json) => {
        baseUrl_ = json.baseUrl
        chrome.storage.local.set({'login': false, 'baseUrl': baseUrl_})
    }); //makes sure we update the base url of the server (free version of ngrok gives random url each time)

//on startup reset state for fresh login requirement
chrome.runtime.onStartup.addListener(function(){
    chrome.storage.local.remove('userInfo');
    const url_ = chrome.runtime.getURL('./baseUrl.json');
    fetch(url_)
    .then((response) => response.json())
	.then((json) => {
        baseUrl_ = json.baseUrl
        chrome.storage.local.set({'login': false, 'passwords': [], 'baseUrl': baseUrl_})
    }); //makes sure we update the base url of the server (free version of ngrok gives random url each time)
})
