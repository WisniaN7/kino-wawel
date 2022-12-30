function cycleMovie(direction = 1) {
    if (!canCycle) return

    canCycle = false
    setTimeout(() => canCycle = true, 1000)
    
    positions = ['left', 'center', 'right']
    carousel = document.querySelectorAll('div.movie')

    carousel.forEach((el) => {
        el.classList.add(positions[(positions.indexOf(el.classList[1]) + positions.length + direction) % carousel.length])
        el.classList.remove(el.classList[1])
        el.style.zIndex = carousel.length + (positions.indexOf(el.classList[1]) * direction)
    })

    clearInterval(interval)
    interval = setInterval(() => cycleMovie(-1), 10000)
}

window.addEventListener('load', function() {
    const arrows = document.querySelectorAll('span.arrow')
    interval = setInterval(() => cycleMovie(-1), 10000)
    canCycle = true
    
    arrows[0].addEventListener('click', () => cycleMovie(1))
    arrows[1].addEventListener('click', () => cycleMovie(-1))
})

setInterval(() => console.log(canCycle), 100)