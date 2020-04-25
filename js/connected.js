window.onload=function(){
    if (document.getElementById("logoutButton"))
       document.getElementById("logoutButton").addEventListener("click", logout);
    if (document.getElementById("generate"))
       document.getElementById("generate").addEventListener("click", generatePassword);
}

const logout = function() {
    chrome.storage.local.set({'login': false})
    my_window = window.open("../login.html","_self");
}

const generatePassword = function () {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*().[]{}~-+=_:;,<>?"
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    document.getElementById("pass_text").textContent = password;
    console.log(password," length of ", password.length)
}