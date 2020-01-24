const Koa = require("koa");
const jwt = require("koa-jwt");
const jwt_client = require("jsonwebtoken");
const secret = "shared-secret";
const app = new Koa();
const debug = require('debug')('web');
const token = jwt_client.sign({ foo: "bar" }, secret);

debug('get sign jwt token', token);

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next) {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = "Protected resource, use Authorization header to get access\n";
    } else {
      throw err;
    }
  });
});

// Unprotected middleware
app.use(function(ctx, next) {
  if (ctx.url.match(/^\/public/)) {
    ctx.body = "unprotected\n";
  } else {
    return next();
  }
});

// Middleware below this line is only reached if JWT token is valid
app.use(jwt({ secret }));

// Protected middleware
app.use(function(ctx) {
  if (ctx.url.match(/^\/api/)) {
    ctx.body = "protected\n";
  }
});

app.listen(3000);

/**
 http :3000/api "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1Nzk4NTg5MzB9.7YKCtb4YyDRpFh5qgmaqQILvv_zaJ0r3rmFF4drndrk" -v

GET /api HTTP/1.1
Accept: *(/)*
Accept-Encoding: gzip, deflate
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1Nzk4NTg5MzB9.7YKCtb4YyDRpFh5qgmaqQILvv_zaJ0r3rmFF4drndrk
Connection: keep-alive
Host: localhost:3000
User-Agent: HTTPie/2.0.0



HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 10
Content-Type: text/plain; charset=utf-8
Date: Fri, 24 Jan 2020 09:43:37 GMT

protected

 */

