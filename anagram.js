const path = require('path');
const fs = require('fs');

const stations = new Promise((resolve, reject) => {
  fs.readFile(path.resolve(__dirname, 'stations.txt'), (err, data) => {
    if (err) {
      return reject(err);
    }

    resolve(data.toString().split("\n"));
  });
});

const solve = (anagram) => {
  const anagramChars = anagram.replace(/\s+/, '').toUpperCase().split('').sort();

  stations.then(names => {
    const matches = names.filter(name => {
      const chars = name.replace(/\W/, '').toUpperCase().split('').sort();
      // Check if this name contains the anagram subset
      return anagramChars.every(char => chars.includes(char));
    });
    console.log(matches);
  });
};

solve(process.argv[2]);
