console.log('Loaded!');
var crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

var submit=document.getElementById('login_button');

submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('Logged in successfully');
            }else if(request.status===403){
                alert('Username/password incorrect');
            }else if(request.status===500){
                alert('Something wrong with the server');
            }
        }
    };

var username=document.getElementById('username').value;
var password=document.getElementById('password').value;
request.open('POST','http://swaaaaaathii.imad.hasura-app.io/login',true);
request.setRequestHeader('Content-Type' , 'application/json');
request.send(JSON.stringify({username: username, password: password}));
};

/*var element=document.getElementById('main-text');
element.innerHTML = 'new text';*/

var image=document.getElementById('img');
var marginRight=0;
function moveLeft()
{
    marginRight=marginRight+1;
    image.style.marginRight = marginRight+'px';
}
image.onclick = function () { 
    var interval = setInterval(moveLeft,50);
};
