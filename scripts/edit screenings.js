function updateSchedule() {
    const repertoire = { 
        city: city, 
        date: date,
    }
    
    let screenings = []
    const checkboxes = document.querySelectorAll('input[name="screening"]:checked')

    checkboxes.forEach((checkbox) => {
        let screening = {
            screenName: 'SALA',
            movieId: '',
            startTime: '',
            movieType: '',
            movieSoundType: ''
        }

        const cell = checkbox.parentElement
        const movie = cell.querySelector('div.screening')

        if (movie.id.indexOf('n') == -1) {
            screening.screeningId = movie.id.slice(movie.id.indexOf('_') + 1)
            screening.movieId = movie.id.slice(1, movie.id.indexOf('_'))
        } else {
            screening.movieId = movie.id.slice(1, movie.id.indexOf('n'))
        }
        
        screening.screenName += cell.getAttribute('data-col')
        
        let time = cell.parentElement.querySelector('td:first-child').innerText

        if (time.split(':')[0].length == 1)
            time = '0' + time

        time = time + ':00'

        screening.startTime = time
        screening.movieType = movie.classList.contains('D3') ? 'D3' : 'D2'
        screening.movieSoundType = movie.classList.contains('subtitled') ? 'NAPISY' : movie.classList.contains('dubbed') ? 'DUBBING' : 'LEKTOR'

        screenings.push(screening)
    })

    repertoire.screenings = screenings

    changesSaved = false
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://wawel.herokuapp.com/movies/repertoire/edit', true)
    xhr.setRequestHeader("content-type", "application/json")
    
    xhr.onreadystatechange = () => {
        if (xhr.readyState != xhr.DONE) return

        if (xhr.status == 200) {
            changesSaved = true
        } else {
            createSnackbar('Wystąpił błąd podczas aktualizowania danych', 'error', 'long')
            console.error(xhr.responseText)
        }
    }

    xhr.send(JSON.stringify(repertoire))
}

function createTimetable(tbody) {
    tbody.innerHTML = ''

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

                td.appendChild(checkbox)
                tr.appendChild(td)
            }
        }

        tbody.appendChild(tr)
    }

    const timetableCells = tbody.querySelectorAll('td:not(:first-child)')
    table.style = "--cell-width: " + timetableCells[0].offsetWidth + "px;"

    timetableCells.forEach((cell) => {
        cell.addEventListener('drop', (e) => {
            e.preventDefault()
            const data = e.dataTransfer.getData('text/plain')

            if (e.dataTransfer.getData('bool') === 'true') {
                newNode = document.getElementById(data).cloneNode(true)
                newNode.id += 'n_' + movieSchedules[data]
                const movieDiv = newNode.querySelector('div.movie')
                movieDiv.innerText = movieDiv.getAttribute('data-title')
                movieSchedules[data]++
            } else
                newNode = document.querySelector('table #' + data)

            const cellsOccupied = Math.ceil(newNode.getAttribute('data-duration') / 30)
            const col = parseInt(cell.getAttribute('data-col'))
            const row = parseInt(cell.getAttribute('data-row'))
            
            for (let i = 0; i < cellsOccupied - 1; i++) {
                const cell = document.querySelector('table tr:nth-of-type(' + parseInt(row + i) + ') td:nth-of-type(' + parseInt(col + 1) + ')')
                
                if (cell.querySelector('input').checked) {
                    const collision = cell.querySelector('div.screening')
                    collision.classList.remove('collide')
                    collision.classList.add('collide')
                    setTimeout(() => collision.classList.remove('collide'), 3000)

                    createSnackbar('Dodanie seansu niemożliwe. Film kolidowałby z innym.', 'error', 'short')
                    movieSchedules[data]--
                    return
                }
            }

            newNode.addEventListener('dragstart', (e) => {
                newNode.parentElement.querySelector('input').checked = false
                e.dataTransfer.setData('text/plain', e.target.id)
                e.dataTransfer.setData('bool', false)
            })
            
            e.target.appendChild(newNode)
            e.target.querySelector('input[type="checkbox"]').checked = true

            updateSchedule()
        })

        cell.addEventListener('dragover', (e) => { e.preventDefault() })
    })
}

