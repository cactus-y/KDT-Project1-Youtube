import { initNavbar } from "./navbar.js";
import { shuffleArray, viewToString, dateToString} from './utils.js'

// some variables
let sidebarModalView = null
let numComments = -1
let isDescriptionExpanded = false
let expandDescriptionClickHandler = null
let collapseDescriptionClickHandler = null

// sidebar toggle button action
function handleSidebarToggle() {
    if(sidebarModalView) {
        sidebarModalView.show()
        return
    }

    fetch('../html/modal_sidebar.html')
        .then(res => res.text())
        .then(html => {
            const modalWrapper = document.getElementById('sidebarModalContent')
            modalWrapper.insertAdjacentHTML('afterbegin', html)

            document.getElementById("modalCloseButton").addEventListener("click", () => {
                const currentModal = bootstrap.Modal.getInstance(document.getElementById('sidebarModal'))
                currentModal.hide()
            })
                    

            sidebarModalView = new bootstrap.Modal(document.getElementById('sidebarModal'), {
                backdrop: true,
                keyboard: true
            })

            sidebarModalView.show()
        })
}

/* video related functions */
// remove main video from whole array
function popMainVideo(videos, videoId) {
    const idx = videos.findIndex(video => video.id === videoId)
    if(idx === -1) return null
    return videos.splice(idx, 1)[0]
} 

// main video rendering
function renderMainVideo(video) {
    document.title = video.title
    const simplifiedViewAndDate = `조회수 ${viewToString(video.views)}\u00A0\u00A0${dateToString(video.uploadedDate)}`
    const expandedViewAndDate = `조회수 ${parseInt(video.views).toLocaleString('ko-KR')}회\u00A0\u00A0${video.uploadedDate}`

    // main video section
    const videoContainer = document.getElementById('mainVideoIframeContainer')
    videoContainer.innerHTML = `
        <iframe src="${video.videoUrl}" title="Test Video"
            allowfullscreen style="border-radius: 15px;"></iframe>
    `
    /* now title, profile, description, likes should be implemented */
    const videoDescriptionContainer = document.getElementById('videoDescriptionContainer')
    videoDescriptionContainer.insertAdjacentHTML('afterbegin', `<h5 class="fw-bold">${video.title}</h5>`)

    // channel buttons
    const isSubscribed = video.subscribed
    const buttonClass = isSubscribed
        ? 'btn btn-gray rounded-pill px-3 my-1 ms-4'
        : 'btn btn-not-subscribed rounded-pill px-3 my-1 ms-4'
    const subscribedHTML = '<i class="bi bi-bell"></i><span class="small-span mx-2">구독중</span><i class="bi bi-chevron-down"></i>'
    const notSubscribedHTML = '<span class="text-white small-span">구독</span>'
    const channelButtonGroup = document.getElementById('channelButtonGroup')
    channelButtonGroup.innerHTML = `
        <a href="${video.channelLink}">
            <img src="${video.profileImgLink}" alt="channel_profile" class="rounded-circle me-2" style="width: 40px; height: 40px;">
        </a>
        <div class="ms-1 py-0">
            <a href="${video.channelLink}" class="text-decoration-none text-black">
                <span class="d-block">${video.channel}</span>
            </a>
            <span class="text-muted d-block" style="font-size: 12px;">구독자 ${video.subscriber}</span>
        </div>
        <button class="${buttonClass}" type="button" id="subscribeButton">
            ${isSubscribed ? subscribedHTML : notSubscribedHTML}
        </button>
    `
    document.getElementById('subscribeButton').addEventListener('click', (e) => {
        console.log(e)
        const button = e.target.closest('button')
        if(!button) return

        const localIsSubscribed = button.classList.contains('btn-gray')
        if(localIsSubscribed) {
            button.classList.remove('btn-gray')
            button.classList.add('btn-not-subscribed')
            button.innerHTML = notSubscribedHTML
        } else {
            button.classList.remove('btn-not-subscribed')
            button.classList.add('btn-gray')
            button.innerHTML = subscribedHTML
        }
    })

    // likes
    document.getElementById('videoLikeNum').innerText = video.likes

    // views && date
    const descriptionBox = document.getElementById('videoDescriptionBox')
    const collapseButton = document.getElementById('collapseDescriptionButton')

    document.getElementById('viewsAndDateText').innerText = simplifiedViewAndDate
    document.getElementById('videoDescriptionText').innerText = `${video.description}`

    if(expandDescriptionClickHandler) { descriptionBox.removeEventListener('click', expandDescriptionClickHandler) }
    if(collapseDescriptionClickHandler) { collapseButton.removeEventListener('click', collapseDescriptionClickHandler) }

    expandDescriptionClickHandler = () => { expandDescription(expandedViewAndDate) }
    collapseDescriptionClickHandler = (e) => { 
        e.stopPropagation()
        collapseDescription(simplifiedViewAndDate) 
    }

    descriptionBox.addEventListener('click', expandDescriptionClickHandler)
    collapseButton.addEventListener('click', collapseDescriptionClickHandler)
}

