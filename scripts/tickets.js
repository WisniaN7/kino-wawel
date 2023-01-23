const cityToCityLocalized = { 'KATOWICE': 'Katowice', 'KRAKOW': 'Kraków', 'LUBAN': 'Lubań', 'OPOLE': 'Opole', 'WROCLAW': 'Wrocław' }

const tickets = fetch('https://wawel.herokuapp.com/movies/users/' + user.userId)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getTickets = async () => {
    const t = await tickets

    if (t.tickets.length == 0) {
        const h2 = document.createElement('h2')
        h2.innerText = 'Historia biletów jest pusta.'
        document.querySelector('main div.wrapper').appendChild(h2)
    }

    t.tickets.forEach((screening) => {
        console.log(screening);

        const listing = createElementFromHTML('<article class="bottom-gradient-border listing description"> <img src="img/posters/avatar istota wody.jpg" alt=""> <a href="" class="info"> <div> <h2><span class="capital">A</span>vatar: <span class="capital">I</span>stota <span class="capital">W</span>ody </h2> </div> <p class="info">Sci-Fi | Od lat 13 | 193 min</p> <p class="date">Kraków 2023.01.10 13:00</p> </a> <div class="tickets"> <div class="types"> <p>Normalny<br></p> <p>Ulgowy<br></p> <p>Senior<br></p> </div> <a href="files/ticket.txt" class="btn cta-1" download>Pobierz bilety</a> </div> </article><article class="bottom-gradient-border listing description"> <img src="img/posters/avatar istota wody.jpg" alt=""> <a href="" class="info"> <div> <h2><span class="capital">A</span>vatar: <span class="capital">I</span>stota <span class="capital">W</span>ody </h2> </div> <p class="info">Sci-Fi | Od lat 13 | 193 min</p> <p class="date">Kraków 2023.01.10 13:00</p> </a> <div class="tickets"> <div class="types"> <p>Normalny<br>0</p> <p>Ulogwy<br>0</p> <p>Senior<br>0</p> </div> <a href="files/ticket.txt" class="btn cta-1" download>Pobierz bilety</a> </div> </article>')

        const date = new Date(screening.date + 'T' + screening.startTime)
        const cinemaAndDate = listing.querySelector('p.date')
        listing.querySelector('p.date').innerText = cityToCityLocalized[screening.city] + ' ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
        
        if (new Date() > date) {
            cinemaAndDate.classList.add('expired')
            listing.querySelector('a.btn').remove()
        }

        let ticketTypes = { 'NORMALNY': 0, 'ULGOWY': 0, 'SENIOR': 0 }
        screening.tickets.forEach((ticket) => { ticketTypes[ticket.ticketType]++ })

        listing.querySelector('p:nth-child(1) > br').insertAdjacentText('afterend', ticketTypes['NORMALNY'])
        listing.querySelector('p:nth-child(2) > br').insertAdjacentText('afterend', ticketTypes['ULGOWY'])
        listing.querySelector('p:nth-child(3) > br').insertAdjacentText('afterend', ticketTypes['SENIOR'])

        document.querySelector('main div.wrapper').appendChild(listing)
    })
}

getTickets()