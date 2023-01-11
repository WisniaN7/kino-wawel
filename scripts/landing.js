// Skip movies without screening or do sth

function cycleMovie(direction = 1) {
    if (!canCycle || !document.hasFocus()) return

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

    interval = setInterval(() => cycleMovie(-1) , 10000)
}

function addEventListeners() {
    const arrows = document.querySelectorAll('span.arrow')
    interval = setInterval(() => cycleMovie(-1), 10000)
    canCycle = true
    
    arrows[0].addEventListener('click', () => cycleMovie(1))
    arrows[1].addEventListener('click', () => cycleMovie(-1))

    cycleMovie(1) // Hack: refresh images
}

const movies = fetch('https://wawel.herokuapp.com/movies')
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovies = async () => {
    const m = await movies

    console.log(m);

    let heroMoviesIndexes = []

    for (let i = m.length - 1; i >= 0 && heroMoviesIndexes.length < 3; i--)
        if (m[i].status != 'ZARCHWWIZOWANY' || true) heroMoviesIndexes.push(i)

    const positions = ['left', 'center', 'right']
    let pos = 0

    heroMoviesIndexes.forEach((i) => {
        const movieDiv = document.createElement('div')
        movieDiv.classList.add('movie')
        movieDiv.classList.add(positions[pos++])

        const titleDiv = document.createElement('div')
        titleDiv.classList.add('title')
        movieDiv.appendChild(titleDiv)

        const title = document.createElement('h2')
        title.innerText = m[i].title
        titleDiv.appendChild(title)

        const buttonsDiv = document.createElement('div')
        titleDiv.appendChild(buttonsDiv)

        if (m[i].status == 'GRANY') {
            const buyTicketBtn = document.createElement('a')
            buyTicketBtn.classList.add('cta-1')
            buyTicketBtn.href = 'film.html?id=' + m[i].id
            buyTicketBtn.innerText = 'Kup bilet'
            buttonsDiv.appendChild(buyTicketBtn)
        }
        
        const trailerBtn = document.createElement('a')
        trailerBtn.classList.add('cta-2')
        trailerBtn.href = m[i].trailerSource
        trailerBtn.innerText = 'Obejrzyj zwiastun'
        buttonsDiv.appendChild(trailerBtn)

        const img = new Image()
        img.src = m[i].bigImageSource || "img/bg/" + m[i].title.replace(/[/\\?%*:|"<>]/g, '').toLowerCase() + ".jpg"
        movieDiv.appendChild(img)

        document.querySelector('main').appendChild(movieDiv)
    })
}

getMovies().then(() => addEventListeners())