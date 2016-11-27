var search=document.getElementById('search_btn');

search.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('Search successful');
            }else if(request.status===500){
                alert('Something wrong with the server');
            }
        }
    };
var book_name=document.getElementById('bname').value;
location.href='/view-reviews/'+bname;
//request.open('GET','http://swaaaaaathii.imad.hasura-app.io/view-reviews/'+bname,true);
/*request.setRequestHeader('Content-Type', 'application/json');
request.send(JSON.stringify({bname: bname}));*/
};


