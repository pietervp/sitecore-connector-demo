// copy ../../connector/build/connector.json to ../public/connector.json
const fs = require('fs');
const path = require('path');

const connectorJsonPath = path.resolve(__dirname, '..', '..', 'connector', 'build', 'connector.json');
const outputConnectorJsonPath = path.resolve(__dirname, '..', 'public', 'connector.json');

// ensure target folder exists
fs.mkdirSync(path.dirname(outputConnectorJsonPath), { recursive: true });

fs.copyFileSync(connectorJsonPath, outputConnectorJsonPath);
