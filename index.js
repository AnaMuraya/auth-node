const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const {API_PORT} = process.env;
const port = process.env.PORT || 3000;

// Start the server
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
}
);