function ajax(url, cb) {
  const fake_responses = {
    file1: "The first text",
    file2: "The middle text",
    file3: "The last text"
  };
  const pending = (Math.round(Math.random() * 1e4) % 5000) + 1000;
  console.log("Request: " + url + `, TIME: ${pending} ms`);

  setTimeout(() => {
    cb(fake_responses[url]);
  }, pending);
}

function IO(text) {
  console.log(text);
}

const sulisuli = 'Race Condition';

module.exports = {
  ajax, IO, sulisuli
};
