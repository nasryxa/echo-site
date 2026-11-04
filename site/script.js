const lightbox = document.getElementById('lightbox');

if (lightbox)
{
    document.querySelectorAll('.concert__img').forEach(function (img){
        img.onclick = function (){
            lightbox.querySelector('img').src = img.src;
            lightbox.showModal();
        };
    });

    lightbox.onclick = function(){
        lightbox.close();
    }
}