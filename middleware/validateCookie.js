const router = require('koa-router')()

function validateCookie(ctx, next) {
    if (!(ctx.cookies.get("LoginStatus")) && ctx.url == "/xiaomi") {
        console.log("Not login");
        ctx.redirect("/login")

    } else {
        return next();

    }
}

module.exports = validateCookie;