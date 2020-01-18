import serve from 'koa-static';
import Koa from 'koa';

const app = new Koa();

app.use(serve('./static'));
app.listen(3001);

/**

$ http :3001/headpic.jpg

HTTP/1.1 200 OK
Cache-Control: max-age=0
Connection: keep-alive
Content-Length: 66063
Content-Type: image/jpeg
Date: Sat, 18 Jan 2020 08:09:11 GMT
Last-Modified: Wed, 15 Jan 2020 01:55:21 GMT



+-----------------------------------------+
| NOTE: binary data not shown in terminal |
+-----------------------------------------+

*/

/**

$ http :3001/word

HTTP/1.1 200 OK
Cache-Control: max-age=0
Connection: keep-alive
Content-Length: 14
Content-Type: application/octet-stream
Date: Sat, 18 Jan 2020 08:09:40 GMT
Last-Modified: Sat, 18 Jan 2020 08:08:45 GMT

Talk is cheap!

*/
