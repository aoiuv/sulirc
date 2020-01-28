"use strict";
const http = require("http");
const concat = require("concat-stream");

http
  .get(process.argv[2], response => {
    response.pipe(
      concat(body => {
        const content = body.toString();
        console.log(content.length);
        console.log(content);
      })
    );
  })
  .on("error", console.error);
