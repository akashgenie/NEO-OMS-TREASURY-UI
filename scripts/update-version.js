const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '../src/assets/version.json');

const versionData = {
  version: new Date().getTime().toString()
};

fs.writeFileSync(versionFilePath, JSON.stringify(versionData));
console.log(' version.json updated with timestamp: ', versionData.version);
