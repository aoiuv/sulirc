"use strict";
const http = require("http");
const concat = require("concat-stream");

function get(url) {
  http.get(url, response => {
    response.pipe(
      concat(body => {
        console.log(body.toString());
      })
    );
  });
}

[process.argv[2], process.argv[3], process.argv[4]].forEach(get);
