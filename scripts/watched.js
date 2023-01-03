window.addEventListener('load', function() {
    const stars = document.querySelectorAll('.star')

    stars.forEach(function(star) {
        star.addEventListener('mouseover', () => {
            const siblings = star.parentNode.children
            let i = 0

            do {
                siblings[i].classList.add('full')
                i++
            } while (siblings[i - 1] !== star) 
        })
    })

    const starContainer = document.querySelectorAll('.stars')

    starContainer.forEach(function(container) {
        container.addEventListener('mouseleave', () => {
            let stars = container.querySelectorAll('.star')

            for (let i = 4; i >= container.getAttribute('data-rating'); i--)
                stars[i].classList.remove('full')
        })
    })
})