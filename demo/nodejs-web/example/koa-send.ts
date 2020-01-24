import Koa from "koa";
import send from "koa-send";
import path from "path";
import fs from "fs";

const app = new Koa();
const debug = require('debug')('web');
const filepath = path.join(__dirname, "./static/a");

debug(filepath, path.extname(filepath), path.basename(filepath));

app.use(async ctx => {
  debug(ctx.url, ctx.path);
  if (ctx.url === "/a") {
    ctx.type = "text/plain";
    ctx.body = fs.createReadStream(filepath);
  } else {
    ctx.type = "text/plain";
    await send(ctx, "./example/static/a");
  }
});

app.listen(3000);
