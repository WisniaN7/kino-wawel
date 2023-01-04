const screeningId = urlParams.get('screeningId')
const seats = urlParams.getAll('seats')
let normal = Number(urlParams.get('normal'))
let half = Number(urlParams.get('half'))
let senior = Number(urlParams.get('senior'))

if (normal + half + senior != seats.length)
    history.back()

let data = { screeningId: screeningId }
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
    if (xhr.responseText == 'Pomyślnie zakupiono biliety!')
        window.location.href = 'sukces.html'
    else if (xhr.responseText.startsWith('Miejsce'))
        window.location.href = 'zakup.html?screeningId=' + screeningId + '&error=1&normal=' + normal + '&half=' + half + '&senior=' + senior + '&seats=' + seats.join('&seats=')
    else 
        window.location.href = 'repertuar.html?' + 'error=2' + '&message=' + xhr.responseText
}

xhr.send(JSON.stringify(data))
