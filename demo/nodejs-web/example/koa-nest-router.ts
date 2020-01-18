import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const debug = require('debug')('web');

const forums = new Router();
const posts = new Router();

posts.get('/', (ctx, next) => {
  debug('(/)', ctx.params);
  ctx.body = `(/) Responds to ` + ctx.path;
});

posts.get('/:pid', (ctx, next) => {
  debug('(/:pid)', ctx.params);
  ctx.body = `(/:pid) Responds to ` + ctx.path;
});

forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());

app.use(forums.routes());

app.listen(3001);
