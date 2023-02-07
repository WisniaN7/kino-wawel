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
})
