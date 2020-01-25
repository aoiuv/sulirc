import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();
const debug = require('debug')('web');

router.post('/post/:id', (ctx, next) => {
  const ret = 'POST: id#' + ctx.params.id;
  ctx.body = ret;
});

router.get('/get', (ctx, next) => {
  const ret = 'GET: date#' + new Date;
  ctx.body = ret;
});

app.use(router.routes());

app.listen(3001, () => {
  debug('server running at port:3001')
});
