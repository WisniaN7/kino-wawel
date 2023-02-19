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

window.addEventListener('load', () => {
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

            if (oldImg = input.querySelector('img')) {
                oldImg.remove()
            }

            input.appendChild(img)

            // input.querySelector('div.icon').remove()
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

    const submit = document.querySelector('#submit button')

    submit.addEventListener('click', (e) => {
        e.preventDefault()

        const inputs = document.querySelectorAll('input, select, textarea')
        const formData = new FormData()
        let endpoint

        inputs.forEach((input) => {
            if (input.type == 'hidden')
                endpoint = input.value == 'NULL' ? '/administracja/movies/add' : '/administracja/movies/edit'

            if (input.type == 'radio') {
                if (input.checked)
                    formData.append(input.name, input.value)
            } else if (input.type == 'file') {
                formData.append(input.name, input.files[0])
            } else {
                formData.append(input.name, input.value)
            } 
        })

        console.log(...formData)

        fetch(endpoint, { method: 'POST', body: formData }).then((res) => {
            if (res.status == 200)
                window.location.href = '/administracja'
            else 
                createSnackbar('Wystąpił błąd podczas dodawania filmu', 'error', 'short')
        })
    })
})
