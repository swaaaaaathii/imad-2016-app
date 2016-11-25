console.log('Loaded!');

var login=document.getElementById('login_button');

login.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('Logged in successfully');
            }else if(request.status===403){
                alert('Username incorrect');
            }else if(request.status===402){
                alert('Password incorrect');
            }else if(request.status===500){
                alert('Something wrong with the server');
            }
        }
    };

var username=document.getElementById('username').value;
var password=document.getElementById('password').value;
console.log(username);
console.log(password);
request.open('POST','http://swaaaaaathii.imad.hasura-app.io/login',true);
request.setRequestHeader('Content-Type', 'application/json');
request.send(JSON.stringify({username: username, password: password}));
};

var image=document.getElementById('img');
var marginRight=0;
function moveLeft()
{
    marginRight=marginRight+1;
    image.style.marginRight = marginRight+'px';
}
image.onclick = function () { 
    var interval = setInterval(moveLeft,5);
};

var submit=document.getElementById('submit_btn');

submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('User created successfully');
            }else if(request.status===403){
                alert('User not created. Re-try');
            }else if(request.status===500){
                alert('Something wrong with the server');
            }
        }
    };
var username=document.getElementById('username').value;
var password=document.getElementById('password').value;
var name=document.getElementById('name').value;
var date=document.getElementById('date').value;
var phno=document.getElementById('phno').value;
var email=document.getElementById('email').value;
request.open('POST','http://swaaaaaathii.imad.hasura-app.io/create-user',true);
request.setRequestHeader('Content-Type', 'application/json');
request.send(JSON.stringify({username: username, password: password, name: name, date: date, phno: phno, email: email}));
};
