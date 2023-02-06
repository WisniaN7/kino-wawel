window.addEventListener('load', () => {
    const stars = document.querySelectorAll('.star')

    stars.forEach(function (star) {
        star.addEventListener('mouseover', () => {
            const siblings = star.parentNode.querySelectorAll('.star')

            siblings.forEach((sibling) => { sibling.classList.remove('full') })

            let i = 0

            do {
                siblings[i].classList.add('full')
                i++
            } while (siblings[i - 1] !== star)
        })

        star.addEventListener('click', () => {
            const siblings = star.parentNode.querySelectorAll('.star')
            let i = 0

            do {
                i++
            } while (siblings[i - 1] !== star)

            star.parentNode.setAttribute('data-rating', i)
            star.parentNode.querySelector('input').value = i
        })
    })

    const starContainer = document.querySelectorAll('.stars')

    starContainer.forEach(function (container) {
        container.addEventListener('mouseleave', () => {
            let stars = container.querySelectorAll('.star')
            stars.forEach((star) => { star.classList.remove('full') })

            for (let i = 0; i < container.getAttribute('data-rating'); i++)
                stars[i].classList.add('full')
        })
    })

    const cancel = document.querySelector('a.btn')

    cancel.addEventListener('click', (e) => {
        e.preventDefault()
        window.location.href = document.referrer
    })
})