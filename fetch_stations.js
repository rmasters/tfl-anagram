const fs = require('fs');
const https = require('https');

const fetchStopPoints = (mode) => {
  return new Promise((resolve, reject) => {
    https.get(`https://api.tfl.gov.uk/StopPoint/Mode/${mode}`, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP request failed'));
      }

      // Read body, decode and resolve with parsed JSON
      let body = '';
      res.on('data', (chunk) => {body += chunk});
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data.stopPoints.map(stopPoint => stopPoint.commonName));
        } catch (e) {
          reject(e);
        }
      });
    });
  });
};

const cleanStationName = (name) => {
  // Fix the brackets on "Custom House (for ExCeL"
  if (name.indexOf('(') !== null && name.indexOf(')') === null) {
    name += ')'
  }

  const patterns = [
    /(-Underground)/, // Paddington
    /(Underground Stn)/, // Shepherd's Bush
    /(Raill)/, // Bethnal Green

    /(Underground Station)/,
    /(Rail Station)/,
    /(DLR Station)/,
    /(Overground Station)/,
    /(Tram Stop)/,
    /(Station)/,

    /**
     * Trim trailing bracketed words, i.e. "Edgware Road (Circle line)", "Stratford (London)".
     * This does mangle "Cutty Sark (for Maritime Greenwich)", Kensington (Olympia), ExCeL etc. Fine for this purpose.
     */
    /(\([^)]+\))/,
  ];

  name = name.trim();
  for (const ptn of patterns) {
    name = name.replace(ptn, '').trim();
  }

  // Fix whitespace
  return name.replace(/\s+/, ' ');
};

const modes = ['tube', 'overground', 'dlr', 'tflrail', 'tram']

let names = Promise.all(modes.map(mode => fetchStopPoints(mode)));
names.then(names => {
  // Flatten the arrays of names for each mode; names.flat() in ES2018
  names = names.reduce((carry, names) => carry.concat(names), []);

  // Clean the names
  names = names.map(cleanStationName);

  // Remove duplicates (interchanges on multiple lines; multiple platforms, etc.) and sort
  names = names.filter((elem, pos, arr) => arr.indexOf(elem) == pos).sort();

  // Write each to stdout
  for (const name of names) {
    process.stdout.write(`${name}\n`);
  }
});
names.catch(err => console.error(err));
