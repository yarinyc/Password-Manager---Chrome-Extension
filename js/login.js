const api = createApiClient();

window.onload = function(){
    if (document.getElementById("loginButton")){
       document.getElementById("loginButton").addEventListener("click", login);
    }
    if (document.getElementById("deleteButton"))
        document.getElementById("deleteButton").addEventListener("click", deleteAccount);
}

// splits an encrypted string into encrypted data and mac key
const splitMac = function(text){
    const index = text.length - 64;
    return [text.substring(0, index), text.substring(index)];
}
// derives all 3 keys from the master password
// k1 -> server password | k2 -> encryption key | k3 -> mac key
const deriveKeys = function(masterPassword){
    let serverKey = CryptoJS.SHA256(masterPassword+1).toString();
    let EKey = CryptoJS.SHA256(masterPassword+2).toString();
    let MKey = CryptoJS.SHA256(masterPassword+3).toString();
    return [serverKey,EKey,MKey];
}
// decrypts 1 password entry with EKey and authenticates with MKey - Not in use
const decryptEntry = function(passwordEntry, E, M){
    const [data, mac] = splitMac(passwordEntry.userName);
    const [data2, mac2] = splitMac(passwordEntry.userPassword);
    let userName = "";
    let userPassword = "";
    // Always calculates the HMAC on the encrypted object before decryption
    // This prevents any manipulation of the encrypted data to cause harm after decryption.
    if(CryptoJS.HmacSHA256(data, M).toString() == mac && CryptoJS.HmacSHA256(data2, M).toString() == mac2){
        const bytes  = CryptoJS.AES.decrypt(data, E);
        userName = bytes.toString(CryptoJS.enc.Utf8);
        const bytes2  = CryptoJS.AES.decrypt(data2, E);
        userPassword = bytes2.toString(CryptoJS.enc.Utf8);
    } else {
        alert("It seems that someone altered or manipulated your password for " + passwordEntry.domain);
    }
    return {domain: passwordEntry.domain , userName: userName , userPassword: userPassword};
}
//decrypts all user passwords
const decryptFile = function(passwordsFile, E, M){
    const [data, mac] = splitMac(passwordsFile);
    let passwords = "";
    // Always calculates the HMAC on the encrypted object before decryption
    // This prevents any manipulation of the encrypted data to cause harm after decryption.
    if(CryptoJS.HmacSHA256(data, M).toString() == mac){
        const bytes  = CryptoJS.AES.decrypt(data, E);
        passwords = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } else {
        alert("It seems that someone altered or manipulated your passwords");
    }
    return passwords;
}

const login = function () {
    const err = document.getElementById("err");
    const userName = document.getElementById("email").value
    const masterPassword = document.getElementById("pwd").value
    const [password,EKey,MKey] = deriveKeys(masterPassword);
    const userInfo = {name: userName, password: password, EKey: EKey, MKey: MKey};
    api.login({name: userName, password: password})
    .then((res)=>{
        if(res.msg == 'Success'){
            let passwords = res.passwords != "" ? decryptFile(res.passwords, EKey, MKey) : [];
            chrome.storage.local.set({'login': true, 'passwords': passwords, 'userInfo': userInfo});
            window.open("../connected.html","_self");
            return;
        }
        err.innerHTML="Wrong username or password";
        return;
    })
    .catch((error)=>{console.log(error)});
}

const deleteAccount = function () {
    const err=document.getElementById("err");
    const email = document.getElementById("email").value
    const masterPassword = document.getElementById("pwd").value
    const [password,EKey,MKey] = deriveKeys(masterPassword);
    const userInfo = {name: email, password: password};
    api.deleteUser(userInfo).then((res)=>{
        if(res.msg == 'Deleted'){
            err.innerHTML="Account deleted successfully";
            document.getElementById("email").value = "";
            document.getElementById("pwd").value = "";
            return;
        }
        err.innerHTML="Couldn't delete account";
        return;
    })
    .catch((error)=>{console.log(error)});
}

