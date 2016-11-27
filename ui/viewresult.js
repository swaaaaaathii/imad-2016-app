var currentrno = window.location.pathname.split('/')[3];
var currentbname = window.location.pathname.split('/')[2];
var next = document.getElementById('next');
next.onclick = function(){
    if(currentrno-1!==0){
        location.href = '/view-reviews/'+currentbname+'/'+currentrno-1;
    }else{
        alert('No more reviews');
    }
};
