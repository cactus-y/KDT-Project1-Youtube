import { initNavbar } from "./navbar.js";
import { shuffleArray, viewToString, dateToString} from './utils.js'

// sidebar variable
let sidebarModalView = null

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

    // main video section
    const videoContainer = document.getElementById('mainVideoIframeContainer')
    videoContainer.innerHTML = `
        <iframe src="${video.videoUrl}" title="Test Video"
            allowfullscreen style="border-radius: 15px;"></iframe>
    `
    
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
                            <span class="text-muted text-truncate-1-lines" style="font-size: 12px;">${video.channel}</span>
                            <span class="text-muted text-truncate-1-lines" style="font-size: 12px;">${viewToString(video.views)} · ${dateToString(video.uploadedDate)}</span>
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