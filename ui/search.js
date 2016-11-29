var search=document.getElementById('search_btn');

search.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('Search Successful');
            }else if(request.status===403){
                alert('No review found');
            }else if(request.status===500){
                alert('Something wrong with the server');
            }
        }
    };
var book_name=document.getElementById('bname').value;
book_name = book_name.split(" ").join("-").toLowerCase();
location.href='/view-reviews/'+book_name;
};


