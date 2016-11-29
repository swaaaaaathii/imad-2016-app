var search=document.getElementById('search_btn');

search.onclick = function(){
var book_name=document.getElementById('bname').value;
var i;
for(i=0;book_name[i]!='/0';i++){
    if(book_name[i]===' '){
        book_name[i] = '-';
    }
}
location.href='/view-reviews/'+book_name;
};


