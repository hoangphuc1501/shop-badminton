// table-cart
const tableCart = document.querySelector("[table-cart]");
console.log(tableCart)
if (tableCart) {
    const listInputQuantity = tableCart.querySelectorAll("input[name='quantity']");
    listInputQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const productId = input.getAttribute("item-id");
            const quantity = input.value;
            fetch("/cart/update", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "success") {
                        location.reload();
                    }
                })
        })
    })
}
// End table-cart
// thông báo
const alertMessage = document.querySelector("[alert-message]");
if (alertMessage) {
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 3000);
}
// hết thông báo 
// Sắp xếp
const sortSelect = document.querySelector("[sort-select]");
if (sortSelect) {
    let url = new URL(location.href); // Nhân bản url
    // Bắt sự kiện onChange
    sortSelect.addEventListener("change", () => {
        const value = sortSelect.value;

        if (value) {
            const [sortKey, sortValue] = value.split("-");
            console.log(sortKey);
            console.log(sortValue);
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
        } else {
            url.searchParams.delete("sortKey");
            url.searchParams.delete("sortValue");
        }
        location.href = url.href;
    })
    // Hiển thị lựa chọn mặc định
    const sortKeyCurrent = url.searchParams.get("sortKey");
    const sortValueCurrent = url.searchParams.get("sortValue");
    if (sortKeyCurrent && sortValueCurrent) {
        sortSelect.value = `${sortKeyCurrent}-${sortValueCurrent}`;
    }
}
// Hết Sắp xếp
// phân trang
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if (listButtonPagination.length > 0) {
    let url = new URL(location.href);
    listButtonPagination.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination")

            if (page) {
                url.searchParams.set("page", page);
            } else {
                url.searchParams.delete("page");
            }
            location.href = url.href;
        })
    })
    // hiển thị mặc định
    const pageCurrent = url.searchParams.get("page") || 1;
    const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`);
    if (buttonCurrent) {
        buttonCurrent.classList.add("active");
    }
}

// hết phân trang
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
        console.log("Button clicked"); // Kiểm tra xem click có được kích hoạt
        $(this).next('.sub-category').slideToggle();
        $(this).find('.dropdown').toggleClass('rotate');
    })
})
$(document).ready(function () {
    $('.sub-btn1').click(function () {
        console.log("Button clicked"); // Kiểm tra xem click có được kích hoạt
        $(this).next('.sub-category1').slideToggle();
        $(this).find('.dropdown1').toggleClass('rotate');
    })
})
// hết category