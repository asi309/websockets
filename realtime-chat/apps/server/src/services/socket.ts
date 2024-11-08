import { Server } from 'socket.io';
import Redis from 'ioredis';

const pub = new Redis({
  host: 'valkey-237753a6-rtc01.j.aivencloud.com',
  port: 28369,
  username: 'default',
  password: '', //password goes here
});
const sub = new Redis({
  host: 'valkey-237753a6-rtc01.j.aivencloud.com',
  port: 28369,
  username: 'default',
  password: '', //password goes here
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log('Init Socket Service...');
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*',
      },
    });

    sub.subscribe('MESSAGES');
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    console.log('Init Socket Listeners...');
    const io = this.io;
    io.on('connect', async (socket) => {
      console.log(`New socket connected - ${socket.id}`);

      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log('New message received', message);
        // publish this message to redis
        await pub.publish('MESSAGES', JSON.stringify({ message }));
      });
    });

    sub.on('message', (channel, message) => {
      if (channel === 'MESSAGES') {
        io.emit('message', message);
      }
    });
  }
}

export default SocketService;
