import Koa from "koa";
// import path from "path";

const app = new Koa();
// const debug = require('debug')('web');

app.use(async ctx => {
  if (ctx.path === '/public') {
    ctx.cookies.set('public', `public-key#${Math.random()}`);
  } else {
    ctx.cookies.set('cat', 'suri', { signed: true });
  
  }
  ctx.body = 'ok';
});

app.keys = ['i am a secret'];

app.listen(3000);
