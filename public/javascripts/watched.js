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

            const prevScore = star.parentNode.getAttribute('data-rating')
            star.parentNode.setAttribute('data-rating', i)

            const data = {
                movieId: star.parentNode.getAttribute('data-movie'),
                rating: star.parentNode.getAttribute('data-rating')
            }

            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/reviews/rating', true)
            xhr.setRequestHeader("content-type", "application/json")

            xhr.onreadystatechange = () => {
                if (xhr.readyState != xhr.DONE) return

                if (xhr.status === 200)
                    createSnackbar('Ocena została zaktualizowana', 'success')
                else {
                    createSnackbar('Błąd przy aktualizacji oceny', 'error')
                    star.parentNode.setAttribute('data-rating', prevScore)
                }
            }

            xhr.send(JSON.stringify(data))
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
})