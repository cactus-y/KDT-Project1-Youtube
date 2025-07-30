// modal view variable
let modalView = null

// fetch navbar html file
function fetchNavbar() {
    fetch('./navbar.html')
        .then(res => res.text())
        .then(html => {
            const navbar = document.getElementById('navbar')
            navbar.insertAdjacentHTML('afterbegin', html)

            initNavbarToggleButton()
        })
}

// when the whole DOM elements are loaded, set the toggle button
function initNavbarToggleButton() {
    const toggleButton = document.getElementById("sidebarToggle")
    const body = document.body

    toggleButton.addEventListener("click", () => {
        const pageID = body.id

        // navbar's toggle button works differently
        if (pageID === "page-main") {
            // const defaultSidebar = document.getElementById("defaultSidebar")


        } else if (pageID === "page-video") {
            // if modal view exists, just show it
            if(modalView) {
                modalView.show()
                return
            }

            // fetch sidebar html, and create modal view
            fetch('../html/modal_sidebar.html')
                .then(res => res.text())
                .then(html => {
                    const modalWrapper = document.getElementById('sidebarModalContent')
                    modalWrapper.insertAdjacentHTML('afterbegin', html)

                    document.getElementById("modalCloseButton").addEventListener("click", () => {
                        const currentModal = bootstrap.Modal.getInstance(document.getElementById('sidebarModal'))
                        currentModal.hide()
                    })
                    

                    modalView = new bootstrap.Modal(document.getElementById('sidebarModal'), {
                        backdrop: true,
                        keyboard: true
                    })
                    modalView.show()
                })
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchNavbar()
})