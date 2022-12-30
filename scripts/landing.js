function cycleMovie(direction = 1) {
    if (!canCycle) return

    canCycle = false
    positions = ['left', 'center', 'right']
    carousel = document.querySelectorAll('div.movie')

    carousel.forEach((el) => {
        el.classList.add(positions[(positions.indexOf(el.classList[1]) + positions.length + direction) % carousel.length])
        el.classList.remove(el.classList[1])
        el.style.zIndex = carousel.length + (positions.indexOf(el.classList[1]) * direction)
    })

    clearInterval(interval)
    interval = setInterval(() => cycleMovie(-1), 10000)
    setInterval(() => canCycle = true, 1000)
}

window.addEventListener('load', function() {
    arrows = document.querySelectorAll('span.arrow')
    interval = setInterval(() => cycleMovie(-1), 10000)
    canCycle = true
    
    arrows[0].addEventListener('click', () => cycleMovie(1))
    arrows[1].addEventListener('click', () => cycleMovie(-1))
})