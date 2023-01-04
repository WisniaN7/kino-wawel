function createTimetable(tbody) {
    for (let i = 20; i < 48; i++) {
        let time = i % 2 == 0 ? i / 2 + ':00' : (i + 1) / 2 - 1 + ':30'
        const tr = document.createElement('tr')

        for (let j = 0; j < 5; j++) {
            if (j == 0) {
                const td = document.createElement('td')
                td.innerText = time
                tr.appendChild(td)
            } else {
                const td = document.createElement('td')
                td.setAttribute('data-row', i - 19)
                td.setAttribute('data-col', j)

                const checkbox = document.createElement('input')
                checkbox.type = 'checkbox'
                checkbox.name = 'screening'
                checkbox.value = '{ time: ' + time + ', hall: ' + j + ' }'

                const input = document.createElement('input')
                input.type = 'number'
                input.name = '{ time: ' + time + ', hall: ' + j + ' }'

                td.appendChild(checkbox)
                td.appendChild(input)
                tr.appendChild(td)
            }
        }

        tbody.appendChild(tr)
    }
}

function addEventListeners() {
    const table = document.querySelector('#timetable table')
    const tbody = table.querySelector('tbody')
    createTimetable(tbody)

    const moviesElements = document.querySelectorAll('#timetable aside div.screening')
    const timetableCells = document.querySelectorAll('#timetable tbody td:not(:first-child)')
    const movieScreenings = document.querySelectorAll('aside div.screening')
    let movieSchedules = {}

    movieScreenings.forEach((movie) => {
        movieSchedules[movie.id] = 0
    })

    table.style = "--cell-width: " + timetableCells[0].offsetWidth + "px;"

    moviesElements.forEach((movie) => {
        movie.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id)
            e.dataTransfer.setData('bool', true)
        })
    })

    timetableCells.forEach((cell) => {
        cell.addEventListener('drop', (e) => {
            e.preventDefault()

            const data = e.dataTransfer.getData('text/plain')
            let newNode

            if (e.dataTransfer.getData('bool') === 'true') {
                newNode = document.getElementById(data).cloneNode(true)
                newNode.id += '_' + movieSchedules[data]
                movieSchedules[data]++
            } else
                newNode = document.querySelector('table #' + data)

            newNode.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.id)
                e.dataTransfer.setData('bool', false)
            })

            e.target.appendChild(newNode)
            e.target.querySelector('input[type="checkbox"]').checked = true

            if (data.indexOf('_') != -1)
                e.target.querySelector('input[type="number"]').value = data.slice(1, data.indexOf('_'))
            else
                e.target.querySelector('input[type="number"]').value = data.slice(1)
        })

        cell.addEventListener('dragover', (e) => { e.preventDefault() })
    })

    window.addEventListener('resize', () => {
        table.style = "--cell-width: " + timetableCells[0].offsetWidth + "px;"
    })
}

const movies = fetch('https://wawel.herokuapp.com/movies')
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovies = async () => {
    const m = await movies
    
    m.forEach((movieData) => {
        const movie = document.createElement('div')
        movie.draggable = true
        movie.classList.add('screening')
        movie.style = "--duration: " + movieData.duration + ";"
        movie.id = 'm' + movieData.id

        const title = document.createElement('p')
        title.innerText = movieData.title
        movie.appendChild(title)
        
        const duration = document.createElement('span')
        duration.innerText = movieData.duration + ' min'
        title.appendChild(duration)

        const ads = document.createElement('div')
        ads.innerText = 'Reklamy'
        ads.classList.add('ads')
        movie.appendChild(ads)

        const screening = document.createElement('div')
        screening.innerText = 'Film'
        screening.classList.add('movie')
        movie.appendChild(screening)

        const cleanup = document.createElement('div')
        cleanup.innerText = 'Sprzątanie'
        cleanup.classList.add('cleanup')
        movie.appendChild(cleanup)

        document.querySelector('#timetable aside').appendChild(movie)
    })
}

getMovies().then(() => { addEventListeners() })
