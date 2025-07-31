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