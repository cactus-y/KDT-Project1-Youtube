import { initNavbar } from "./navbar.js";
import { shuffleArray, viewToString, dateToString} from './utils.js'

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
        
        videoCard.innerHTML = `
            <div class="card border-0 video-card" role="button" onclick="window.location.href='./video.html?videoId=${video.id}'">
                <img src="${video.thumbnail}" class="card-img-top rounded" alt="Thumbnail">
                <div class="card-body p-2 pe-0 d-flex">
                    <a href="${video.channelLink}" class="me-1" onclick="event.stopPropagation();">
                        <img src="${video.profileImgLink}" class="rounded-circle me-2" alt="Channel Thumbnail" style="width: 36px; height: 36px;">
                    </a>
                    <div>
                        <a href="./video.html?videoId=${video.id}" class="text-decoration-none text-dark">
                            <span class="card-title mb-0 d-block slightly-bold text-truncate-2-lines" style="max-height: 50px;">${video.title}</span>
                        </a>
                        <a href="${video.channelLink}" class="text-decoration-none text-dark" onclick="event.stopPropagation();">
                            <span class="card-text text-muted mb-0 small-span">${video.channel}</span>
                        </a>
                        <span class="card-text text-muted d-block small-span">조회수 ${viewToString(video.views)} · ${dateToString(video.uploadedDate)}</span>
                    </div>
                    <div class="position-relative ms-auto" onclick="event.stopPropagation();">
                        <button class="btn rounded-circle p-0 top-0 end-0" type="button"><i class="bi bi-three-dots-vertical"></i></button>
                    </div>
                </div>
            </div>
        `

        container.appendChild(videoCard)
    })
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
            }
            
        })
    
    // navbar loading
    initNavbar(handleSidebarToggle)
    updateResponsiveLayout()
}) 

window.addEventListener('resize', updateResponsiveLayout)