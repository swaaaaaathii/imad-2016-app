console.log('Loaded!');

var element=document.getElementById('main-text');
element.innerHTML = 'new text';

var image=document.getElementById('img');
image.onclick = function () { 
    image.style.marginLeft = '100px';
};
