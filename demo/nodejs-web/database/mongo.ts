const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  console.log(`we're connected!`);
});

const kittySchema = mongoose.Schema({
  name: String
});

kittySchema.methods.speak = function() {
  var greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
  console.log(greeting);
};

const Kitten = mongoose.model("Kitten", kittySchema);
const felyne = new Kitten({ name: "felyne" });
const fluffy = new Kitten({ name: "fluffy" });

fluffy.speak();

function saveCallback(name: string) {
  return err => {
    if (err) {
      return console.error(`save ${name} error:`, err);
    }
    console.log(`save ${name} ok`);
  };
}

// felyne.save(saveCallback("felyne"));
// fluffy.save(saveCallback("fluffy"));

Kitten.find({ name: /^fluff/ }, function(err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
});
