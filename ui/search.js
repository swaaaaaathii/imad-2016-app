var search=document.getElementById('search_btn');

search.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('Search Successful');
            }else if(request.status===403){
                alert('Search Unsuccessful');
            }else if(request.status===500){
                alert('Something wrong with the server');
            }
        }
    };
var book_name=document.getElementById('book_name').value;
request.open('POST','http://swaaaaaathii.imad.hasura-app.io/search-results'+book_name, true);
request.setRequestHeader('Content-Type', 'application/json');
request.send(JSON.stringify({book_name: book_name}));
location.href = '/';
};