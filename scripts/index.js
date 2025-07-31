// array shuffling function
function shuffleArray(arr) {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
}

// view calculator
function viewToString(viewNum) {
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
function dateToString(date) {
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


// video card rendering function
function renderVideoCards(videos) {
    const container = document.getElementById('videoCardContainer')
    container.innerHTML = ''

    videos.forEach((video, idx) => {
        const videoCard = document.createElement('div')
        videoCard.className = 'col'
        
        videoCard.innerHTML = `
            <a href="./video.html?videoId=${video.id}" class="text-decoration-none text-dark">
                <div class="card border-0 video-card">
                    <img src="${video.thumbnail}" class="card-img-top rounded" alt="Thumbnail">
                    <div class="card-body p-2 d-flex">
                        <img src="${video.profileImgLink}"
                            class="rounded-circle me-2" alt="Channel Thumbnail"
                            style="width: 36px; height: 36px;">
                        <div>
                            <span class="card-title mb-0 d-block slightly-bold text-truncate-2-lines" style="max-height: 50px;">${video.title}</span>
                            <span class="card-text text-muted mb-0 small-span">${video.channel}</span>
                            <span class="card-text text-muted d-block small-span">조회수 ${viewToString(video.views)} · ${dateToString(video.uploadedDate)}</span>
                        </div>
                        <div class="position-relative ms-auto">
                            <button class="btn rounded-circle p-0 top-0 end-0" type="button"><i
                                class="bi bi-three-dots-vertical"></i></button>
                        </div>
                    </div>
                </div>
            </a>
        `

        container.appendChild(videoCard)
    })
}


document.addEventListener('DOMContentLoaded', () => {
    fetch('../data/videos.json')
        .then(res => res.json())
        .then(videos => {
            shuffleArray(videos)
            renderVideoCards(videos)
        })
}) 