import { Server } from 'http';
import app from './app';
import prisma from './client';

let server: Server;
const port = 3000

prisma.$connect().then(() => {
    console.log('Connected to SQL Database');
    server = app.listen(port, () => {
        console.log(`Listening to port ${port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.log(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});