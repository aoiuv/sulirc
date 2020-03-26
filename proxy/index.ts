import AntProxy from './proxy';

const ap = new AntProxy();

ap.start(port => {
  console.log(`Server listening at port: ${port}`);
});
