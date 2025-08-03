import { initNavbar } from "./navbar.js";
import { shuffleArray, viewToString, dateToString, escapeHTML, getCommentHTML, getVideoCardHTML, getHorizontalVideoCardHTML } from './utils.js'

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
    document.title = `${video.title} - YouTubeClone`
    const simplifiedViewAndDate = `조회수 ${viewToString(video.views)}\u00A0\u00A0${dateToString(video.uploadedDate)}`
    const expandedViewAndDate = `조회수 ${parseInt(video.views).toLocaleString('ko-KR')}회\u00A0\u00A0${video.uploadedDate}`

    // main video section
    const videoContainer = document.getElementById('mainVideoIframeContainer')
    videoContainer.innerHTML = `
        <iframe src="${video.videoUrl}" title="Test Video"
            allowfullscreen style="border-radius: 15px;"></iframe>
    `

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
    document.getElementById('videoLikeButton').addEventListener('click', () => {
        const thumbsUpIcon = document.getElementById('thumbsUpIcon')
        const thumbsDownIcon = document.getElementById('thumbsDownIcon')
        if(thumbsUpIcon.classList.contains('bi-hand-thumbs-up')) {
            if(thumbsDownIcon.classList.contains('bi-hand-thumbs-down-fill')) {
                thumbsDownIcon.classList.remove('bi-hand-thumbs-down-fill')
                thumbsDownIcon.classList.add('bi-hand-thumbs-down')
            }
            thumbsUpIcon.classList.remove('bi-hand-thumbs-up')
            thumbsUpIcon.classList.add('bi-hand-thumbs-up-fill')
        } else if(thumbsUpIcon.classList.contains('bi-hand-thumbs-up-fill')) {
            thumbsUpIcon.classList.remove('bi-hand-thumbs-up-fill')
            thumbsUpIcon.classList.add('bi-hand-thumbs-up')
        }
    })
    document.getElementById('videoDislikeButton').addEventListener('click', () => {
        const thumbsUpIcon = document.getElementById('thumbsUpIcon')
        const thumbsDownIcon = document.getElementById('thumbsDownIcon')
        if(thumbsDownIcon.classList.contains('bi-hand-thumbs-down')) {
            if(thumbsUpIcon.classList.contains('bi-hand-thumbs-up-fill')) {
                thumbsUpIcon.classList.remove('bi-hand-thumbs-up-fill')
                thumbsUpIcon.classList.add('bi-hand-thumbs-up')
            }
            thumbsDownIcon.classList.remove('bi-hand-thumbs-down')
            thumbsDownIcon.classList.add('bi-hand-thumbs-down-fill')
        } else if(thumbsDownIcon.classList.contains('bi-hand-thumbs-down-fill')) {
            thumbsDownIcon.classList.remove('bi-hand-thumbs-down-fill')
            thumbsDownIcon.classList.add('bi-hand-thumbs-down')
        }
    })

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

// checking comment overflow
function checkCommentOverflow(commentBodyId) {
    const commentBody = document.getElementById(`commentBody-${commentBodyId}`)
    if(commentBody.dataset.checked) { return }
    else {
        if(commentBody.scrollHeight > commentBody.clientHeight) {
            const seeDetailButton = document.createElement('span')
            seeDetailButton.classList.add('small-span', 'text-muted', 'd-inline-block')
            seeDetailButton.setAttribute('role', 'button')
            seeDetailButton.innerText = '자세히 보기'

            seeDetailButton.addEventListener('click', () => {
                if(seeDetailButton.innerText === '자세히 보기') {
                    commentBody.classList.remove('text-truncate-4-lines')
                    seeDetailButton.innerText = '간략히'
                } else if(seeDetailButton.innerText === '간략히') {
                    commentBody.classList.add('text-truncate-4-lines')
                    seeDetailButton.innerText = '자세히 보기'
                }
            })

            const commentPosition = document.getElementById(`commentBodyContainer-${commentBodyId}`)
            commentPosition.insertAdjacentElement('afterend', seeDetailButton)
        }
        commentBody.dataset.checked = true
    }
}

// comments rendering
function rederVideoComments(comments) {
    numComments = comments.length
    document.getElementById('commentCountText').innerText = `댓글 ${numComments}개`

    // comment list rendering
    const commentListContainer = document.getElementById('commentListContainer')
    commentListContainer.innerHTML = ''
    comments.forEach((comment, idx) => {
        let replyListHTML = '';
        let replyList = []
        if(comment.replies.length > 0) { 
            [replyListHTML, replyList] = getReplyListHTML(comment.replies, idx)
        }
        const singleComment = document.createElement('div')
        singleComment.className = 'mb-2'
        singleComment.innerHTML = `
            <div class="video-comment-profile d-flex">
                ${getCommentHTML(comment, idx, 40)}
            </div>
        `
        
        commentListContainer.appendChild(singleComment)
        document.getElementById(`commentDetailContainer-${idx}`).insertAdjacentHTML('beforeend', replyListHTML)
        checkCommentOverflow(idx)

        // reply list button receives event handler individually
        const replyListButton = document.getElementById(`replyListButton${idx}`)
        if(replyListButton) { 
            replyListButton.addEventListener('click', () => {
                const buttonIcon = document.getElementById(`replyButtonIcon${idx}`)
                const replyListContainer = document.getElementById(`replyListContainer${idx}`)

                if(buttonIcon.classList.contains('bi-chevron-down')) {
                    // list is not shown yet
                    buttonIcon.classList.remove('bi-chevron-down')
                    buttonIcon.classList.add('bi-chevron-up')
                    replyListContainer.style.display = 'block'
                    if(replyList.length > 0) { replyList.forEach((replyId) => { checkCommentOverflow(replyId) }) }
                } else {
                    // list already shown
                    buttonIcon.classList.remove('bi-chevron-up')
                    buttonIcon.classList.add('bi-chevron-down')
                    replyListContainer.style.display = 'none'
                }
            }) 
        }
    })
}

