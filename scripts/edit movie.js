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
})
