const router = require('koa-router')()
const dbAPI = require('../middleware/db')

router.get('/login', async(ctx, next) => {
    if (ctx.cookies.get("LoginStatus"))
        return ctx.redirect('/');
    return ctx.render('login');
});

router.post('/login', async(ctx, next) => {
    console.log("post");
    let username = ctx.request.body.username || '',
        password = ctx.request.body.password || '';
    var result = await dbAPI.validate(username, password);
    if (result) {
        ctx.cookies.set("LoginStatus", true);
        console.log("登录成功");
        ctx.body.name = username;
    } else {
        ctx.body = "Login error";
        console.log("登录失败");
    }
});

module.exports = router