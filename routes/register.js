const router = require('koa-router')()
const dbAPI = require('../middleware/db')

router.get('/register', async(ctx, next) => {
    return ctx.render('register');
});

router.post('/register', async(ctx, next) => {
    console.log("post-reg");
    let username = ctx.request.body.username || '',
        password = ctx.request.body.password || '';
    var result = await dbAPI.insert(username, password);
    if (result) {
        console.log("注册成功")
    } else {
        ctx.body = "Login error";
        console.log("注册失败")
    }
});

module.exports = router