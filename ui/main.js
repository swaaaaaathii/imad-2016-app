console.log('Loaded!');

var element=document.getElementById('main-text');
element.innerHTML = 'new text';

var image=document.getElementById('img');
var marginleft=0;
function moveRight()
{
    marginleft=marginleft+1;
    image.style.marginLeft = marginleft+'px';
}
image.onclick = function () { 
    var interval = setInterval(moveRight,50);
};
