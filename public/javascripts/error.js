let screen = document.querySelector('#screen'),
    text = document.querySelector('h2'),
    ww = screen.offsetWidth,
    wh = screen.offsetHeight,
    textWidth = text.offsetWidth,
    textHeight = text.offsetHeight,
    textTop = text.offsetTop,
    textLeft = text.offsetLeft,
    xMin = -textLeft,
    yMin = -textTop,
    xMax = ww - textLeft - textWidth,
    yMax = wh - textTop - textHeight,
    translateX = Math.floor((Math.random() * (ww - textWidth)) + 1),
    translateY = Math.floor((Math.random() * (wh - textHeight)) + 1),
    request = null,
    direction = 'dr',
    speed = 1,
    timeout = null


init()

// reset constraints on resize
document.body.addEventListener('resize', function (argument) {
    clearTimeout(timeout)
    timeout = setTimeout(update, 100)
}, false)

function init() {
    request = requestAnimationFrame(init)
    move()
}

// reset constraints
function update() {
    xMin = -textLeft
    yMin = -textTop
    xMax = screen.innerWidth - textLeft - textWidth
    yMax = screen.innerHeight - textTop - textHeight
}

function move() {
    setDirection()
    text.style.setProperty('transform', 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0)')
}

function setDirection() {
    switch (direction) {
        case 'ur':
            translateX += speed
            translateY -= speed
            break
        case 'ul':
            translateX -= speed
            translateY -= speed
            break
        case 'dr':
            translateX += speed
            translateY += speed
            break
        case 'dl':
            translateX -= speed
            translateY += speed
            break
    }
    
    setLimits()
}

function setLimits() {
    if (translateY <= yMin)
        if (direction == 'ul')
            direction = 'dl'
        else if (direction == 'ur')
            direction = 'dr'

    if (translateY >= yMax)
        if (direction == 'dr')
            direction = 'ur'
        else if (direction == 'dl')
            direction = 'ul'
    
    if (translateX <= xMin)
        if (direction == 'ul')
            direction = 'ur'
        else if (direction == 'dl')
            direction = 'dr'

    if (translateX >= xMax)
        if (direction == 'ur')
            direction = 'ul'
        else if (direction == 'dr')
            direction = 'dl'
}
