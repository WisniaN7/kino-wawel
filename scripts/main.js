const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const error = urlParams.get('error')

window.addEventListener('load', () => {
    document.querySelector('header div.user div.icon-user').addEventListener('click', function() {
        document.querySelector('header div.user menu').classList.toggle('active')
    })

    handleErrors()
})

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}

function createSnackbar(text) {
    let snackbar = document.getElementById('snackbar')

    if (snackbar)
        snackbar.remove()

    snackbar = document.createElement('div')
    snackbar.id = 'snackbar'
    snackbar.classList.add('show')
    document.body.appendChild(snackbar)
    
    snackbar.innerText = text
    return snackbar
}

function handleErrors() {
    if (!error) return 

    let snackbar

    if (error == 1) {
        snackbar = createSnackbar('Conajmniej jedno z wybranych miejsc nie jest już dostępne. Wybierz inne miejsca.')
        snackbar.classList.add('long')
    } else if (error == 2) {
        snackbar = createSnackbar('Seans już się rozpoczął. Sprzedaż biletów jest zablokowana.')
        snackbar.classList.add('long')
    }

    snackbar.classList.add('show')
    snackbar.classList.add('error')
    setTimeout(() => { snackbar.classList.remove('show') }, 6000)
}

function isItTooLate(time, timeOffset) {
    const currentTime = new Date()
    const date = new Date(currentTime.setMinutes(currentTime.getMinutes() - timeOffset))
    return time < date
}