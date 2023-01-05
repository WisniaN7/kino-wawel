// TODO: Updating movie

function addEventListeners() {
    const genereSelect = document.querySelector('#genere-list')
    const currentOption = genereSelect.children[0]
    let generes = []

    genereSelect.addEventListener('change', () => {
        if (genereSelect.value === '') {
            generes = []

        } else if (generes.includes(genereSelect.value)) {
            let index = generes.indexOf(genereSelect.value)

            if (index !== -1)
                generes.splice(index, 1)
        } else {
            if (generes.length === 2) {
                genereSelect.value = currentOption.value
                return
            }

            if (genereSelect.value === 'Nowy...') {
                const newGenere = prompt('Podaj nowy gatunek')

                const option = document.createElement('option')
                option.value = newGenere
                option.innerText = newGenere

                genereSelect.insertBefore(option, genereSelect.children[genereSelect.children.length - 1])
                genereSelect.value = newGenere
            }

            generes.push(genereSelect.value)
        }

        generes.sort()
        currentOption.innerText = generes.join(', ')
        currentOption.value = generes.join(', ')
        genereSelect.value = currentOption.value
    })
}

const id = urlParams.get('id')

const movie = fetch('https://wawel.herokuapp.com/movies/' + id)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovie = async () => {
    movieHTML = createElementFromHTML('<form action=""> <div class="long-input"> <label for="title">Tytuł</label> <input type="text" name="title" id="title" placeholder="Nowy Film" required> </div> <div class="file-input" id="poster-input"> <label for="poster">Plakat</label> <input type="file" id="poster" name="poster"> </div> <div class="long-input"> <label for="genere-list">Gatunek</label> <select id="genere-list" required> <option id="current"></option> <option></option> <option value="Akcja">Akcja</option> <option value="Horror">Horror</option> <option value="Komedia">Komedia</option> <option value="Thriller">Thriller</option> <option value="Romans">Romans</option> <option value="Sensacja">Sensacja</option> <option value="Sci-Fi">Sci-Fi</option> <option>Nowy...</option> </select> </div> <div class="short-input"> <label for="PG">Czas trwania</label> <div class="radio-group"> <div> <input type="radio" id="a7" name="PG" required> <label for="7">7+</label> </div> <div> <input type="radio" id="a13" name="PG" required> <label for="13">13+</label> </div> <div> <input type="radio" id="a16" name="PG" required> <label for="16">16+</label> </div> <div> <input type="radio" id="a18" name="PG" required> <label for="18">18+</label> </div> </div> </div> <div class="short-input"> <label for="duration">Czas trwania</label> <div id="duration-input"> <input type="number" name="duration" id="duration" required min="0"> <span>min.</span> </div> </div> <div class="long-input high-input"> <label for="description">Opis</label> <textarea name="description" id="description" required rows="11"></textarea> </div> <div class="file-input" id="trailer-input"> <label for="poster">Zwiastun</label> <input type="file" id="trailer" name="trailer"> <p>Lub wklej link do YouTube:</p> <input type="text" name="YTlink" id="YTlink"> </div> <div id="submit"> <button type="submit" class="cta-1">Zapisz</button> </div> </form>')
    document.querySelector('main section').appendChild(movieHTML)

    if (!id) return

    const m = await movie
    
    movieHTML.querySelector('#title').value = m.title
    // Generes
    movieHTML.querySelector('#current').value = m.genre
    movieHTML.querySelector('#current').innerText = m.genre
    movieHTML.querySelector('#genere-list').value = m.genre
    
    movieHTML.querySelector('#a' + m.minAge).checked = true
    movieHTML.querySelector('#duration').value = m.duration
    movieHTML.querySelector('#description').value = m.description
}

getMovie().then(() => { addEventListeners() })

