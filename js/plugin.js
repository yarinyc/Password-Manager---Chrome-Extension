//conditional rendering: if user is looged in go to connected.html otherwise to login.html
window.onload=function(){
    chrome.storage.local.get(['login'], function(result){
        if (result.login==true){
            window.open("../connected.html","_self");
        }  
        else{
            window.open("../login.html","_self");
        } 
    })
}