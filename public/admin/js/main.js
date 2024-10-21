// thêm class sidebar
let list = document.querySelectorAll(".navigation li");
function activeLink() {
    list.forEach((item) => {
        item.classList.remove("hovered");
    });
    this.classList.add("hovered");
}
list.forEach((item) => {
    item.addEventListener("mouseover", activeLink);
})
// hết thêm class sidebar

// toggle
const toggle = document.querySelector(".toggle");
const navigation = document.querySelector(".navigation");
const header = document.querySelector(".header");
const mainBody = document.querySelector(".main")

toggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
    header.classList.toggle("active")
    mainBody.classList.toggle("active")
})
// hết toggle

// lọc theo trạng thái
    const boxFilter = document.querySelector("[box-filter]");
    // bắt sự kiện onchange
    if(boxFilter){
        let url = new URL(location.href);

        boxFilter.addEventListener("change", () => {
            const value = boxFilter.value;
            
            if(value){
                url.searchParams.set("status", value);
            }else{
                url.searchParams.delete("status");
            }
            location.href = url.href;
        })
        // hiển thị mặc định
        const statusCurrent = url.searchParams.get("status");
        if(statusCurrent){
            boxFilter.value = statusCurrent;
        }
    }

// hết lọc theo trạng thái

// tìm kiếm
    const formSearch = document.querySelector("[form-search]");

    if(formSearch) {
        let url = new URL(location.href);

        formSearch.addEventListener("submit", (event) => {
            event.preventDefault();
            const value = formSearch.keyword.value;
            if(value){
                url.searchParams.set("keyword", value);
            }else{
                url.searchParams.delete("keyword");
            }

            location.href = url.href;
        });
        // hiển thị từ khóa mặc định
        const valueCurrent = url.searchParams.get("keyword");
        if(valueCurrent) {
            formSearch.keyword.value = valueCurrent;
        }
    }
// hết tìm kiếm

// phân trang
    const listButtonPagination = document.querySelectorAll("[button-pagination]");
    if(listButtonPagination.length > 0){
        let url = new URL(location.href);
        listButtonPagination.forEach((button) => {
            button.addEventListener("click", () => {
                const page = button.getAttribute("button-pagination")

                if(page){
                    url.searchParams.set("page", page);
                }else{
                    url.searchParams.delete("page");
                }
                location.href = url.href;
            })
        })
        // hiển thị mặc định
        const pageCurrent = url.searchParams.get("page") || 1;
        const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`);
        if(buttonCurrent){
            buttonCurrent.parentNode.classList.add("active");
        }
    }
    
// hết phân trang

// đổi trạng thái
    const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
    if(listButtonChangeStatus.length > 0){
        listButtonChangeStatus.forEach((button) => {
            button.addEventListener("click", () => {
                const path = button.getAttribute("data-path");
                const itemId = button.getAttribute("item-id");
                const statusChange = button.getAttribute("button-change-status");
                
                data = {
                    id: itemId,
                    status: statusChange
                }
                
                fetch(path,{
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PATCH",
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data =>{
                    if(data.code == "success"){
                        location.reload();
                    }
                })
            })
        })
    }
// hết đổi trạng thái