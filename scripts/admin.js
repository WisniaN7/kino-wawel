window.addEventListener('load', () => {
    const screeningsBtn = document.querySelector('#screeningsBtn')
    const screenings = document.querySelector('#screenings')

    screeningsBtn.addEventListener('click', (e) => {
        screenings.classList.toggle('active')
    })
})