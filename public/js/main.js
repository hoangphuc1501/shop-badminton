// list hình ảnh
var imgFeature = document.querySelector('.img-feature')
    var listImg = document.querySelectorAll('.list-image img')
    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')
    var currentindex = 0;
    function updateImageByIndex(index) {
        document.querySelectorAll('.list-image div').forEach(item => {
            item.classList.remove('active')
        })
        currentindex = index
        imgFeature.src = listImg[index].getAttribute('src')
        listImg[index].parentElement.classList.add('active')
    }
    listImg.forEach((imgElement, index) => {
        imgElement.addEventListener('click', e => {
            updateImageByIndex(index)
        })
    })

    prevBtn.addEventListener('click', e => {
        if (currentindex == 0) {
            currentindex = listImg.length - 1
        } else {
            currentindex--
        }
        updateImageByIndex(currentindex)
    })
    nextBtn.addEventListener('click', e => {
        if (currentindex == listImg.length - 1) {
            currentindex = 0
        } else {
            currentindex++
        }
        updateImageByIndex(currentindex)
    })

    updateImageByIndex(0)
// hết list hình ảnh

// category list
$(document).ready(function () {
    $('.sub-btn').click(function () {
        $(this).next('.sub-category').slideToggle();
        $(this).find('.dropdown').toggleClass('rotate');
    })
})

// hết category