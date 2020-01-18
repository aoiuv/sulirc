import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as deepmerge from 'deepmerge';

const app = new Koa();
const router = new Router();
const debug = require('debug')('web');

router.get('/', (ctx, next) => {
  ctx.body = 'Hello Koa with router';
});

router.get('/cat', (ctx, next) => {
  (ctx as any).cat_json = {};
  (ctx as any).cat_json.x = '@x';
  debug('cat x');
  next();
  (ctx as any).cat_json.z = '@z';
  debug('cat z');
});

router.get('/cat', (ctx, next) => {
  (ctx as any).cat_json.y = '@y';
  debug('cat y');
  ctx.body = deepmerge({}, (ctx as any).cat_json);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001);
