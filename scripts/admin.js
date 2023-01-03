window.addEventListener('load', () => {
    document.querySelector('.lds-ring').remove()
    const screeningsBtn = document.querySelector('#screeningsBtn')
    const screenings = document.querySelector('#screenings')

    screeningsBtn.addEventListener('click', (e) => {
        screenings.classList.toggle('active')
    })
})