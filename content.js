
const api = createApiClient();
let domainData = undefined;
let domainName = undefined;

const onSubmit = function () {
  let email = document.getElementById("username")
  let password = document.getElementById("password")
  if (domainData == undefined){ // new password entry
    if (confirm("Do you want 'Password Manager' to save your user credentials?")==true){
      //add domain to local storage and update in server
      chrome.storage.local.get(['passwords', 'userInfo'], function(result) {
        let data = {name: result.userInfo.name , password: result.userInfo.password , domain: domainName, userName: email.value, userPassword: password.value};
        let passwords = result.passwords;
        passwords.push({domain: domainName, userName: email.value, userPassword: password.value});
        chrome.storage.local.set({'passwords': passwords});
        api.uploadUserData(domainName, data)
        .then((res)=> console.log(res))
        .catch((err)=>console.log(res));
      });
    }
  }
  else if (domainData.userName != email.value || domainData.userPassword != password.value){ // edit existing password entry
    if (confirm("Do you want Password Manager to update your credentials?")==true){
      //edit domainData in local storage and update in server
      chrome.storage.local.get(['passwords', 'userInfo'], function(result) {
        let data = {name: result.userInfo.name , password: result.userInfo.password , domain: domainName, userName: email.value, userPassword: password.value};
        let passwords = result.passwords;
        passwords = passwords.map((e)=> e.domain == domainName ? {domain: domainName, userName: email.value, userPassword: password.value} : e);
        chrome.storage.local.set({'passwords': passwords});
        api.uploadUserData(domainName, data).then((res)=> console.log(res));
      });
    }
  }
}

// --> content script work:
chrome.storage.local.get(['login'], function(result){
    if (result.login == true){
      // *** facebook ***
      if (window.location.href.indexOf("facebook.com") > -1) {
        chrome.storage.local.get(['passwords'], function(result){
          let facebook = result.passwords.facebook;
          let email = document.getElementById("email")
          let password = document.getElementById("pass")
          if (facebook!=undefined){
            if (email) 
              email.value = facebook.email
            if (password)
              password.value = facebook.passwords
          }
          // differnt id if the language is different 
          document.getElementById("u_0_b").addEventListener("click", submit(email,password,facebook));
        });
      }
      // *** linkedin ***
      if (window.location.href.indexOf("linkedin.com/login") > -1) {
        chrome.storage.local.get(['passwords'], function(result){
          domainName = "linkedin.com";
          domainData = result.passwords.find((e)=>e.domain === domainName);
          // insert credentials into the input fields
          if(domainData){
            let email = document.getElementById("username")
            let password = document.getElementById("password")
            if(email && password){
              email.value = domainData.userName
              password.value = domainData.userPassword
            }
          }
          let forms = document.getElementsByClassName("login__form") //get form element fo submit event
          if(forms){
            forms[0].addEventListener('submit', onSubmit); 
          }
        });
      }
      // *** cs ***
      if (window.location.href.indexOf("cs.bgu.ac.il") > -1) {
        chrome.storage.local.get(['passwords'], function(result){
          let cs = result.passwords.cs;
          let email=document.getElementsByName("login")
          let password=document.getElementById("password")
          if (cs!=undefined){
            if (email)
              email.value = cs.email
            if (password)
              password.value = cs.passwords
          }
          //not working - jumps before click
          window.onload=function(){
            if (document.getElementsByTagName("input")){
              let btn = document.getElementsByTagName("input")
              btn[8].addEventListener("onclick", submit(email,password,cs));
            }
          }
        });
      }
    }  
});



