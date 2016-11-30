var submit=document.getElementById('submit_btn');

submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('User created successfully');
                location.href = '/';
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
