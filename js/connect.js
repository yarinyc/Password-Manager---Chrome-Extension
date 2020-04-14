const api = createApiClient();
window.onload=function(){
    if (document.getElementById("loginButton"))
       document.getElementById("loginButton").addEventListener("click", login);
    if (document.getElementById("deleteButton"))
        document.getElementById("deleteButton").addEventListener("click", deleteAccount);
}
login = function () {
    const email = document.getElementById("email").value
    const password = document.getElementById("pwd").value
    const myObj = {name: email, password: password};
    api.login(myObj).then((res)=>{
        if(res.msg == 'Success'){
            //err.innerHTML="Logged in";
            let passwords = res.passwords;
            //window.close();
            //call function
            return;
        }
        err.innerHTML="Couldn't connect";
        return;
    })
    .catch((error)=>{console.log(error)});
}
deleteAccount = function () {
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

