// Skip movies without screening or do sth

function cycleMovie(direction = 1) {
    if (!canCycle || !document.hasFocus()) return

    canCycle = false
    setTimeout(() => canCycle = true, 1000)
    
    const positions = ['left', 'center', 'right']
    const carousel = document.querySelectorAll('div.movie')

    carousel.forEach((el) => {
        el.classList.add(positions[(positions.indexOf(el.classList[1]) + positions.length + direction) % carousel.length])
        el.classList.remove(el.classList[1])
        el.style.zIndex = carousel.length + (positions.indexOf(el.classList[1]) * direction)
    })

    clearInterval(interval)

    interval = setInterval(() => cycleMovie(-1) , 10000)
}

window.addEventListener('load', () => {
    const positions = ['left', 'center', 'right']
    const heroMovies = document.querySelectorAll('.movie')

    for (let i = 0; i < positions.length; i++)
        heroMovies[i].classList.add(positions[i])
    
    const arrows = document.querySelectorAll('span.arrow')
    interval = setInterval(() => cycleMovie(-1), 10000)
    canCycle = true
    
    arrows[0].addEventListener('click', () => cycleMovie(1))
    arrows[1].addEventListener('click', () => cycleMovie(-1))

    cycleMovie(1) // Hack: refresh images
})