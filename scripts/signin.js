window.addEventListener('load', () => {
    if (getCookie('user'))
        window.location.href = 'index.html?status=5'

    document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
        const usernameOrEmail = document.querySelector('#login').value
        const password = document.querySelector('#password').value
        
        if (usernameOrEmail != '' && password != '')
            e.preventDefault()
        else
            return
        
        const credentials = { usernameOrEmail: usernameOrEmail, password: password }
        const xhr = new XMLHttpRequest()
        
        xhr.open('POST', 'https://wawel.herokuapp.com/auth/signin', true)
        
        xhr.setRequestHeader("content-type", "application/json")
        
        xhr.onreadystatechange = () => {
            if (xhr.status == 200) {
                window.location.href = 'index.html?status=7'
                setCookie('user', xhr.responseText, 7)
            } else {
                window.location.href = 'logowanie.html?status=4'
            }
        }
        
        xhr.send(JSON.stringify(credentials))
    })
})
