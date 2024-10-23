

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
if (boxFilter) {
    let url = new URL(location.href);

    boxFilter.addEventListener("change", () => {
        const value = boxFilter.value;

        if (value) {
            url.searchParams.set("status", value);
        } else {
            url.searchParams.delete("status");
        }
        location.href = url.href;
    })
    // hiển thị mặc định
    const statusCurrent = url.searchParams.get("status");
    if (statusCurrent) {
        boxFilter.value = statusCurrent;
    }
}

// hết lọc theo trạng thái

// tìm kiếm
const formSearch = document.querySelector("[form-search]");

if (formSearch) {
    let url = new URL(location.href);

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = formSearch.keyword.value;
        if (value) {
            url.searchParams.set("keyword", value);
        } else {
            url.searchParams.delete("keyword");
        }

        location.href = url.href;
    });
    // hiển thị từ khóa mặc định
    const valueCurrent = url.searchParams.get("keyword");
    if (valueCurrent) {
        formSearch.keyword.value = valueCurrent;
    }
}
// hết tìm kiếm

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
        buttonCurrent.parentNode.classList.add("active");
    }
}

// hết phân trang

// đổi trạng thái
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if (listButtonChangeStatus.length > 0) {
    listButtonChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const path = button.getAttribute("data-path");
            const itemId = button.getAttribute("item-id");
            const statusChange = button.getAttribute("button-change-status");

            data = {
                id: itemId,
                status: statusChange
            }

            fetch(path, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify(data)
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
// hết đổi trạng thái

// Đổi trạng thái nhiều bản ghi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault();
        const path = formChangeMulti.getAttribute("data-path");
        const status = formChangeMulti.status.value;

        if (status == "delete") {
            const isConform = confirm("Bạn có chắc chắn xóa bản ghi này");
            if (!isConform) {
                return
            }
        }

        const ids = [];

        const listInputChangeChecked = document.querySelectorAll("[input-change]:checked");
        listInputChangeChecked.forEach((input) => {
            const id = input.getAttribute("input-change");
            ids.push(id);
        })

        const data = {
            ids: ids,
            status: status
        }
        fetch(path, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "success") {
                    location.reload();
                }
            })
    })
}
// hết đổi trạng thái nhiều bãn ghi

// xóa sản phẩm mềm
// const ListButtonDelete = document.querySelectorAll("[button-delete]");
// if (ListButtonDelete.length > 0) {
//     ListButtonDelete.forEach((button) => {
//         button.addEventListener("click", () => {
//             const isConform = confirm("bạn có chắc chắn muốn xóa sản phẩm này!");
//             if (isConform) {
//                 const path = button.getAttribute("data-path");
//                 const id = button.getAttribute("item-id");
//                 fetch(path, {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     method: "PATCH",
//                     body: JSON.stringify({
//                         id: id
//                     })
//                 })
//                     .then(res => res.json())
//                     .then(data => {
//                         if (data.code == "success") {
//                             location.reload();
//                         }
//                     })
//             }

//         })
//     })
// }
const ListButtonDelete = document.querySelectorAll("[button-delete]");
if (ListButtonDelete.length > 0) {
    ListButtonDelete.forEach((button) => {
        button.addEventListener("click", () => {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    const path = button.getAttribute("data-path");
                    const id = button.getAttribute("item-id");
                    
                    // Send a PATCH request to the server
                    fetch(path, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "PATCH",
                        body: JSON.stringify({
                            id: id
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.code === "success") {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your file has been deleted.",
                                    icon: "success"
                                }).then(() => {
                                    // Reload the page after successful deletion
                                    location.reload();
                                });
                            } else {
                                Swal.fire({
                                    title: "Error!",
                                    text: "Something went wrong.",
                                    icon: "error"
                                });
                            }
                        })
                        .catch(() => {
                            Swal.fire({
                                title: "Error!",
                                text: "Failed to delete the item.",
                                icon: "error"
                            });
                        });
                }
            });
        });
    });
}

// hết xóa sản phẩm

// thay đổi vị trí
    const ListInputPosition = document.querySelectorAll("[input-position]");
    if(ListInputPosition){
        ListInputPosition.forEach((input) =>{
            input.addEventListener("change", () =>{
                const path = input.getAttribute("data-path");
                const id = input.getAttribute("item-id");
                const position = parseInt(input.value);
    
                const data = {
                    id: id,
                    position: position
                };
    
                fetch(path, {
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
// hết thay đổi vị trí
