function addEventListeners() {
    window.addEventListener('load', () => {
        citySelect = document.querySelector('aside select')
        cityToCityValue = { 'KATOWICE': 'Katowice', 'KRAKOW': 'Krakow', 'LUBAN': 'Luban', 'OPOLE': 'Opole', 'WROCLAW': 'Wroclaw' }
        citySelect.value = cityToCityValue[city]

        citySelect.addEventListener('change', () => {
            city = citySelect.value.toUpperCase()
            getScreenings()
        })
    })
}

const urlParts = window.location.href.split('/')
const title = urlParts[urlParts.length - 1]
const date = urlParts[urlParts.length - 2]
let city = urlParts[urlParts.length - 3]
const id = urlParts[urlParts.length - 4]

const getScreenings = async () => {
    const screenings = fetch('/film/screenings/' + id + '/' + city + '/' + date)
        .then(response => {
            if (response.status == 200)
                return response.json()
            else
                createSnackbar('Wystąpił błąd przy pobieraniu danych, odśwież stronę lub skontaktuj się z administratorem serwisu.', 'error', 'long')
        })
        
    const s = await screenings

    if (!s) return
    
    s.sort((a, b) => {
        const hourDiff = a.time.split(':')[0] - b.time.split(':')[0]
        return hourDiff != 0 ? hourDiff : a.time.split(':')[1] - b.time.split(':')[1]
    })
    
    const screeningsHTML = document.querySelector('aside .screenings')
    screeningsHTML.innerHTML = ''

    for (let index = 0; index < s.length; index++) {
        let time = new Date(date + 'T' + s[index].time)

        if (isItTooLate(time, 15))
            continue

        const screening = createElementFromHTML('<a href="zakup.html" class="cta-2 bean"> <p class="hour"></p> <p class="type">2D napisy</p> </a>')

        screening.href = 'zakup/' + title + '/' + s[index].screening_id
        screening.querySelector('p.hour').innerText = s[index].time.slice(0, 5)
        screening.querySelector('p.type').innerText = (s[index].is_3D ? '3D' : '2D') + ' ' + s[index].sound_type.toLowerCase()
        screeningsHTML.appendChild(screening)
    }
}

getScreenings().then(() => { addEventListeners() })