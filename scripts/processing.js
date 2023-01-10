const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);

window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) return name == 'user' ? JSON.parse(match[2]) : match[2]
}

const screeningId = urlParams.get('screeningId')
const seats = urlParams.getAll('seats')
let normal = Number(urlParams.get('normal'))
let half = Number(urlParams.get('half'))
let senior = Number(urlParams.get('senior'))

if (normal + half + senior != seats.length)
    history.back()

    
let data = { screeningId: screeningId }

if (user = getCookie('user'))
    data.userId = user.userId

data.tickets = []

seats.forEach((seat) => {
    const s = seat.split('|')
    let ticketType = ''

    if (normal > 0) {
        ticketType = 'NORMALNY'
        normal--
    } else if (half > 0) {
        ticketType = 'ULGOWY'
        half--
    } else {
        ticketType = 'SENIOR'
        senior--
    }

    data.tickets.push({ ticketType: ticketType, seatRow: s[0], seatNumber: s[1] })
})

const xhr = new XMLHttpRequest()
xhr.open('POST', 'https://wawel.herokuapp.com/movies/tickets/buy', true)
xhr.setRequestHeader("content-type", "application/json")

xhr.onreadystatechange = () => {
    if (xhr.readyState != xhr.DONE) return

    if (xhr.responseText.startsWith('Pomyślnie'))
        window.location.href = 'sukces.html'
    else if (xhr.responseText.startsWith('Miejsce'))
        window.location.href = 'zakup.html?screeningId=' + screeningId + '&status=1&normal=' + normal + '&half=' + half + '&senior=' + senior + '&seats=' + seats.join('&seats=')
    else if (xhr.responseText.startsWith('Seans'))
        window.location.href = 'repertuar.html?' + 'status=2'
    else
        window.location.href = 'index.html?' + 'status=0' + '&message=' + xhr.responseText
}

xhr.send(JSON.stringify(data))
