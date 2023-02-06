window.addEventListener('load', () => {
    const archiveBtns = document.querySelectorAll('div.manage a.btn.archive')

    archiveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            if (!confirm('Czy na pewno chcesz zarchiwizować ten film? Ta akcja jest nieodwracalna.'))
                return

            fetch('/administracja/archive', {
                method: 'POST',
                body: JSON.stringify({ movie_id: btn.dataset.movie }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    createSnackbar('Film został zarchiwizowany', 'success')
                    btn.parentElement.parentElement.querySelector('p.status').innerHTML = '<span>•</span> Zarchiwizowany'
                    btn.parentElement.parentElement.querySelector('p.status').classList.add('archived')
                } else {
                    createSnackbar('Wystąpił błąd podczas archiwizacji filmu', 'error')
                }
            })
        })
    })

    const deleteBtns = document.querySelectorAll('div.manage a.btn.alert')

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            const input = prompt('Czy na pewno chcesz usunąć ten film? Ta akcja jest nieodwracalna i silnie destruktywna. Ta opcja powinna być używana tylko jeśli film został dodany przez przypadek lub komunizm powrócił i partia nakłada ciężką cenzurę. W celu usunięcia filmu wpisz jego tytuł:')

            if (input != btn.dataset.title)
                return

            fetch('/administracja/delete', {
                method: 'POST',
                body: JSON.stringify({ movie_id: btn.dataset.movie }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    createSnackbar('Film został usunięty', 'success')
                    btn.parentElement.parentElement.remove()
                } else {
                    createSnackbar('Wystąpił błąd', 'error')
                }
            })
        })
    })
})