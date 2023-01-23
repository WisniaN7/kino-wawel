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

    document.querySelector('div.lds-ring').remove()
}

const id = urlParams.get('id')
let city = urlParams.get('city') || 'KRAKOW'
const date = urlParams.get('date') || new Date().toISOString().slice(0, 10)

const movie = fetch('https://wawel.herokuapp.com/movies/' + id)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovie = async () => {
    const m = await movie

    movieHTML = createElementFromHTML('<section id="movie"> <div> <video src=""></video> </div> <aside> <div class="title"> <h2></h2> <div class="rating"> <p>4.32</p> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35" /> </svg> </div> </div> <p class="info">Komedia | Od lat 13 | 125 min</p> <p class="description"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, repellendus modi dolor sequi magni saepe? Facere ipsum exercitationem blanditiis eaque consectetur! Architecto voluptatum repellendus facilis quidem fugit reiciendis maxime reprehenderit. </p> <select name="city"> <option value="Katowice">Katowice</option> <option value="Krakow" selected>Kraków</option> <option value="Luban">Lubań</option> <option value="Opole">Opole</option> <option value="Wroclaw">Wrocław</option> </select> <h3>Seanse na <span></span></h3> <div class="screenings"></div> </aside> </section>')

    movieHTML.querySelector('div').style = "--bg-image: url('../img/bg/" + m.title.replace(/[/\\?%*:|"<>]/g, '').toLowerCase() + ".jpg');"

    const h2 = movieHTML.querySelector('h2')
    const titleSplit = m.title.split(' ')

    titleSplit.forEach((word) => {
        let span = document.createElement('span')
        span.innerText = word[0].toUpperCase()
        span.classList.add('capital')

        h2.appendChild(span)
        h2.innerHTML += word.slice(1) + ' '
    })

    movieHTML.querySelector('div.rating p').innerText = m.averageRating

    movieHTML.querySelector('p.info').innerText = m.genre 
    movieHTML.querySelector('p.info').innerText += ' | Od lat ' + m.minAge
    movieHTML.querySelector('p.info').innerText += ' | ' + m.duration + ' min'

    movieHTML.querySelector('p.description').innerText = m.description

    document.querySelector('main').appendChild(movieHTML)
}

const getScreenings = async () => {
    const screenings = fetch('https://wawel.herokuapp.com/movies/repertoire?city=' + city + '&date=' + date)
        .then((response) => response.json())
        .then((data) => {
            data = data.items
    
            for (let index = 0; index < data.length; index++)
                if (data[index].movie.id == id)
                    return data[index].screenings
        })
        
    const s = await screenings

    const screeningsHTML = document.querySelector('aside .screenings')
    screeningsHTML.innerHTML = ''

    if (!s) return

    s.sort((a, b) => a.startTime.split(':')[0] - b.startTime.split(':')[0])

    let temp = new Date(date)
    temp.setMonth(date.split('-')[1] - 1)
    document.querySelector('h3 span').innerText = ' ' + date.split('-')[2] + ' ' + temp.toLocaleString('pl-PL', { month: 'long' }) + ':'

    for (let index = 0; index < s.length; index++) {
        let time = new Date(date + 'T' + s[index].startTime)

        if (isItTooLate(time, 15))
            continue

        const screening = createElementFromHTML('<a href="zakup.html" class="cta-2 bean"> <p class="hour"></p> <p class="type">2D napisy</p> </a>')

        screening.href = 'zakup.html?screeningId=' + s[index].screeningId
        screening.querySelector('p.hour').innerText = s[index].startTime.slice(0, 5)
        screening.querySelector('p.type').innerText = s[index].movieType.split('').reverse().join('') + ' ' + s[index].movieSoundType.toLowerCase()
        screeningsHTML.appendChild(screening)
    }
}

const reviews = fetch('https://wawel.herokuapp.com/movies/reviews/' + id)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getReviews = async () => {
    const section = document.createElement('section')
    section.id = 'reviews'

    const h2 = createElementFromHTML('<h2><span class="capital">R</span>ecenzje użytkowników</h2>')
    section.appendChild(h2)

    document.querySelector('main').appendChild(section)

    const r = await reviews

    r.forEach((review) => {
        const reviewHTML = createElementFromHTML('<article> <div class="bottom-gradient-border"> <div class="user"><div class="icon-user"><span class="head"></span><span class="body"></span></div></div> <p class="username">Username</p> <div class="rating"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35" /> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35" /> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35" /> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35" /> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35" /> </svg> </div> </div> <p class="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quia dolores vel tenetur a ipsam quas earum minus ea! Odio cumque voluptas dolorum voluptatem delectus deleniti iure cupiditate ad explicabo?</p> </article>')

        reviewHTML.querySelector('p.username').innerText = review.username        
        const stars = reviewHTML.querySelectorAll('div.rating svg')
        
        for (let i = 0; i < review.rating; i++)
            stars[i].classList.add('full')

        reviewHTML.querySelector('p.description').innerText = review.reviewText
        section.appendChild(reviewHTML)
    })
}

getMovie().then(() => { getScreenings() }).then(() => { getReviews() }).then(() => { addEventListeners() })