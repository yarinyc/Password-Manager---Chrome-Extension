window.onload=function(){
    if (document.getElementById("logoutButton"))
       document.getElementById("logoutButton").addEventListener("click", logout);
}

logout = function() {
    chrome.storage.local.set({'login': false})
    my_window = window.open("../login.html","_self");
}