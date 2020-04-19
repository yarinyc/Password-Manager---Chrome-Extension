//import { compare } from "bcrypt";

chrome.storage.local.get(['login'], function(result){
    if (result.login==true){
      //facebook
      if (window.location.href.indexOf("facebook.com") > -1) {
        chrome.storage.local.get(['passwords'], function(result){
          let facebook = result.passwords.facebook;
          email=document.getElementById("email")
          password=document.getElementById("pass")
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
      //linkedin
      if (window.location.href.indexOf("linkedin.com") > -1) {
        chrome.storage.local.get(['passwords'], function(result){
          let linkedin = result.passwords.linkedin;
          email=document.getElementById("username")
          password=document.getElementById("password")
          if (linkedin!=undefined){
            if (email)
              email.value = linkedin.email
            if (password)
              password.value = linkedin.passwords
          }
          window.onload=function(){
            if (document.getElementsByClassName("btn__primary--large from__button--floating")){
              let btn = document.getElementsByClassName("btn__primary--large from__button--floating")
              btn.addEventListener("onclick",submit(email,password,linkedin));
            }
          }
        });
      }
      //cs
      if (window.location.href.indexOf("cs.bgu.ac.il") > -1) {
        chrome.storage.local.get(['passwords'], function(result){
          let cs = result.passwords.cs;
          email=document.getElementsByName("login")
          password=document.getElementById("password")
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
})


submit = function (email,password,domain) {
  if (domain==undefined){
    if (confirm("Do you want 'Password Manager' to save your user credentials?")==true){
      //add domain to json and update in server
      // chrome.storage.local.get(['passwords'], function(result) {
      //    const myObj = {domain: {name:email, password:password}}
      //    result.push(myObj);
      //  });
    }
  }
  else if (domain.email==email&&domain.password!=password){
    if (confirm("Do you want 'Password Manager' to update your password?")==true){
      //edit domain in json and update in server
    }
  }
  else if  (domain.email!=email){
    if (confirm("Do you want 'Password Manager' to update your user credentials?")==true){
      //edit domain in json and update in server
    }
  }
}



