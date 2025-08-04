import { initNavbar } from "./navbar.js";
import { shuffleArray, getVideoCardHTML, getHorizontalVideoCardHTML } from './utils.js'

let subscribed = ['침착맨', 'Apple', '비욘드 스포츠']

// sidebar variables
let isForcedCollapsed = false
let isModalOpened = false
let userCollapsed = false
let sidebarModalView = null

// video card rendering function
function renderVideoCards(videos) {
    const container = document.getElementById('videoCardContainer')
    container.innerHTML = ''

    videos.forEach((video) => {
        const videoCard = document.createElement('div')
        videoCard.className = 'col'
        videoCard.innerHTML = getVideoCardHTML(video)
        container.appendChild(videoCard)
    })
}

// horizontal video card rendering function
function renderHorizontalVideoCards(videos) {
    const container = document.getElementById('searchedVideoCardContainer')
    container.innerHTML = ''

    if(videos.length > 0) {
        videos.forEach((video) => {
            const horizontalVideoCard = document.createElement('div')
            horizontalVideoCard.classList.add('horizontal-video-card-container', 'mb-3')
            horizontalVideoCard.style.marginLeft = '150px'
            horizontalVideoCard.style.marginRight = '200px'
            horizontalVideoCard.innerHTML = getHorizontalVideoCardHTML(video, 'search')
            container.appendChild(horizontalVideoCard)
        })
        
    } else {
        // empty result
        const emptyContainer = document.createElement('div')
        emptyContainer.classList.add('horizontal-video-card-container', 'mb-3')
        emptyContainer.innerHTML = `
            <span style="font-size: 24px; display:block;">검색결과가 없습니다.</span>
            <span style="font-size: 14px;">다른 검색어를 시도해 보거나 검색 필터를 삭제하세요.</span>
        `
        container.appendChild(emptyContainer)
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

// sidebar toggle button action
function handleSidebarToggle() {
    const width = window.innerWidth
    // modal sidebar is active when width is smaller than 1320px
    if(width < 1320) {
        if(sidebarModalView) {
            isModalOpened = true
            sidebarModalView.show()
            return
        }

        // if sidebar's modal view is not loaded, fetch it.
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
                    

                sidebarModalView = new bootstrap.Modal(document.getElementById('sidebarModal'), {
                    backdrop: true,
                    keyboard: true
                })

                const modalElement = document.getElementById('sidebarModal')
                modalElement.addEventListener('hidden.bs.modal', () => { isModalOpened = false })

                isModalOpened = true
                sidebarModalView.show()
            })
    } else {
        toggleSidebar()
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // video data loading
    fetch('../data/videos.json')
        .then(res => res.json())
        .then(videos => {
            if(window.location.pathname === '/html/index.html') {
                shuffleArray(videos)
                renderVideoCards(videos)
            } else if(window.location.pathname === '/html/subscriptions.html') {
                const filteredVideos = videos.filter(v => subscribed.includes(v.channel))
                shuffleArray(filteredVideos)
                renderVideoCards(filteredVideos)
            } else if(window.location.pathname === '/html/search.html') {
                const query = new URLSearchParams(window.location.search).get('search_query')?.trim().toLowerCase()

                if(!query) {
                    renderHorizontalVideoCards([])
                }
                document.title = `${query} - YouTubeClone`
                const filteredVideos = videos.filter(v => 
                    v.title.toLowerCase().includes(query) || 
                    v.channel.toLowerCase().includes(query) 
                )
                renderHorizontalVideoCards(filteredVideos)
            }
        })
    
    // navbar loading
    initNavbar(handleSidebarToggle)
    updateResponsiveLayout()
}) 

window.addEventListener('resize', updateResponsiveLayout)