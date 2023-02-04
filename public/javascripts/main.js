// TODO: change user icon when user is not logged in

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const error = urlParams.get('status')
const message = urlParams.get('message')

window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) return name == 'user' ? JSON.parse(match[2]) : match[2]
}

window.setCookie = function (name, value, days) {
    var d = new Date
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
    document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString()
}

window.deleteCookie = function (name) {
    document.cookie = name + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT'
}

if (getCookie('user')) {
    setCookie('user', JSON.stringify(getCookie('user')), 7)
}

window.addEventListener('load', () => {
    const user = getCookie('user')
    let menu

    if (user) {
        if (isAdmin(user)) {
            const nav = document.querySelector('header nav ul')
            const li = createElementFromHTML('<li><a href="administracja.html">Administracja</a></li>')

            if (window.location.href.includes('administracja.html'))
                li.classList.add('active')

            nav.insertBefore(li, nav.children[0])
        }

        menu = createElementFromHTML('<div class="user"> <div class="icon-user"> <span class="head"></span> <span class="body"></span> </div> <menu> <li><p class="username">admin</p></li> <li><a href="moje bilety.html">Moje bilety</a></li> <li><a href="moje recenzje.html">Moje recenzje</a></li> <li><a href="obejrzane.html">Obejrzane filmy</a></li> <li><a href="#">Wyloguj</a></li> </menu></div>')
        
        menu.querySelector('p.username').innerText = user.username

        menu.querySelector('li:last-child a').addEventListener('click', (e) => {
            e.preventDefault()
            deleteCookie('user')
            window.location.href = window.location.href.split('?')[0] + '?status=10'
        })
        
        const nav = document.querySelector('header nav')
        nav.appendChild(menu)
        nav.querySelector('li:last-child').remove()

        document.querySelector('header div.user div.icon-user').addEventListener('click', function() {
            document.querySelector('header div.user menu').classList.toggle('active')
        })
    }

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

    let snackbar

    if (error == 1)
        snackbar = createSnackbar('Conajmniej jedno z wybranych miejsc nie jest już dostępne. Wybierz inne miejsca.', 'error', 'long')
    else if (error == 2)
        snackbar = createSnackbar('Seans już się rozpoczął. Sprzedaż biletów jest zablokowana.', 'error', 'long')
    else if (error == 4)
        snackbar = createSnackbar('Wprowadzone dane są niepoprawne.', 'error')
    else if (error == 5)
        snackbar = createSnackbar('Użytkownik już zalogowany. Wyloguj się, aby zalogować się na nowe konto.', 'info', 'long')
    else if (error == 6)
        snackbar = createSnackbar('Rejestracja przebiegła pomyślnie, możesz się zalogować.', 'success', 'short')
    else if (error == 7)
        snackbar = createSnackbar('Użytownik zalogowany.', 'success', 'short')
    else if (error == 8)
        snackbar = createSnackbar('Login jest już zajęty.', 'warning', 'short')
    else if (error == 9)
        snackbar = createSnackbar('Adres email jest już zajęty.', 'warning', 'short')
    else if (error == 10)
        snackbar = createSnackbar('Wylogowano pomyślnie.', 'success', 'short')
    else if (error == 11)
        snackbar = createSnackbar('Dodanie recenzji przebiegło pomyślnie.', 'success', 'short')
    else if (error == 12)
        snackbar = createSnackbar('Aktualizacja recenzji przebiegła pomyślnie.', 'success', 'short')
    else if (error == 13)
        snackbar = createSnackbar('Dodanie nie powiodło się.', 'error', 'short')
    else if (error == 14)
        snackbar = createSnackbar('Aktualizacja nie powiodło się.', 'error', 'short')
    else if (error == 15)
        snackbar = createSnackbar('Dodanie filmu powiodło się.', 'success', 'short')
    else if (error == 16)
        snackbar = createSnackbar('Edycja filmu powiodła się.', 'success', 'short')
    else
        snackbar = createSnackbar('Unknown status: ' + error + ', with message: ' + message)
}

function isItTooLate(time, timeOffset) {
    const currentTime = new Date()
    const date = new Date(currentTime.setMinutes(currentTime.getMinutes() + timeOffset))
    return time < date
}

function isAdmin(user) {
    for (let i = 0; i < user.roles.length; i++)
        if (user.roles[i].name == 'role_admin')
            return true

    return false
}
