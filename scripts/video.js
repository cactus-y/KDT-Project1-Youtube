import { initNavbar } from "./navbar.js";
import { shuffleArray, viewToString, dateToString} from './utils.js'

// some variables
let sidebarModalView = null
let numComments = -1

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
    const simplifiedView = viewToString(video.views)
    const commaView = parseInt(video.views).toLocaleString('ko-KR')
    const simplifiedDate = dateToString(video.uploadedDate)

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

    // views && date (simplified version)
    // this part is temporal. it will be modified when the toggle for description is ready
    document.getElementById('viewsAndDateText').innerText = `조회수 ${simplifiedView}\u00A0\u00A0${simplifiedDate}`
    document.getElementById('videoDescriptionText').innerText = `abcdef\nghijkl\nmnopqr\n`

    // comments will be handled here
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
    
    // navbar loading
    initNavbar(handleSidebarToggle)
}) 