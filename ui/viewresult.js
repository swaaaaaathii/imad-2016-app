var currentrno = window.location.pathname.split('/')[3];
var currentbname = window.location.pathname.split('/')[2];
var next = document.getElementById('next');
var nextrno=currentrno-1;
next.onclick = function(){
    if(nextrno>=0){
        location.href = '/view-reviews/'+currentbname+'/'+nextrno;
    }else{
        alert('No more reviews');
    }
};
