// modal view variable
let modalView = null

// sidebar variables
let isForcedCollapsed = false
let isModalAvailable = false
let isModalOpened = false
let userCollapsed = false

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

// switching sidebar
function toggleSidebar() {       
    const isCollapsed = document.body.classList.contains('sidebar-collapsed')     
    if(isCollapsed) {
        showDefaultSidebar()
        userCollapsed = false
    } else {
        showCollapseSidebar()
        userCollapsed = true
    }
}

// functions for responsive layout
function showCollapseSidebar() {
    document.body.classList.add('sidebar-collapsed')
    document.getElementById('defaultSidebar').style.display = 'none'
    document.getElementById('collapsedSidebar').style.display = 'block'
    document.getElementById('mainContent').style.marginLeft = '72px'
}

function showDefaultSidebar() {
    document.body.classList.remove('sidebar-collapsed')
    document.getElementById('defaultSidebar').style.display = 'block'
    document.getElementById('collapsedSidebar').style.display = 'none'
    document.getElementById('mainContent').style.marginLeft = '240px'
}

function hideSidebar() {
    document.getElementById('defaultSidebar').style.display = 'none'
    document.getElementById('collapsedSidebar').style.display = 'none'
    document.getElementById('mainContent').style.marginLeft = '0'
}

// when the whole DOM elements are loaded, set the toggle button
function initNavbarToggleButton() {
    const toggleButton = document.getElementById("sidebarToggle")
    const body = document.body

    toggleButton.addEventListener("click", () => {
        const pageID = body.id
        const width = window.innerWidth

        if(pageID === 'page-video' || width < 1320) { isModalAvailable = true }
        else { isModalAvailable = false }

        // navbar's toggle button works differently
        if(isModalAvailable) {
            if(modalView) {
                isModalOpened = true
                modalView.show()
                console.log(isModalOpened)
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
                        isModalOpened = false
                    })
                    

                    modalView = new bootstrap.Modal(document.getElementById('sidebarModal'), {
                        backdrop: true,
                        keyboard: true
                    })

                    const modalElement = document.getElementById('sidebarModal')
                    modalElement.addEventListener('hidden.bs.modal', () => { isModalOpened = false })

                    isModalOpened = true
                    modalView.show()
                })

        } else {
            // modal view is not available (normal)
            toggleSidebar()
        }
    });
}

function updateResponsiveLayout() {
    const width = window.innerWidth
    const body = document.body
    if(width < 790) {
        hideSidebar()
        isForcedCollapsed = true
    } else if(width < 960) {
        showCollapseSidebar()
        isForcedCollapsed = true
    } else if(width < 1320) {
        showCollapseSidebar()
        isForcedCollapsed = true
    } else {
        isForcedCollapsed = false
        if(userCollapsed) { showCollapseSidebar() }
        else { showDefaultSidebar() }

        // if modal was opened, close it
        if(isModalOpened) {
            const currentModal = bootstrap.Modal.getInstance(document.getElementById('sidebarModal'))
            currentModal.hide()
            isModalOpened = false
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    fetchNavbar()
})

window.addEventListener('resize', updateResponsiveLayout)