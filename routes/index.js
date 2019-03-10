const router = require('koa-router')()
const dbAPI = require('../middleware/db')


router.get('/', async(ctx, next) => {
    let login = ctx.cookies.get("LoginStatus");
    ///let username = ctx.body.name;
    await ctx.render('index', {
        // username,
        login,
    })
})

router.get('/logout', async(ctx, next) => {
    ctx.cookies.set("LoginStatus", false);
    ctx.body = "LOGOUT";
})

router.get('/xiaomi', async(ctx, next) => {
    let login = ctx.cookies.get("LoginStatus");
    await ctx.render('xiaomi', {
        login
    })
})

router.get("/note", async(ctx, next) => {
    //TODO
    const results = await dbAPI.getNote('/');
    return ctx.render('note', { results: results });
});

router.get("/delete/note/:noteId", async(ctx, next) => {
    await dbAPI.deleteNoteId(ctx.params.noteId);
    await next()
    const results = await dbAPI.getNote();
    return ctx.render('notelist', { results: results });
})

router.get("/read/note/:noteId", async(ctx, next) => {
    let noteId = ctx.params.noteId;
    let content = await dbAPI.readNoteId(noteId);
    ctx.body = content;
    await next();
})

router.post("/insert/note", async(ctx, next) => {
    let content = ctx.request.body.content;
    await dbAPI.insertNote(content);
    const results = await dbAPI.getNoteList();
    return ctx.render('note', { results: results });
})

module.exports = router