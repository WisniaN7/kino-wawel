window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) return name == 'user' ? JSON.parse(match[2]) : match[2]
}

const user = getCookie('user')

if (!user || !isAdmin(user))
    window.location.href = 'index.html'