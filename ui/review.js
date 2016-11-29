var post=document.getElementById('post_button');

post.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('Review posted');
            }else if(request.status===500){
                alert('Something wrong with the server');
            }
        }
    };
var book_name=document.getElementById('book_name').value;
book_name = book_name.split(' ').join('-');
var book_genre=document.getElementById('book_genre').value;
var review=document.getElementById('review').value;
request.open('POST','http://swaaaaaathii.imad.hasura-app.io/create-review',true);
request.setRequestHeader('Content-Type', 'application/json');
request.send(JSON.stringify({book_name: book_name, book_genre: book_genre, review: review}));
};


