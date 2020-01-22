// koa + socket.io
import Koa from 'koa';
import Router from 'koa-router';
import http from 'http';
// import serve from 'koa-static';
import fs from 'fs';
import path from 'path';
import createDubug from 'debug';
import createSocket from 'socket.io';

const app = new Koa();
const router = new Router();
const debug = createDubug('socket');
const chatKey = 'chat message';

// app.use(serve('./static'));

router.get('/', (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./static/index.html');
});

app.use(router.routes());

const server = http.createServer(app.callback());
const io = createSocket(server);

io.on('connection', socket => {
  debug('a client connected at ' + new Date(), socket.id);
  socket.on(chatKey, msg => {
    io.emit(chatKey, { msg, id: socket.id });
  });
});

server.listen(3000, () => {
  debug('server listen port 3000');
});
