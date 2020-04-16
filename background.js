//document.getElementsByTagName('form')

// chrome.webNavigation.onCompleted.addListener(function() {
//     alert("test webNavigation");
// });

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     console.log(tab.url);
//  });

// chrome.tabs.onActivated.addListener(function(activeInfo) {
//     // how to fetch tab url using activeInfo.tabid
//     chrome.tabs.get(activeInfo.tabId, function(tab){
//        console.log(tab.url);
//     });
//   }); 

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     const forms = window.document.getElementsByTagName("form")
//     console.log(forms)
//  });