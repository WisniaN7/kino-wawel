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

function addEventListeners() {
    const arrows = document.querySelectorAll('span.arrow')
    interval = setInterval(() => cycleMovie(-1), 10000)
    canCycle = true
    
    arrows[0].addEventListener('click', () => cycleMovie(1))
    arrows[1].addEventListener('click', () => cycleMovie(-1))
}

const movies = fetch('https://wawel.herokuapp.com/movies')
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovies = async () => {
    const m = await movies

    const positions = ['left', 'center', 'right']

    for (let i = 0; i < 3; i++) {
        const movieDiv = document.createElement('div')
        movieDiv.classList.add('movie')
        movieDiv.classList.add(positions[i])

        const titleDiv = document.createElement('div')
        titleDiv.classList.add('title')
        movieDiv.appendChild(titleDiv)

        const title =   document.createElement('h2')
        title.innerText = m[i].title
        titleDiv.appendChild(title)

        const buttonsDiv = document.createElement('div')
        titleDiv.appendChild(buttonsDiv)

        const buyTicketBtn = document.createElement('a')
        buyTicketBtn.href = 'film.html?id=' + m[i].id
        buyTicketBtn.innerText = 'Kup bilet'
        buttonsDiv.appendChild(buyTicketBtn)
        
        const trailerBtn = document.createElement('a')
        trailerBtn.href = m[i].trailerSource
        trailerBtn.innerText = 'Obejrzyj zwiastun'
        buttonsDiv.appendChild(trailerBtn)

        const img = new Image()
        img.src = m[i].bigImageSource || "img/bg/" + m[i].title.replace(/[/\\?%*:|"<>]/g, '').toLowerCase() + ".jpg"
        movieDiv.appendChild(img)

        document.querySelector('main').appendChild(movieDiv)
    }
}

getMovies().then(() => addEventListeners())