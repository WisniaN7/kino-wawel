window.addEventListener('load', () => {
    if (getCookie('token'))
        window.location.href = 'index.html?status=5'

    document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
        const username = document.querySelector('#login').value
        const email = document.querySelector('#e-mail').value
        const password = document.querySelector('#password').value
        const passwordCheck = document.querySelector('#passwordCheck').value
        const passwordInputs = document.querySelectorAll('input[type="password"]')

        if (username != '' && email != '' && password != '' && passwordCheck != '' && password.length >= 8) {
            e.preventDefault()

            if (password != passwordCheck) {
                createSnackbar('Hasła nie są takie same!', 'error', 'short')

                passwordInputs.forEach((input) => { 
                    input.value = ''
                    input.classList.add('error')

                    input.addEventListener('input', () => { input.classList.remove('error') })
                })

                return
            }
        } else {
            return
        } 

        const credentials = { username: username, email: email.toLowerCase(), password: password }

        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://wawel.herokuapp.com/auth/signup', true)
        xhr.setRequestHeader("content-type", "application/json")

        xhr.onreadystatechange = () => {
            if (xhr.readyState != xhr.DONE) return

            if (xhr.status == 200)
                window.location.href = 'logowanie.html?status=6'
            else if (xhr.responseText.startsWith('Username'))
                createSnackbar('Podany login jest już zajęty', 'error', 'short')
            else if (xhr.responseText.startsWith('Email'))
                createSnackbar('Podany adres e-mail jest już zajęty', 'error', 'short')
            else {
                createSnackbar('Wystąpił nieznany błąd', 'error', 'short')
                console.error('Server response:', xhr.responseText)
            }
        }

        xhr.send(JSON.stringify(credentials))
    })
})
