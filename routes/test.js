const router = require('koa-router')()

router.prefix('/test')

router.get('/', async(ctx, next) => {
    let title = 'test-title';
    let list = ['1', '2', '3', '4'];
    let content = "<h2>这是一个标题</h2>";
    let num = 22;
    await ctx.render('test', {
        title,
        list,
        content,
        num
    })
})

module.exports = router