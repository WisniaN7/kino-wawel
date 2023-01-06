function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    })
}

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

    const fileInputs = document.querySelectorAll('.file-input .drag-area')

    console.log(fileInputs);

    fileInputs.forEach((input) => {
        const fileInput = input.querySelector('input')

        input.addEventListener('click', () => {
            fileInput.click()
        })

        
        input.addEventListener('change', async () => {
            const img = new Image()
            let imgSrc = ''
            await readFileAsync(fileInput.files[0]).then((result) => { imgSrc = result })
            img.src = imgSrc
            input.appendChild(img)

            input.querySelector('div.icon').remove()
            input.classList.add('filled')
        })

        let counter = 0

        input.addEventListener('dragenter', (e) => {
            e.preventDefault()
            counter++
            input.classList.add('active')
        })

        input.addEventListener('dragover', (e) => { e.preventDefault() })

        input.addEventListener('dragleave', (e) => {
            e.preventDefault()
            counter--
            
            if (counter === 0)
                input.classList.remove('active')
        })

        input.addEventListener('drop', async (e) => {
            e.preventDefault()
            const files = e.dataTransfer.files
            input.querySelector('input').files = files

            const img = new Image()
            let imgSrc = ''
            await readFileAsync(files[0]).then((result) => { imgSrc = result })
            img.src = imgSrc
            input.appendChild(img)

            input.querySelector('div.icon').remove()
            input.classList.add('filled')
        })
    })

    const submit = document.querySelector('button[type="submit"]')

    submit.addEventListener('click', async (e) => {
        const inputs = document.querySelectorAll('input:not(:checked), textarea, select')

        for (let i = 0; i < inputs.length; i++)
            if (inputs[i].value === '')
                return

        if (!document.querySelector('input:checked'))
            return

        e.preventDefault()

        const loader = createElementFromHTML('<div id="loader"> <div class="lds-ring"> <div></div> <div></div> <div></div> <div></div> </div> </div>')
        document.body.appendChild(loader)

        const poster = document.querySelector('#poster')
        const bgImage = document.querySelector('#bgImage')
        let posterLink = ''
        let bgImageLink = ''

        await readFileAsync(poster.files[0]).then((result) => { posterLink = result })
        await readFileAsync(bgImage.files[0]).then((result) => { bgImageLink = result })
        
        let data = {
            title: document.querySelector('#title').value,
            genre: document.querySelector('#genere-list').value,
            minAge: document.querySelector('input[name="PG"]:checked').id.slice(1),
            duration: document.querySelector('#duration').value,
            posterSource: posterLink, 
            bgImageSource: bgImageLink,
            trailerSource: document.querySelector('#YTlink').value,
            description: document.querySelector('#description').value
        }
        
        if (id)
            data.movieId = id
        
        console.log(data);

        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://wawel.herokuapp.com/movies/edit', true)
        xhr.setRequestHeader("content-type", "application/json")

        xhr.onreadystatechange = () => {
            if (xhr.status == 200) {
                if (id)
                    window.location.href = 'administracja.html?status=16'
                else
                    window.location.href = 'administracja.html?status=15'
            } else {
                console.error(xhr.responseText)
                createSnackbar('Wystąpił błąd', 'error')
                loader.remove()
            }
        }

        xhr.send(JSON.stringify(data))
    })
}

const id = urlParams.get('id')

const movie = fetch('https://wawel.herokuapp.com/movies/' + id)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovie = async () => {
    movieHTML = createElementFromHTML('<form action=""> <div class="long-input"> <label for="title">Tytuł</label> <input type="text" name="title" id="title" placeholder="Nowy Film" required> </div> <div class="file-input" id="poster-input"> <label for="poster">Plakat</label> <div class="drag-area"> <div class="icon"> <span></span> <span></span> </div> <input type="file" id="poster" name="poster" hidden> </div> </div> <div class="long-input"> <label for="genere-list">Gatunek</label> <select id="genere-list" required> <option id="current"></option> <option></option> <option value="Akcja">Akcja</option> <option value="Horror">Horror</option> <option value="Komedia">Komedia</option> <option value="Thriller">Thriller</option> <option value="Romans">Romans</option> <option value="Sensacja">Sensacja</option> <option value="Sci-Fi">Sci-Fi</option> <option>Nowy...</option> </select> </div> <div class="short-input"> <label for="PG">Czas trwania</label> <div class="radio-group"> <div> <input type="radio" id="a7" name="PG" required> <label for="7">7+</label> </div> <div> <input type="radio" id="a13" name="PG" required> <label for="13">13+</label> </div> <div> <input type="radio" id="a16" name="PG" required> <label for="16">16+</label> </div> <div> <input type="radio" id="a18" name="PG" required> <label for="18">18+</label> </div> </div> </div> <div class="short-input"> <label for="duration">Czas trwania</label> <div id="duration-input"> <input type="number" name="duration" id="duration" required min="0"> <span>min.</span> </div> </div> <div class="long-input high-input"> <label for="description">Opis</label> <textarea name="description" id="description" required rows="12"></textarea> </div> <div class="file-input" id="trailer-input"> <label for="poster">Obraz tła</label> <div class="drag-area"> <div class="icon"> <span></span> <span></span> </div> <input type="file" id="bgImage" name="bgImage" hidden> </div> <p>Link do zwiastunu:</p> <input type="text" name="YTlink" id="YTlink" required> </div> <div id="submit"> <button type="submit" class="cta-1">Zapisz</button> </div> </form>')
    document.querySelector('main section').appendChild(movieHTML)

    if (!id) return

    const m = await movie
    
    movieHTML.querySelector('#title').value = m.title

    // Check if movie genere is in options
    
    movieHTML.querySelector('#current').value = m.genre
    movieHTML.querySelector('#current').innerText = m.genre
    movieHTML.querySelector('#genere-list').value = m.genre
    
    movieHTML.querySelector('#a' + m.minAge).checked = true
    movieHTML.querySelector('#duration').value = m.duration
    movieHTML.querySelector('#description').value = m.description

    movieHTML.querySelector('#YTlink').value = m.trailerSource
}

getMovie().then(() => { addEventListeners() })

