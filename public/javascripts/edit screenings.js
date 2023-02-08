// TODO: Remove error when screening is moved in the same place

const urlParts = window.location.href.split('/')
const city = urlParts[urlParts.length - 1]
const cityId = urlParts[urlParts.length - 2]
let date = new Date().toISOString().slice(0, 10)
let D3 = false
let soundType = 'Napisy'

const addScreening = async (movieId, cinemaId, hall, time) => fetch('/administracja/screenings/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movie_id: movieId, cinema_id: cinemaId, hall: hall, time: time, date: date, is_3D: D3, sound_type: soundType })
    })
    .then((res) => {
        if (res.status == 200) {
            changesSaved = true
            return res.json()
        } else {
            createSnackbar('Wystąpił błąd podczas dodawania seansu', 'error', 'long')
        }
    }).then((data) => data.screening_id)

const editScreening = (screeningId, hall, time) => fetch('/administracja/screenings/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ screening_id: screeningId, hall: hall, time: time })
    })
    .then((res) => {
        if (res.status == 200)
            changesSaved = true
        else
            createSnackbar('Wystąpił błąd podczas aktualizowania danych', 'error', 'long')
    })

const deleteScreening = (screeningId) => fetch('/administracja/screenings/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: screeningId })
    })
    .then((res) => {
        if (res.status == 200)
            changesSaved = true
        else
            createSnackbar('Wystąpił błąd podczas aktualizowania danych', 'error', 'long')
    })

function createTimetable(tbody) {
    tbody.innerHTML = ''

    const columns = document.querySelectorAll('thead th')

    for (let i = 18; i < 48; i++) {
        let time = i % 2 == 0 ? i / 2 + ':00' : (i + 1) / 2 - 1 + ':30'
        const tr = document.createElement('tr')

        for (let j = 0; j < columns.length; j++) {
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
    table.style.setProperty('--cell-width', timetableCells[0].offsetWidth + 'px')

    timetableCells.forEach((cell) => {
        cell.addEventListener('drop', async (e) => {
            e.preventDefault()
            const data = e.dataTransfer.getData('id')
            const movie = document.querySelector('#' + data)

            const cellsOccupied = Math.ceil(movie.getAttribute('data-duration') / 30)
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
                    return
                }
            }

            const newNode = movie.cloneNode(true)

            if (movie.id.includes('_')) {
                const screeningId = movie.id.split('_')[1]
                await editScreening(screeningId, col, cell.parentElement.querySelector('td:first-child').innerText)
                movie.remove()  
            } else {
                const id = await addScreening(movie.id.slice(1), cityId, col, cell.parentElement.querySelector('td:first-child').innerText)
                newNode.id +='_' + id
                const movieSection = newNode.querySelector('div.movie')
                movieSection.innerText = movieSection.getAttribute('data-title')
            }
            
            newNode.addEventListener('dragstart', (e) => {
                newNode.parentElement.querySelector('input').checked = false
                e.dataTransfer.setData('id', e.target.id)
            })
            
            e.target.appendChild(newNode)
            e.target.querySelector('input[type="checkbox"]').checked = true

            document.querySelector('aside').classList.remove('dragging')
        })

        cell.addEventListener('dragover', (e) => { e.preventDefault() })
    })
}

function timeToRow(time) {
    const hours = time.split(':')[0]
    const minutes = time.split(':')[1]
    return 2 * (hours - 9) + (minutes / 30)
}

function addEventListeners() {
    const aside = document.querySelector('#timetable aside')
    const moviesElements = aside.querySelectorAll('div.screening')

    moviesElements.forEach((movie) => {
        movie.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('id', e.target.id)
        })
    })

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
        aside.classList.remove('dragging')

        const data = e.dataTransfer.getData('id')
        const cell = document.querySelector('table #' + data)

        if (!cell) // HACK: for elements from aside to aside, there might be a better solution
            return

        if (cell.id.indexOf('_') != -1) {
            changesSaved = false
            const id = cell.id.slice(cell.id.indexOf('_') + 1)
            deleteScreening(id)
        }

        cell.parentElement.querySelector('input[type="checkbox"]').checked = false
        cell.remove()
    })

    const switch3D = aside.querySelector('input[type="checkbox"]')

    switch3D.addEventListener('change', () => {
        D3 = switch3D.checked

        moviesElements.forEach((movie) => {
            if (switch3D.checked)
                movie.classList.add('D3')
            else
                movie.classList.remove('D3')
        })
    })
    
    const soundSelect = aside.querySelector('select')

    soundSelect.addEventListener('change', () => {
        soundType = { 'subtitled': 'Napisy', 'dubbed': 'Dubbing', 'lector': 'Lektor' }[soundSelect.value]

        moviesElements.forEach((movie) => {
            ['subtitled', 'dubbed', 'lector'].forEach((sound) => { movie.classList.remove(sound) })
            movie.classList.add(soundSelect.value)
        })
    })
    
    const timetableCell = tbody.querySelector('td:not(:first-child)')

    window.addEventListener('resize', () => {
        table.style.setProperty('--cell-width', timetableCell.offsetWidth + 'px')
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

    const cityMenu = document.querySelector('#screenings')
    cityMenu.style.transition = 'none'
    cityMenu.classList.add('active')
    setTimeout(() => { cityMenu.style.removeProperty('transition') }, 0)
    cityMenu.querySelector('li#c' + cityId ).classList.add('active')
}

const getRepertoire = async (city, date) => {
    const repertoire = fetch('/administracja/screenings/get/' + cityId + '/' + date)
        .then((response) => response.json())
        .then((data) => {
            return data
        })

    const screenings = await repertoire


    screenings.forEach((screening) => {
        const movie = document.createElement('div')
        movie.draggable = true
        movie.classList.add('screening')
        movie.style = "--duration: " + screening.duration + ";"
        movie.setAttribute('data-duration', screening.duration)
        movie.id = 'm' + screening.movie_id + '_' + screening.screening_id

        movie.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('id', e.target.id)
        })

        if (screening.is_3D)
            movie.classList.add('D3')

        switch (screening.sound_type) {
            case 'Dubbing':
                movie.classList.add('dubbed')
                break;
        
            case 'Lektor':
                movie.classList.add('lector')
                break;
        
            default:
                movie.classList.add('subtitled')
                break;
        }

        const title = document.createElement('p')
        title.innerText = screening.title
        movie.appendChild(title)
        
        const duration = document.createElement('span')
        duration.innerText = screening.duration + ' min'
        title.appendChild(duration)

        const ads = document.createElement('div')
        ads.innerText = 'Reklamy'
        ads.classList.add('ads')
        movie.appendChild(ads)

        const screeningElement = document.createElement('div')
        screeningElement.innerText = screening.title
        screeningElement.classList.add('movie')

        movie.appendChild(screeningElement)

        const cleanup = document.createElement('div')
        cleanup.innerText = 'Sprzątanie'
        cleanup.classList.add('cleanup')
        movie.appendChild(cleanup)

        const cell = document.querySelector('#timetable table tr:nth-child(' + (timeToRow(screening.time) + 1) + ') td:nth-child(' + (parseInt(screening.hall) + 1) + ')')
        cell.appendChild(movie)
        cell.querySelector('input').checked = true
    })
}

let changesSaved = true
const table = document.querySelector('#timetable table')
const tbody = table.querySelector('tbody')

createTimetable(tbody)
getRepertoire(city, date).then(() => addEventListeners() )

window.addEventListener("beforeunload", (e) => {
    if (!changesSaved) {
        e.preventDefault()
        e.returnValue = ""
    }
})