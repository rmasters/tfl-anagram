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

/**
 * Returns an object of characters and their number of occurrences in the string
 */
const charCounter = (str) => {
  const chars = str.replace(/\W/, '').toUpperCase().split('');
  return chars.reduce((counts, char) => {
    if (!counts.hasOwnProperty(char)) {
      counts[char] = 0;
    }
    counts[char]++;
    return counts;
  }, {});
};

const solve = (anagram) => {
  // Convert anagram to uppercase chars and count required
  const anagramChars = charCounter(anagram);

  stations.then(names => {
    const matches = names.filter(name => {
      const nameChars = charCounter(name);
      // Check that every char in the anagram is represented in the name at least as many times
      for (const [char, occurrences] of Object.entries(anagramChars)) {
        if (!nameChars.hasOwnProperty(char) || nameChars[char] < occurrences) {
          return false;
        }
      }
      return true;
    });

    console.log(matches);
  });
};

solve(process.argv[2]);
