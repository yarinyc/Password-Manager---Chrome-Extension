const api = createApiClient();
window.onload=function(){
    if (document.getElementById("myBtn"))
       document.getElementById("myBtn").addEventListener("click", generate);
    if (document.getElementById("sbmt")){
        document.getElementById("sbmt").addEventListener("click", submit);
    }
}

/* TODO: the generator function is not so good.. (sometimes suggest a one letter password)*/
generate = function () {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!"#$%&\'()*+,-./:;<=>?@^[\\]^_`{|}~';
    const all = uppercase + lowercase + numbers + symbols;
    let password = "";
    for (var index = 0; index < 12; index++) {
        const character = Math.floor(Math.random() * all.length);
        password += all.substring(character, character + 1);
    }
    document.getElementById("pass_text").innerHTML=password;
}

submit = function () {
    // validate email
    const email=document.getElementById("email");
    const password=document.getElementById("spwd");
    const repassword = document.getElementById("psw-repeat");
    let styleEmail;
    let stylePassword;
    let styleRepassword;
    const err=document.getElementById("err");
    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email.value))){
        if (stylePassword!=password.style)
            password.style=stylePassword;
        if (styleRepassword!=repassword.style)
            repassword.style=styleRepassword;       
        style1=email.style;
        err.innerHTML="&#9940 Please enter a valid email address";
        email.style.border = "2px solid red";
        return;
    }
    // validate password
    const decimal=  /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!password.value.match(decimal)) { 
        if (styleEmail!=email.style)
            email.style=styleEmail;
        if (styleRepassword!=repassword.style)
            repassword.style=styleRepassword; 
        style1 = password;
        err.innerHTML="&#9940 Invalid password! &#9940<br> \
        password must be 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
        //email.style.border = none;
        password.style.border = "2px solid red";
        return;
    }
    // check if the re-writen password is equal to password
    if (password.value!=repassword.value){
        if (styleEmail!=email.style)
            email.style=styleEmail;
        else if (stylePassword!=password.style)
            password.style=stylePassword;
        err.innerHTML="&#9940 Passwords do not match";
        password.style.border = "2px solid red";
        repassword.style.border = "2px solid red";
        return;
    }
    /TODO: need to hash the function/
    const myObj = {name: email.value, password: password.value};
    api.register(myObj).then((res)=>{
        console.log(res);
        if(res.msg == 'Success'){
            my_window = window.open("../connect.html","_self");
            return;
        }
        err.innerHTML=res.msg;
        return;
    })
    .catch((error)=>{console.log(error)});
    
}