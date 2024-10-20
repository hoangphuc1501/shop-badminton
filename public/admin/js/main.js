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
    
// hết tìm kiếm