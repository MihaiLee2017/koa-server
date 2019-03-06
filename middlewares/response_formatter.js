var ApiError = require('../app/error/ApiError')
// 统一返回格式
var response_formatter = (ctx, next) => {
    if (ctx.body) {
        ctx.body = {
            code: 0,
            message: "success",
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 0,
            message: success
        }
    }
}
// var okFn = (data, msg) => {
//     return {
//         msg,
//         data,
//         code: 0
//     }
// }
// var errFn = (msg) => {
//     return {
//         msg,
//         code: 1
//     }
// }
var url_filter = function (pattern) {
    return async function (ctx, next) {
        var reg = new RegExp(pattern)
        // ctx.okFn = okFn
        // ctx.errFn = errFn
        try {
            await next()
            if (reg.test(ctx.originalUrl)) {
                response_formatter(ctx)
            }
        } catch (error) {
            if (error instanceof ApiError && reg.test(ctx.originalUrl)) {
                ctx.status = 200
                ctx.body = {
                    code: error.code,
                    message: error.message
                }
            }
        }

    }
}

module.exports = url_filter