window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) return name == 'user' ? JSON.parse(match[2]) : match[2]
}

function isAdmin(user) {
    for (let i = 0; i < user.roles.length; i++)
        if (user.roles[i].name == 'role_admin')
            return true

    return false
}

const user = getCookie('user')

if (!user || !isAdmin(user))
    window.location.href = 'index.html'


