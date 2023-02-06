// TODO: change user icon when user is not logged in

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const error = urlParams.get('status')
const message = urlParams.get('message')

window.addEventListener('load', () => {
    document.querySelector('header div.user div.icon-user')?.addEventListener('click', function() {
        document.querySelector('header div.user menu').classList.toggle('active')
    })

    handleErrors()
})

function createElementFromHTML(htmlString) {
    var div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    return div.firstChild
}

function createSnackbar(text, type = 'info', time = 'short') {
    let snackbar = document.getElementById('snackbar')

    if (snackbar)
        snackbar.remove()

    snackbar = document.createElement('div')
    snackbar.id = 'snackbar'
    snackbar.innerText = text
    snackbar.classList.add('show')
    snackbar.classList.add(type)
    snackbar.classList.add(time)
    document.body.appendChild(snackbar)
    
    return snackbar
}

function handleErrors() {
    if (!error) return 

    if (error == 1)
        createSnackbar('Conajmniej jedno z wybranych miejsc nie jest już dostępne. Wybierz inne miejsca.', 'error', 'long')
    else if (error == 2)
        createSnackbar('Seans już się rozpoczął. Sprzedaż biletów jest zablokowana.', 'error', 'long')
    else if (error == 4)
        createSnackbar('Wprowadzone dane są niepoprawne.', 'error')
    else if (error == 5)
        createSnackbar('Użytkownik już zalogowany. Wyloguj się, aby zalogować się na nowe konto.', 'info', 'long')
    else if (error == 6)
        createSnackbar('Rejestracja przebiegła pomyślnie, możesz się zalogować.', 'success', 'short')
    else if (error == 7)
        createSnackbar('Użytownik zalogowany.', 'success', 'short')
    else if (error == 8)
        createSnackbar('Login jest już zajęty.', 'warning', 'short')
    else if (error == 9)
        createSnackbar('Adres email jest już zajęty.', 'warning', 'short')
    else if (error == 10)
        createSnackbar('Wylogowano pomyślnie.', 'success', 'short')
    else if (error == 11)
        createSnackbar('Dodanie recenzji przebiegło pomyślnie.', 'success', 'short')
    else if (error == 12)
        createSnackbar('Aktualizacja recenzji przebiegła pomyślnie.', 'success', 'short')
    else if (error == 13)
        createSnackbar('Dodanie nie powiodło się.', 'error', 'short')
    else if (error == 14)
        createSnackbar('Aktualizacja nie powiodło się.', 'error', 'short')
    else if (error == 15)
        createSnackbar('Dodanie filmu powiodło się.', 'success', 'short')
    else if (error == 16)
        createSnackbar('Edycja filmu powiodła się.', 'success', 'short')
    else
        createSnackbar('Unknown status: ' + error + ', with message: ' + message)
}

function isItTooLate(time, timeOffset) {
    const currentTime = new Date()
    const date = new Date(currentTime.setMinutes(currentTime.getMinutes() + timeOffset))
    return time < date
}