const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const ejs = require('ejs')
const router = require('koa-router')()

const mongoose = require('mongoose')
const multer = require('multer')

const session = require('koa-session')

const index = require('./routes/index')
const users = require('./routes/users')
const test = require('./routes/test')
const login = require('./routes/login')
const register = require('./routes/register')
const dbAPI = require('./middleware/db')
const validateCookie = require('./middleware/validateCookie')

// error handler
onerror(app)

// middlewares
app.use(bodyparser());
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

//session
app.keys = ['hello world'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 1000, //过期时间
    overwrite: true,
    httpOnly: true,
    signed: true,
}
app.use(session(CONFIG, app));

app.use(validateCookie);
app.use(router.routes());

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//cookie中间件

/*app.use(function(req, res, next) {
    res.local.user = req.session.user; //从session获取user对象
    var err = req.session.error; //错误信息
    delete req.session.error;
    res.local.message = "";
    if (err) {
        res.local.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>' //弹出错误警告
    }
    next();
})*/

// routes
app.use(index.routes(), index.allowedMethods())
app.use(test.routes(), test.allowedMethods())
app.use(login.routes(), login.allowedMethods())
app.use(register.routes(), register.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});


module.exports = app