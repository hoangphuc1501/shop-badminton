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


// 
const toggle = document.querySelector(".toggle");
const navigation = document.querySelector(".navigation");
const header = document.querySelector(".header");
const mainBody = document.querySelector(".main")

toggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
    header.classList.toggle("active")
    mainBody.classList.toggle("active")
})