function timeToRow(time) {
    const hours = time.split(':')[0]
    const minutes = time.split(':')[1]
    return 2 * (hours - 10) + (minutes / 30)
}

function addEventListeners() {
    const moviesElements = document.querySelectorAll('#timetable aside div.screening')
    const movieScreenings = document.querySelectorAll('aside div.screening')
    movieSchedules = {}

    movieScreenings.forEach((movie) => {
        movieSchedules[movie.id] = 0
    })

    moviesElements.forEach((movie) => {
        movie.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id)
            e.dataTransfer.setData('bool', true)
        })
    })

    const aside = document.querySelector('#timetable aside')
    let counter = 0

    aside.addEventListener('dragenter', (e) => { 
        e.preventDefault()
        counter++
        aside.classList.add('dragging')
    })

    aside.addEventListener('dragover', (e) => { e.preventDefault() })

    aside.addEventListener('dragleave', (e) => { 
        e.preventDefault()
        counter--

        if (counter == 0)
            aside.classList.remove('dragging')
    })
    
    aside.addEventListener('drop', (e) => { 
        e.preventDefault()
        const data = e.dataTransfer.getData('text/plain')

        const cell = document.querySelector('table #' + data)

        if (cell.id.indexOf('n') == -1) {
            changesSaved = false

            const xhr = new XMLHttpRequest()
            const id = cell.id.slice(cell.id.indexOf('_') + 1)

            xhr.open('DELETE', 'https://wawel.herokuapp.com/movies/screening/' + id, true)
            xhr.setRequestHeader("content-type", "application/json")

            xhr.onreadystatechange = () => {
                if (xhr.readyState != xhr.DONE) return
                
                if (xhr.status == 200) {
                    changesSaved = true
                } else {
                    createSnackbar('Wystąpił błąd podczas aktualizowania danych', 'error', 'long')
                    console.error(xhr.responseText)
                }
            }

            xhr.send()
        }

        cell.parentElement.querySelector('input[type="checkbox"]').checked = false
        cell.remove()

        aside.classList.remove('dragging')
    })

    const switch3D = aside.querySelector('input[type="checkbox"]')

    switch3D.addEventListener('change', () => {
        moviesElements.forEach((movie) => {
            if (switch3D.checked)
                movie.classList.add('D3')
            else
                movie.classList.remove('D3')
        })
    })
    

    const soundSelect = aside.querySelector('select')

    soundSelect.addEventListener('change', () => {
        moviesElements.forEach((movie) => {
            ['subtitled', 'dubbed', 'lector'].forEach((sound) => { movie.classList.remove(sound) })
            movie.classList.add(soundSelect.value)
        })
    })
    
    const timetableCell = tbody.querySelector('td:not(:first-child)')

    window.addEventListener('resize', () => {
        table.style = "--cell-width: " + timetableCell.offsetWidth + "px;"
    })

    const dateSelect = document.querySelector('#day-select input')
    const dateLabel = document.querySelector('#day-select div span')
    const dateArrows = document.querySelectorAll('#day-select span.arrow')

    dateSelect.value = date
    dateLabel.innerText = new Date().toLocaleDateString('pl-PL', { weekday: 'long', month: 'numeric', day: 'numeric' })

    dateArrows.forEach((arrow) => {
        arrow.addEventListener('click', () => {
            date = new Date(dateSelect.value)
            date.setDate(date.getDate() + (arrow.classList.contains('left') ? -1 : 1))
            dateLabel.innerText = date.toLocaleDateString('pl-PL', { weekday: 'long', month: 'numeric', day: 'numeric' })
            date = date.toISOString().split('T')[0]
            dateSelect.value = date
            createTimetable(tbody)
            getRepertoire(city, date)
        })
    })

    dateSelect.addEventListener('change', () => {
        date = new Date(dateSelect.value)
        dateLabel.innerText = date.toLocaleDateString('pl-PL', { weekday: 'long', month: 'numeric', day: 'numeric' })
        date = date.toISOString().split('T')[0]
        createTimetable(tbody)
        getRepertoire(city, date)
    })

    const cityToSelector = { 'KATOWICE': 1, 'KRAKOW': 2, 'LUBAN': 3, 'OPOLE': 4, 'WROCLAW': 5 }
    document.querySelector('#screenings li:nth-child(' + cityToSelector[city] + ')').classList.add('active')
}

