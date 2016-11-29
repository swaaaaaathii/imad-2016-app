var search=document.getElementById('search_btn');

search.onclick = function(){
var book_name=document.getElementById('bname').value;
book_name = book_name.split(" ").join("-").toLowerCase();
location.href='/view-reviews/'+book_name;
};


