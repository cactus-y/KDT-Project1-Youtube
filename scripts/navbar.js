

export function initNavbar(onToggleSidebar) {
    fetch('../html/navbar.html')
        .then(res => res.text())
        .then(html => {
            const navbar = document.getElementById('navbar')
            navbar.insertAdjacentHTML('afterbegin', html)

            // toggle button actions (index or video)
            const toggleButton = document.getElementById('sidebarToggle')
            toggleButton.addEventListener('click', () => {
                if(onToggleSidebar) onToggleSidebar()
            })
        })
    let scrollY = 0
    document.addEventListener('show.bs.dropdown', () => { 
        document.body.classList.add('dropdown-open') 
    })
    document.addEventListener('hide.bs.dropdown', () => { 
        document.body.classList.remove('dropdown-open') 
    })
}

