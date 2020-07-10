
const api = createApiClient();
// global variables:
let domainData = undefined; // => will hold current domain user data: {domain, userName, userPassword}
let domainName = undefined; // => current domain name: "facebook.com"/"linkedin.com" etc.

// for every senitive data entry P sent to the server:
// C=Encrypt(P,E) => τ=MAC(C,M) => return Cǁτ
const encryptData = function(userInfo, userName, userPassword){
  const E = userInfo.EKey;
  const M = userInfo.MKey;
  //encrpyt + mac userName:
  let EuserName = CryptoJS.AES.encrypt(userName, E).toString();
  const HMAC = CryptoJS.HmacSHA256(EuserName, M).toString();
  EuserName = EuserName + HMAC;
  //encrpyt + mac password:
  let Epassword = CryptoJS.AES.encrypt(userPassword, E).toString();
  const HMAC2 = CryptoJS.HmacSHA256(Epassword, M).toString();
  Epassword = Epassword + HMAC2;

  return [EuserName, Epassword];
}

const encryptAllData = function(userInfo, passwordFile){
  const E = userInfo.EKey;
  const M = userInfo.MKey;
  //encrpyt + mac:
  let EpasswordFile = CryptoJS.AES.encrypt(JSON.stringify(passwordFile), E).toString();
  const HMAC = CryptoJS.HmacSHA256(EpasswordFile, M).toString();
  EpasswordFile = EpasswordFile + HMAC;

  return EpasswordFile;
}

// on submit of login form of web page:
const onSubmit = function (userNameId, passwordId, isId) { // isId = true => use idTag else nameTag
  let userNameElement = document.getElementById(userNameId);
  let passwordElement = document.getElementById(passwordId);
  if(!isId){
    userNameElement = document.getElementsByName(userNameId)[0];
    passwordElement = document.getElementsByName(passwordId)[0];
  }
  if (domainData == undefined){ // new password entry
    if (confirm("Do you want 'Password Manager' to save your user credentials?")==true){
      //add domain to local storage and update in server
      chrome.storage.local.get(['passwords', 'userInfo'], function(result) {
        let passwords = result.passwords;
        passwords.push({domain: domainName, userName: userNameElement.value, userPassword: passwordElement.value});
        chrome.storage.local.set({'passwords': passwords}); // update data in local storage
        // Encrypt password entry before the upload:
        //let [EuserName, Epassword] = encryptData(result.userInfo, userNameElement.value, passwordElement.value);
        let Epasswords = encryptAllData(result.userInfo, passwords);
        let data = {name: result.userInfo.name , password: result.userInfo.password , data: Epasswords};
        api.uploadAllUserData(data) // update data in server
        .then((res)=> console.log(res))
        .catch((err)=>console.log(err));
      });
    }
  }
  else if (domainData.userName != userNameElement.value || domainData.userPassword != passwordElement.value){ // edit existing password entry
    if (confirm("Do you want Password Manager to update your credentials?")==true){
      //edit domainData in local storage and update in server
      chrome.storage.local.get(['passwords', 'userInfo'], function(result) {
        let passwords = result.passwords;
        passwords = passwords.map((e)=> e.domain == domainName ? {domain: domainName, userName: userNameElement.value, userPassword: passwordElement.value} : e);
        chrome.storage.local.set({'passwords': passwords}); // update data in local storage
        let Epasswords = encryptAllData(result.userInfo, passwords);
        // Encrypt password entry before the upload:
        //let [EuserName, Epassword] = encryptData(result.userInfo, userNameElement.value, passwordElement.value);
        let data = {name: result.userInfo.name , password: result.userInfo.password , data: Epasswords};
        api.uploadAllUserData(data) // update data in server
        .then((res)=> console.log(res))
        .catch((err)=>console.log(err));
      });
    }
  }
}

// inserts user credentials into the input fields if the user data exists
// domainData is a global variable
const autoFill = function (userNameId, passwordId, isId){ // isId = true => use idTag else nameTag
  if(domainData){
    let userNameElement = document.getElementById(userNameId);
    let passwordElement = document.getElementById(passwordId);
    if(!isId){
      userNameElement = document.getElementsByName(userNameId)[0];
      passwordElement = document.getElementsByName(passwordId)[0];
    }
    if(userNameElement && passwordElement){
      userNameElement.value = domainData.userName;
      passwordElement.value = domainData.userPassword;
    }
  }
}

// --> content script work:

chrome.storage.local.get(['login'], function(result){
    if (result.login == true){
      // *** facebook ***
      // check if domain is facebook.com && a login_form exists:
      if ((window.location.href.indexOf("facebook.com") > -1) && document.getElementById("login_form")) { 
        chrome.storage.local.get(['passwords'], function(result){
            domainName = "facebook.com";
            domainData = result.passwords.find((e)=>e.domain === domainName);
            let userNameId;
            let passwordId;
            if(window.location.href.indexOf("m.facebook.com") > -1){ //support for both normal and mobile sites
              userNameId = "m_login_email" ;
              passwordId = "m_login_password" ;
            } else{
              userNameId = "email" ;
              passwordId = "pass" ;
            }
             // insert credentials into the input fields
             autoFill(userNameId, passwordId, true);
             //listen for submit  event
             let form = document.getElementById("login_form") //get form element for submit event
             if(form){
               form.addEventListener('submit', function(){
                   onSubmit(userNameId, passwordId, true);
               }); 
             }
        });
      }
      // *** linkedin ***
      if (window.location.href.indexOf("linkedin.com") > -1 && ( document.getElementsByClassName("login__form")[0] ||  document.getElementsByClassName("sign-in-form")[0])) {
        chrome.storage.local.get(['passwords'], function(result){
            domainName = "linkedin.com";
            domainData = result.passwords.find((e)=>e.domain === domainName);
            if(document.getElementsByClassName("login__form")[0]){
              // insert credentials into the input fields
              autoFill("username", "password", true);
              //listen for submit  event
              let form = document.getElementsByClassName("login__form")[0] //get form element for submit event
              if(form){
                form.addEventListener('submit', function(){
                    onSubmit("username", "password", true);
                }); 
              }
            } else {
              // insert credentials into the input fields
              autoFill("session_key", "session_password", false);
              //listen for submit  event
              let form = document.getElementsByClassName("sign-in-form")[0] //get form element for submit event
              if(form){
                form.addEventListener('submit', function(){
                    onSubmit("session_key", "session_password", false);
                });
              }
            }
        });
      }
      // *** cs ***
      if (window.location.href.indexOf("yad2.co.il/login") > -1) {
        chrome.storage.local.get(['passwords'], function(result){
          domainName = "yad2.co.il";
          domainData = result.passwords.find((e)=>e.domain === domainName);
          // insert credentials into the input fields
          autoFill("userName", "password", true);    
          //listen for submit  event  
          let forms = document.getElementById("loginForm")
          if(forms){
            forms.addEventListener('submit', function(){
                onSubmit("userName", "password", true);
            }); 
          }  
      });
    }
  }
});