// comments rendering
function rederVideoComments(comments) {
    numComments = comments.length
    document.getElementById('commentCountText').innerText = `댓글 ${numComments}개`
}

// recommended video list rendering
function renderRecommendedVideoList(videos) {
    const container = document.getElementById('recommendedVideoListContainer')
    container.innerHTML = ''

    videos.forEach((video) => {
        const recommendedVideo = document.createElement('div')
        recommendedVideo.className = 'mb-2'
        recommendedVideo.innerHTML = `
            <div class="recommend-video-card align-items-start w-100">
                <a href="./video.html?videoId=${video.id}" class="text-decoration-none text-black">
                    <div class="d-flex">
                        <img src="${video.thumbnail}" alt="Video Thumbnail" class="rounded me-2 flex-shrink-0" width="168" height="94">
                        <div class="video-text-group flex-grow-1">
                            <span class="video-title text-truncate-2-lines slightly-bold small-span">${video.title}</span>
                            <span class="text-muted text-truncate-1-lines" style="font-size: 12px;">${video.channel}</span><br>
                            <span class="text-muted text-truncate-1-lines" style="font-size: 12px;">조회수 ${viewToString(video.views)} · ${dateToString(video.uploadedDate)}</span>
                        </div>
                        <div class="position-relative">
                            <button class="btn btn-hover-gray rounded-circle p-0 top-0 end-0 px-1" type="button"><i class="bi bi-three-dots-vertical"></i></button>
                        </div>
                    </div>
                </a>
            </div>
        `

        container.appendChild(recommendedVideo)
    })
}

// video description button setting
function expandDescription(expandedViewAndDate) {
    if(isDescriptionExpanded) return
    isDescriptionExpanded = true

    const viewsAndDateText = document.getElementById('viewsAndDateText')
    const descriptionBox = document.getElementById('videoDescriptionBox')
    const collapseButton = document.getElementById('collapseDescriptionButton')

    viewsAndDateText.innerText = expandedViewAndDate
    document.getElementById('videoDescriptionText').classList.remove('text-truncate-3-lines')
    collapseButton.style.display = 'block'

    // role attribue removal
    descriptionBox.removeAttribute('role')
}

function collapseDescription(simplifiedDateAndView) {
    if(!isDescriptionExpanded) return
    isDescriptionExpanded = false

    const viewsAndDateText = document.getElementById('viewsAndDateText')
    const descriptionBox = document.getElementById('videoDescriptionBox')
    const collapseButton = document.getElementById('collapseDescriptionButton')

    viewsAndDateText.innerText = simplifiedDateAndView
    document.getElementById('videoDescriptionText').classList.add('text-truncate-3-lines')
    collapseButton.style.display = 'none'

    // role attribue added
    descriptionBox.setAttribute('role', 'button')
}

window.addEventListener('DOMContentLoaded', () => {
    // video data loading
    fetch('../data/videos.json')
        .then(res => res.json())
        .then(videos => {
            // get video id from query string
            const videoId = parseInt(new URLSearchParams(window.location.search).get('videoId'))

            const mainVideo = popMainVideo(videos, videoId)
            renderMainVideo(mainVideo)

            shuffleArray(videos)
            renderRecommendedVideoList(videos)
        })
    
    fetch('../data/comments.json')
        .then(res => res.json())
        .then(comments => {
            rederVideoComments(comments)
        })

    // navbar loading
    initNavbar(handleSidebarToggle)
}) 