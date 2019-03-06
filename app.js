const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const koalogger = require('koa-logger')
// 日志
const logUtil = require('./utils/log_util')

// middlewares
const response_formatter = require('./middlewares/response_formatter')

// router api 接口
const api = require('./routes/api')
const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// app.use(koalogger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))


// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);
    logUtil.logError(ctx, { name: 'err name', message: 'err message', stack: 'err stack' }, ms);

  } catch (error) {

    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
})

// 统一返回格式
app.use(response_formatter("^/api"))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
