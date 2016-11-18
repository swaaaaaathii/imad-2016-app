console.log('Loaded!');

/*var element=document.getElementById('main-text');
element.innerHTML = 'new text';*/

var image=document.getElementById('img');
var marginRight=0;
function moveLeft()
{
    marginright=marginright+1;
    image.style.marginRight = marginRight+'px';
}
image.onclick = function () { 
    var interval = setInterval(moveLeft,50);
};
