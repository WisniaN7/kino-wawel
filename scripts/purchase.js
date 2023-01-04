const seats = fetch('https://wawel.herokuapp.com/movies/screening/' + 2 || id)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getSeats = async () => {
    const s = await seats
    
    const fieldset = document.querySelector('#seats')
    let rowCounter = 0

    s.seats.forEach((row) => {
        const rowLabel = document.createElement('span')
        rowLabel.innerText = String.fromCharCode(65 + rowCounter++)
        fieldset.appendChild(rowLabel)

        let colCounter = 0

        row.forEach((seatType) => {
            const input = document.createElement('input')
            input.type = 'checkbox'
            input.name = 'seats'
            input.value = rowLabel.innerText + (colCounter++)

            switch (seatType) {
                case 'WOLNE':
                    input.classList.add('free')
                    break
                case 'ZAJĘTE':
                    input.classList.add('taken')
                    input.disabled = true
                    break
                case 'NIE_ISTNIEJE':
                    input.disabled = true
                    break
            }
            
            fieldset.appendChild(input)
        })
    })
}

function addEventListeners() {
    const total = document.querySelector('#summary span')
    const ticketsSelector = document.querySelector('#tickets')
    const countersPlus = ticketsSelector.querySelectorAll('.plus')
    const validateEvent = new Event('validate')
    const ticketValidator = ticketsSelector.querySelector('#validation input[type="radio"]')
    
    ticketsSelector.addEventListener('validate', () => {
        if (ticketsSelector.getAttribute('data-required') == ticketsSelector.getAttribute('data-chosen') && ticketsSelector.getAttribute('data-chosen') != 0)
            ticketsSelector.classList.add('correct')
        else if (ticketsSelector.getAttribute('data-required') == 0)
            ticketValidator.required = true
        else
            ticketsSelector.classList.remove('correct')

    })

    countersPlus.forEach((plus) => {
        plus.addEventListener('click', () => {
            const sibling = plus.previousElementSibling
            const counter = sibling.querySelector('span')
            counter.innerText = parseInt(counter.innerText) + 1

            const input = sibling.querySelector('input[type="number"]')
            input.value = parseInt(counter.innerText)

            total.innerText = parseInt(total.innerText) + parseInt(counter.getAttribute('data-price'))
            ticketsSelector.setAttribute('data-required', parseInt(ticketsSelector.getAttribute('data-required')) + 1)
            ticketsSelector.classList.add('chosen')

            ticketValidator.required = false
            ticketsSelector.dispatchEvent(validateEvent)
        })
    })
    
    const countersMinus = ticketsSelector.querySelectorAll('.minus')
    
    countersMinus.forEach((minus) => {
        minus.addEventListener('click', () => {
            const sibling = minus.nextElementSibling
            const counter = sibling.querySelector('span')
            
            if ((count = parseInt(counter.innerText)) == 0) return
            
            counter.innerText = count - 1
            
            const input = sibling.querySelector('input[type="number"]')
            input.value = parseInt(counter.innerText)

            total.innerText = parseInt(total.innerText) - parseInt(counter.getAttribute('data-price'))
            ticketsSelector.setAttribute('data-required', parseInt(ticketsSelector.getAttribute('data-required')) - 1)
            
            if (parseInt(ticketsSelector.getAttribute('data-required')) == 0)
                ticketsSelector.classList.remove('chosen')
            
            ticketValidator.required = false
            ticketsSelector.dispatchEvent(validateEvent)
        })
    })

    const seats = document.querySelectorAll('#seats input')
    
    seats.forEach((seat) => {
        seat.addEventListener('change', () => {
            if (seat.checked) {
                ticketsSelector.setAttribute('data-chosen', parseInt(ticketsSelector.getAttribute('data-chosen')) + 1)
                ticketsSelector.classList.add('chosen')
            } else {
                ticketsSelector.setAttribute('data-chosen', parseInt(ticketsSelector.getAttribute('data-chosen')) - 1)
                
                if (parseInt(ticketsSelector.getAttribute('data-chosen')) == 0)
                ticketsSelector.classList.remove('chosen')
            }
            
            ticketsSelector.dispatchEvent(validateEvent)
        })
    })

}

getSeats().then(() => { addEventListeners() })
