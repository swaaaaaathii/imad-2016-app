var currentrno = window.location.pathname.split('/')[3];
var currentbname = window.location.pathname.split('/')[2];

submit.onclick = function(){
location.href = '/view-reviews/'+currentbname+'/'+currentrno;
};
