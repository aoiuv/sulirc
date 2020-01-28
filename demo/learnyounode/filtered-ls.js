const fs = require('fs');
const dir = process.argv[2];
const ext = process.argv[3];

fs.readdir(dir, (err, list) => {
	if(err) return console.error(err);
	list.forEach(file => {
		const match = file.match(/(?<=\.)[a-zA-Z]+$/);
		if(match && match[0] === ext) {
			console.log(file);
		}
	})
});