function getReplyListHTML(replies, idx) {
    let commentBodyIdArray = []
    let htmlString = `
        <div>
            <button class="btn btn-reply-list rounded-pill text-primary mt-0 py-0" type="button" id="replyListButton${idx}">
                <i class="bi bi-chevron-down me-2" id="replyButtonIcon${idx}"></i><span class="small-span slightly-bold">답글 ${replies.length}개</span>
            </button>
            <div id="replyListContainer${idx}" class="mt-2" style="display: none;">
    `
    replies.forEach((reply, index) => {
        commentBodyIdArray.push(`${idx}-${index}`)
        htmlString = htmlString.concat(`
                <div class="d-flex ms-2">
                    ${getCommentHTML(reply, `${idx}-${index}`, 24)}
                </div>
                `)
    })
    htmlString = htmlString.concat('</div></div>')
    return [htmlString, commentBodyIdArray]
}

// recommended video list rendering
function renderRecommendedVideoList(videos) {
    const container = document.getElementById('recommendedVideoListContainer')
    const smallContainer = document.getElementById('recommendedSmallScreenContainer')
    container.innerHTML = ''
    smallContainer.innerHTML = ''

    videos.forEach((video) => {
        // for default container
        const recommendedVideo = document.createElement('div')
        recommendedVideo.className = 'mb-2'
        recommendedVideo.innerHTML = getHorizontalVideoCardHTML(video, 'recommend')
        container.appendChild(recommendedVideo)

        // for small size screen
        const smallRecommended = document.createElement('div')
        smallRecommended.className = 'col'
        smallRecommended.innerHTML = getVideoCardHTML(video)
        smallContainer.appendChild(smallRecommended)
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

// activate comment textfield
function activateCommentTextfield() {
    const dummyCommentInputContainer = document.getElementById('dummyCommentInputContainer')
    const focusedCommentInputContainer = document.getElementById('focusedCommentInputContainer')

    dummyCommentInputContainer.classList.remove('d-block')
    dummyCommentInputContainer.classList.add('d-none')
    focusedCommentInputContainer.classList.remove('d-none')
    focusedCommentInputContainer.classList.add('d-block')
    document.getElementById('realCommentTextArea').focus()
}

// cancel comment writing
function closeComment() {
    const dummyCommentInputContainer = document.getElementById('dummyCommentInputContainer')
    const focusedCommentInputContainer = document.getElementById('focusedCommentInputContainer')

    focusedCommentInputContainer.classList.remove('d-block')
    focusedCommentInputContainer.classList.add('d-none')
    dummyCommentInputContainer.classList.remove('d-none')
    dummyCommentInputContainer.classList.add('d-block')
    document.getElementById('realCommentTextArea').value = ''
    document.getElementById('submitCommentButton').disabled = true
}

// submit comment
function submitComment() {
    const content = document.getElementById('realCommentTextArea').value.trim()
    if(!content) return

    const commentObject = {
        'profileUrl': '../images/sample_img.webp',
        'username': '@cactus-y',
        'date': '방금 전',
        'content': escapeHTML(content).replace(/\n/g, '<br>'),
        'likes': ''
    }
    const singleComment = document.createElement('div')
    singleComment.className = 'mb-2'
    singleComment.innerHTML = `
        <div class="video-comment-profile d-flex">
            ${getCommentHTML(commentObject, numComments, 40)}
        </div>
    `
    document.getElementById('commentListContainer').prepend(singleComment)
    checkCommentOverflow(numComments)
    closeComment()
    numComments += 1
    document.getElementById('commentCountText').innerText = `댓글 ${numComments}개`
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

    // about comment's input focus button
    // textfield focusing button
    document.getElementById('dummyInputButton').addEventListener('click', activateCommentTextfield)
    // cancel comment writing
    document.getElementById('cancelCommentButton').addEventListener('click', closeComment)
    // submit comment
    document.getElementById('submitCommentButton').addEventListener('click', submitComment)
    // when nothing written, button will be disabled
    document.getElementById('realCommentTextArea').addEventListener('input', () => {
        const commentTextArea = document.getElementById('realCommentTextArea')
        commentTextArea.style.height = 'auto'
        commentTextArea.style.height = `${commentTextArea.scrollHeight}px`

        const value = commentTextArea.value.trim()
        if(value.length > 0) { document.getElementById('submitCommentButton').disabled = false }
        else { document.getElementById('submitCommentButton').disabled = true }
    })
}) 