const api = createApiClient();
window.onload=function(){
    if (document.getElementById("loginButton")){
       document.getElementById("loginButton").addEventListener("click", login);
    }
    if (document.getElementById("deleteButton"))
        document.getElementById("deleteButton").addEventListener("click", deleteAccount);
}
login = function () {
    const err=document.getElementById("err");
    const email = document.getElementById("email").value
    const password = document.getElementById("pwd").value
    const myObj = {name: email, password: password};
    api.login(myObj).then((res)=>{
        console.log()
        if(res.msg == 'Success'){
            let passwords = res.passwords;
            chrome.storage.local.set({'passwords': passwords}, function() {
                console.log("passwords saved:\n",passwords)
            });
            chrome.storage.local.set({'login': true})
            window.open("../connected.html","_self");
            return;
        }
        err.innerHTML="Wrong username or password";
        return;
    })
    .catch((error)=>{console.log(error)});
}
deleteAccount = function () {
    const err=document.getElementById("err");
    const email = document.getElementById("email").value
    const password = document.getElementById("pwd").value
    const myObj = {name: email, password: password};
    api.deleteUser(myObj).then((res)=>{
        if(res.msg == 'Deleted'){
            err.innerHTML="Account deleted successfully";
            return;
        }
        err.innerHTML="Couldn't delete account";
        return;
    })
    .catch((error)=>{console.log(error)});
}

