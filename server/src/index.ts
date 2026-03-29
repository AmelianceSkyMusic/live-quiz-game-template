import { ws } from './ws.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 2345;

ws.start({ port: PORT });
console.log('Start websocket server on the', PORT, 'port!');
