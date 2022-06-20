const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const port = process.env.PORT || process.env.API_PORT;

// Start the server
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
}
);