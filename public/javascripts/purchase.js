function calcTotal() {
    const tickets = document.querySelectorAll('.ticket-type .ticket-counter')
    let total = 0
    tickets.forEach(ticket => total += ticket.innerHTML * ticket.getAttribute('data-price') )
    return total
}

window.addEventListener('load', () => {
    const totalDisplay = document.querySelector('#summary span')
    const ticketsSelector = document.querySelector('#tickets')
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

    const countersPlus = ticketsSelector.querySelectorAll('.plus')

    countersPlus.forEach((plus) => {
        plus.addEventListener('click', () => {
            const sibling = plus.previousElementSibling
            const counter = sibling.querySelector('span')
            counter.innerText = parseInt(counter.innerText) + 1

            const input = sibling.querySelector('input[type="number"]')
            input.value = parseInt(counter.innerText)

            totalDisplay.innerText = calcTotal() * (100 - discount) / 100
            
            ticketsSelector.setAttribute('data-required', parseInt(ticketsSelector.getAttribute('data-required')) + 1)
            ticketsSelector.classList.add('chosen')
            ticketsSelector.classList.remove('incorrect')

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

            totalDisplay.innerText = calcTotal() * (100 - discount) / 100
            
            ticketsSelector.setAttribute('data-required', parseInt(ticketsSelector.getAttribute('data-required')) - 1)
            ticketsSelector.classList.remove('incorrect')
            
            if (parseInt(ticketsSelector.getAttribute('data-required')) == 0) {
                ticketsSelector.classList.remove('chosen')
                ticketValidator.required = true
            }
            
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
            
            ticketsSelector.classList.remove('incorrect')
            ticketsSelector.dispatchEvent(validateEvent)
        })
    })

    const discountInput = document.querySelector('#inputs div input')
    const discountBtn = document.querySelector('#inputs div button')
    let discount = 0
    
    discountBtn.addEventListener('click', (e) => {
        e.preventDefault()
        discountBtn.classList.remove('correct')

        if (!['WAWEL5', 'WAWEL10', 'WAWEL15'].includes(discountInput.value)) {
            discountBtn.classList.add('error')
            discountBtn.querySelector('span').innerText = '→'
            return
        } 

        discount = parseInt(discountInput.value.split('WAWEL')[1])
        totalDisplay.innerText = calcTotal() * (100 - discount) / 100

        discountBtn.querySelector('span').innerText = '✔'
        discountBtn.classList.add('correct')
    })

    discountInput.addEventListener('input', () => { discountBtn.classList.remove('error') })

    const submit = document.querySelector('button[type="submit"]')

    submit.addEventListener('click', (e) => {
        if (!ticketsSelector.classList.contains('correct')) {
            ticketValidator.required = true
            ticketsSelector.classList.add('incorrect')
        } else {
            ticketValidator.required = false
        }
    })
})