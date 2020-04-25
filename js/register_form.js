
const api = createApiClient();
window.onload=function(){
    if (document.getElementById("myBtn"))
       document.getElementById("myBtn").addEventListener("click", generatePassword);
    if (document.getElementById("sbmt")){
        document.getElementById("sbmt").addEventListener("click", submit);
    }
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

const submit = function () {
    // validate email
    const email=document.getElementById("email");
    const password=document.getElementById("spwd");
    const repassword = document.getElementById("psw-repeat");
    let styleEmail=email.style;;
    let stylePassword=password.style;
    let styleRepassword=repassword.style;
    const err=document.getElementById("err");
    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email.value))){
        password.style=stylePassword;
        repassword.style=styleRepassword;       
        err.innerHTML="&#9940 Please enter a valid email address";
        email.style.border = "2px solid red";
        return;
    }
    // validate password
    const decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!password.value.match(decimal)) { 
        email.style=styleEmail;
        repassword.style=styleRepassword; 
        err.innerHTML="&#9940 Invalid password! &#9940<br> \
        password must be 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
        //email.style.border = none;
        password.style.border = "2px solid red";
        return;
    }
    // check if the re-writen password is equal to password
    if (password.value!=repassword.value){
        email.style=styleEmail;
        password.style=stylePassword;
        err.innerHTML="&#9940 Passwords do not match";
        password.style.border = "2px solid red";
        repassword.style.border = "2px solid red";
        return;
    }
    email.style=styleEmail;
    password.style=stylePassword;
    repassword.style=styleRepassword; 
    /TODO: need to hash the function/
    const myObj = {name: email.value, password: password.value};
    api.register(myObj).then((res)=>{
        console.log(res);
        if(res.msg == 'Success'){
            my_window = window.open("../login.html","_self");
            return;
        }
        err.innerHTML=res.msg;
        return;
    })
    .catch((error)=>{console.log(error)});
    
}