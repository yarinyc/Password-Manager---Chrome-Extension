window.onload=function(){
    chrome.storage.local.get(['login'], function(result){
        if (result.key=='true'){
            alert(result.key)
            window.open("../connected.html","_self");
        }  
        else{
            alert(result.key)
            window.open("../login.html","_self");
        } 
    })
}