window.addEventListener('load', () => {
    document.querySelector('header div.user div.icon-user').addEventListener('click', function() {
        document.querySelector('header div.user menu').classList.toggle('active')
    })
})

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}