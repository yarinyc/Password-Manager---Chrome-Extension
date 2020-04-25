
const api = createApiClient();
// global variables:
let domainData = undefined; // => will hold current domain user data: {domain, username, userpassword}
let domainName = undefined; // => domain name: "facebook.com"/"linkedin.com" etc.

// on submit of login form of web page:
const onSubmit = function (userNameId, passwordId) {
  let userNameElement = document.getElementById(userNameId)
  let passwordElement = document.getElementById(passwordId)
  if (domainData == undefined){ // new password entry
    if (confirm("Do you want 'Password Manager' to save your user credentials?")==true){
      //add domain to local storage and update in server
      chrome.storage.local.get(['passwords', 'userInfo'], function(result) {
        let data = {name: result.userInfo.name , password: result.userInfo.password , domain: domainName, userName: userNameElement.value, userPassword: passwordElement.value};
        let passwords = result.passwords;
        passwords.push({domain: domainName, userName: userNameElement.value, userPassword: passwordElement.value});
        chrome.storage.local.set({'passwords': passwords}); // update data in local storage
        api.uploadUserData(domainName, data) // update data in server
        .then((res)=> console.log(res))
        .catch((err)=>console.log(err));
      });
    }
  }
  else if (domainData.userName != userNameElement.value || domainData.userPassword != passwordElement.value){ // edit existing password entry
    if (confirm("Do you want Password Manager to update your credentials?")==true){
      //edit domainData in local storage and update in server
      chrome.storage.local.get(['passwords', 'userInfo'], function(result) {
        let data = {name: result.userInfo.name , password: result.userInfo.password , domain: domainName, userName: userNameElement.value, userPassword: passwordElement.value};
        let passwords = result.passwords;
        passwords = passwords.map((e)=> e.domain == domainName ? {domain: domainName, userName: userNameElement.value, userPassword: passwordElement.value} : e);
        chrome.storage.local.set({'passwords': passwords}); // update data in local storage
        api.uploadUserData(domainName, data) // update data in server
        .then((res)=> console.log(res))
        .catch((err)=>console.log(err));
      });
    }
  }
}

// inserts user credentials into the input fields if the user data exists
const autoFill = function (userNameId, passwordId){ // domainData is a global variable
  if(domainData){
    let userNameElement = document.getElementById(userNameId);
    let passwordElement = document.getElementById(passwordId);
    if(userNameElement && passwordElement){
      userNameElement.value = domainData.userName;
      passwordElement.value = domainData.userPassword;
    }
  }
}

const encryptPaswword = function(password, E){ //E is the encryption key

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
             autoFill(userNameId, passwordId);
             //listen for submit  event
             let form = document.getElementById("login_form") //get form element for submit event
             if(form){
               form.addEventListener('submit', function(){
                   onSubmit(userNameId, passwordId);
               }); 
             }
        });
      }
      // *** linkedin ***
      if (window.location.href.indexOf("linkedin.com/login") > -1) {
        chrome.storage.local.get(['passwords'], function(result){
            domainName = "linkedin.com";
            domainData = result.passwords.find((e)=>e.domain === domainName);
            // insert credentials into the input fields
            autoFill("username", "password");
            //listen for submit  event
            let forms = document.getElementsByClassName("login__form") //get form element for submit event
            if(forms){
              forms[0].addEventListener('submit', function(){
                  onSubmit("username", "password");
              }); 
            }
        });
      }
      // *** cs ***
      if (window.location.href.indexOf("cs.bgu.ac.il") > -1) {
        /TODO need to complete/
        
      }
    }  
});