const movies = fetch('https://wawel.herokuapp.com/movies')
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovies = async () => {
    const m = await movies
    
    m.forEach((movieData) => {
        if (movieData.status === 'ZARCHIWIZOWANY')
            return

        const movie = document.createElement('div')
        movie.draggable = true
        movie.classList.add('screening', 'subtitled')
        movie.style = "--duration: " + movieData.duration + ";"
        movie.setAttribute('data-duration', movieData.duration)
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
        screening.setAttribute('data-title', movieData.title)
        screening.classList.add('movie')
        movie.appendChild(screening)

        const cleanup = document.createElement('div')
        cleanup.innerText = 'Sprzątanie'
        cleanup.classList.add('cleanup')
        movie.appendChild(cleanup)

        document.querySelector('#timetable aside').appendChild(movie)
    })
}

const getRepertoire = async (city, date) => {
    const repertoire = fetch('https://wawel.herokuapp.com/movies/repertoire?city=' + city + '&date=' + date)
        .then((response) => response.json())
        .then((data) => {
            return data
        })

    const r = await repertoire

    r.items.forEach((screeningData) => {
        screeningData.screenings.forEach((screening) => {
            const movie = document.createElement('div')
            movie.draggable = true
            movie.classList.add('screening')
            movie.style = "--duration: " + screeningData.movie.duration + ";"
            movie.setAttribute('data-duration', screeningData.movie.duration)
            movie.id = 'm' + screeningData.movie.id + '_' + screening.screeningId

            movie.addEventListener('dragstart', (e) => {
                movie.parentElement.querySelector('input').checked = false
                e.dataTransfer.setData('text/plain', e.target.id)
                e.dataTransfer.setData('bool', false)
            })

            if (screening.movieType == 'D3')
                movie.classList.add('D3')

            switch (screening.movieSoundType) {
                case "DUBBING":
                    movie.classList.add('dubbed')
                    break;
            
                case "LEKTOR":
                    movie.classList.add('lector')
                    break;
            
                default:
                    movie.classList.add('subtitled')
                    break;
            }

            const title = document.createElement('p')
            title.innerText = screeningData.movie.title
            movie.appendChild(title)
            
            const duration = document.createElement('span')
            duration.innerText = screeningData.movie.duration + ' min'
            title.appendChild(duration)

            const ads = document.createElement('div')
            ads.innerText = 'Reklamy'
            ads.classList.add('ads')
            movie.appendChild(ads)

            const screeningElement = document.createElement('div')
            screeningElement.innerText = screeningData.movie.title
            screeningElement.classList.add('movie')

            movie.appendChild(screeningElement)

            const cleanup = document.createElement('div')
            cleanup.innerText = 'Sprzątanie'
            cleanup.classList.add('cleanup')
            movie.appendChild(cleanup)

            const screenName = screening.screenName

            if (screenName) {
                const cell = document.querySelector('#timetable table tr:nth-child(' + (timeToRow(screening.startTime) + 1) + ') td:nth-child(' + (parseInt(screenName.slice(4)) + 1) + ')')
                cell.appendChild(movie)
                cell.querySelector('input').checked = true
            }
        })
    })
}

let changesSaved = true
let date = new Date().toISOString().slice(0, 10)
const table = document.querySelector('#timetable table')
const tbody = table.querySelector('tbody')
let movieSchedules

const city = urlParams.get('city')
getMovies().then(() => createTimetable(tbody) ).then(() => getRepertoire(city, date) ).then(() => addEventListeners() )

window.addEventListener("beforeunload", (e) => {
    if (!changesSaved) {
        e.preventDefault()
        e.returnValue = ""
    }
})