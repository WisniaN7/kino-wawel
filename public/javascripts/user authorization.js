window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) return name == 'user' ? JSON.parse(match[2]) : match[2]
}

const status = new URLSearchParams(window.location.search).get('status')
const user = getCookie('user')

if (!user)
    if (!status)
        window.location.href = 'index.html'
    else
        window.location.href = 'index.html?status=' + status