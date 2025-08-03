export function initNavbar(onToggleSidebar) {
    fetch('../html/navbar.html')
        .then(res => res.text())
        .then(html => {
            const navbar = document.getElementById('navbar')
            navbar.insertAdjacentHTML('afterbegin', html)

            // toggle button actions (index or video)
            document.getElementById('sidebarToggle').addEventListener('click', () => {
                if(onToggleSidebar) onToggleSidebar()
            })

            // search 
            document.getElementById('searchForm').addEventListener('submit', (e) => {
                e.preventDefault()
                const searchInput = document.getElementById('searchInput').value.trim()
                if(searchInput === '') return
                window.location.href = `../html/search.html?search_query=${encodeURIComponent(searchInput)}`
            })
        })
    
    

    // profile dropdown menu
    document.addEventListener('show.bs.dropdown', () => { 
        const scrollbarMargin = window.innerWidth - document.documentElement.clientWidth
        document.body.classList.add('dropdown-open') 
        document.body.style.marginRight = `${scrollbarMargin}px`
        document.getElementById('navbarElement').style.marginRight = `${scrollbarMargin}px`
    })
    document.addEventListener('hide.bs.dropdown', () => { 
        document.body.classList.remove('dropdown-open') 
        document.body.style.marginRight = 0
        document.getElementById('navbarElement').style.marginRight = 0
    })
}

