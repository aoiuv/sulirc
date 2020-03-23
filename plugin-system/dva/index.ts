import { create } from "dva-core";
import createImmerPlugin from "dva-immer";

const app = create();

app.use(createImmerPlugin());

console.log(app);