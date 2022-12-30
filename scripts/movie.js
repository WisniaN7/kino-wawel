const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

const movie = fetch('https://wawel.herokuapp.com/movies/' + id)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovie = async () => {
    const m = await movie

    movieHTML = createElementFromHTML('<section id="movie"> <div> <video src=""></video> </div> <aside> <div class="title"> <h2></h2> <div class="rating"> <p>4.32</p> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35" /> </svg> </div> </div> <p class="info">Komedia | Od lat 13 | 125 min</p> <p class="description"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, repellendus modi dolor sequi magni saepe? Facere ipsum exercitationem blanditiis eaque consectetur! Architecto voluptatum repellendus facilis quidem fugit reiciendis maxime reprehenderit. </p> <select name="city"> <option value="Katowice">Katowice</option> <option value="Krakow" selected>Kraków</option> <option value="Lban">Lubań</option> <option value="Opole">Opole</option> <option value="Wroclaw">Wrocław</option> </select> <h3>Seanse na 26 grdnia:</h3> <div class="screenings"> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> </div> </aside> </section>')

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

    movieHTML.querySelector('div.rating p').innerText = m.rating || 4.32

    movieHTML.querySelector('p.info').innerText = m.genre || 'Dramat'
    movieHTML.querySelector('p.info').innerText += ' | Od lat ' + (m.minAge || 13)
    movieHTML.querySelector('p.info').innerText += ' | ' + (m.duration || 120) + ' min'

    movieHTML.querySelector('p.description').innerText = m.description

    document.querySelector('main').appendChild(movieHTML)
}

getMovie()