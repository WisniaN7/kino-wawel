const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const repertoireRouter = require('./routes/repertoire')
const purchaseRouter = require('./routes/purchase')
const movieRouter = require('./routes/movie')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const authRouter = require('./routes/auth')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/repertuar', repertoireRouter)
app.use('/zakup', purchaseRouter)
app.use('/film', movieRouter)
app.use('/', userRouter)
app.use('/administracja', adminRouter)
app.use('/', authRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404), { user: req.session.user })
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error', { user: req.session.user, host: req.hostname })
})

app.locals.capitalizeTitle = (title) => {
    const words = title.split(' ');
    const capitalizedWords = words.map(word => '<span class="capital">' + word[0] + '</span>' + word.slice(1));
    return capitalizedWords.join(' ');
}

module.exports = app
