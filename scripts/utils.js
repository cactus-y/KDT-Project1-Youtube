// array shuffling function
export function shuffleArray(arr) {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
}

// view calculator
export function viewToString(viewNum) {
    const HUN_M = viewNum / 100000000
    const TEN_K = viewNum / 10000
    const K = viewNum / 1000

    if(HUN_M >= 10) { return `${Math.floor(HUN_M)}억회`}
    else if(HUN_M >= 1) {
        const temp = Math.floor(HUN_M * 10)
        return `${temp % 1 === 0 ? Math.floor(temp) : temp}억회`
    } 
    else if(TEN_K >= 10) { return `${Math.floor(TEN_K)}만회`}
    else if(TEN_K >= 1) {
        const temp = Math.floor(TEN_K * 10)
        return `${temp % 1 === 0 ? Math.floor(temp) : temp}만회`
    }
    else if(K >= 1) {
        const temp = Math.floor(K * 10)
        return `${temp % 1 === 0 ? Math.floor(temp) : temp}천회`
    }
    else { return `${viewNum}회`}
}

// date calculator
export function dateToString(date) {
    const [year, month, day] = date.split('.').map(str => parseInt(str.trim(), 10))
    const dateObj = new Date(year, month - 1, day)
    const now = new Date()

    const timeDiff = now - dateObj
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

    if(dayDiff < 30) { return `${dayDiff}일 전` }

    const monthDiff = Math.floor(dayDiff / 30)
    if(monthDiff < 12) { return `${monthDiff}개월 전`}

    const yearDiff = Math.floor(monthDiff / 12)
    return `${yearDiff}년 전`
}

export function escapeHTML(str) {
    return str.replace(/[&<>"']/g, match => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[match]))
}

export function getVideoCardHTML(video) {
    if(video) { 
        return `
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
    } else { return '' }
}

export function getHorizontalVideoCardHTML(video, mode) {
    if(video) {
        let videoDetail = ''
        if(mode == 'recommend') {
            videoDetail = `
                <img src="${video.thumbnail}" alt="Video Thumbnail" class="rounded me-2 flex-shrink-0" width="168px" height="92px">
                <div class="video-text-group">
                    <span class="video-title text-truncate-2-lines slightly-bold small-span">${video.title}</span>
                    <span class="text-muted text-truncate-1-lines" style="font-size: 12px;">${video.channel}</span><br>
                    <span class="text-muted text-truncate-1-lines" style="font-size: 12px;">조회수 ${viewToString(video.views)} · ${dateToString(video.uploadedDate)}</span>
                </div>
            `
        } else if(mode == 'search') {
            videoDetail = `
                <img src="${video.thumbnail}" alt="Video Thumbnail" class="rounded me-2 flex-shrink-1" width="500px">
                <div class="video-text-group ">
                    <span class="video-title text-truncate-2-lines" style="font-size: 18px;">${video.title}</span>
                    <span class="text-muted text-truncate-1-lines" style="font-size: 12px;">조회수 ${viewToString(video.views)} · ${dateToString(video.uploadedDate)}</span><br>
                    <a href="${video.channelLink}" class="text-decoration-none" onclick="stopPropagation();">
                        <img src="${video.profileImgLink}" class="rounded-circle me-2" alt="Channel Thumbnail" style="width: 24px; height: 24px;">
                        <span class="text-muted text-truncate-1-lines" style="font-size: 12px;">${video.channel}</span><br>
                    </a>
                    <span class="d-block text-muted text-truncate-1-lines" style="font-size: 12px; max-width: 730px;">${video.description}</span>
                </div>
            `
        }
        return `
            <div class="horizontal-video-card align-items-start w-100">
                <div role="button" onclick="window.location.href='./video.html?videoId=${video.id}'" class="text-decoration-none text-black">
                    <div class="d-flex">
                        ${videoDetail}
                        <div class="position-relative" onclick="event.stopPropagation();">
                            <button id="recommendedVideoDropdownButton" class="btn btn-hover-gray rounded-circle p-0 top-0 end-0 px-1" type="button"><i class="bi bi-three-dots-vertical"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `
    } else { return '' }
}

export function getCommentHTML(comment, idx, profileSize) {
    if(comment) {
        return `
            <img src="${comment.profileUrl}" alt="Comment Profile Image" class="rounded-circle me-2 mt-1" style="width: ${profileSize}px; height: ${profileSize}px;">
            <div class="mx-1 py-0" id="commentDetailContainer-${idx}">
                <span class="comment-author slightly-bold" style="font-size: 13px;">${comment.username}</span>
                <span class="comment-date text-muted" style="font-size: 12px;">${comment.date}</span>
                <div id="commentBodyContainer-${idx}">
                    <span class="comment-body small-span text-truncate-4-lines" id="commentBody-${idx}" style="max-height: 85px;">${comment.content}</span>
                </div>
                <div class="like-dislike-btn-group d-flex align-items-center" id="commentLikeButtonContainer">
                    <button class="btn btn-hover-gray rounded-circle p-0" type="button"><i class="bi bi-hand-thumbs-up"></i></button>
                    <span class="text-muted ms-1 me-2" style="font-size: 12px;">${comment.likes}</span>
                    <button class="btn btn-hover-gray rounded-circle p-0" type="button"><i class="bi bi-hand-thumbs-down"></i></button>
                    <button class="btn btn-hover-gray rounded-pill" type="button"><span class="slightly-bold small-span">답글</span></button>
                </div>
                <!-- if reply exists -->
            </div>
        `
    } else { return '' }
}