"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// koa + socket.io
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const http_1 = __importDefault(require("http"));
const koa_static_1 = __importDefault(require("koa-static"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const socket_io_1 = __importDefault(require("socket.io"));
const app = new koa_1.default();
const router = new koa_router_1.default();
const debug = debug_1.default('socket');
const chatKey = 'chat message';
app.use(koa_static_1.default('./static'));
router.get('/', (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs_1.default.createReadStream(path_1.default.join(__dirname, './static/index.html'));
});
app.use(router.routes());
const server = http_1.default.createServer(app.callback());
const io = socket_io_1.default(server);
io.on('connection', socket => {
    debug('a client connected at ' + new Date(), socket.id);
    socket.on(chatKey, msg => {
        io.emit(chatKey, { msg, id: socket.id });
    });
});
server.listen(3000, () => {
    debug('server listen port 3000');
});
