import { promisify } from 'util';
import { RedisClient } from 'redis'
import { opts } from './config';


export class Redis {

    connection:RedisClient;
    get:Function;
    set:Function;
    exists:Function;
    sadd:Function;
    scard:Function;
    hget:Function;
    hset:Function;
    hexists:Function;
    hgetall:Function;
    rpush:Function;
    lpush:Function;
    lrange:Function;


    constructor(connection?:RedisClient) {
        if (!connection) {
            try {
                connection = this.__conn();
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        this.connection = connection;
        this.set = promisify(connection.set).bind(connection);
        this.get = promisify(connection.get).bind(connection);
        this.exists = promisify(connection.exists).bind(connection);
        this.sadd = promisify(connection.sadd).bind(connection);
        this.scard = promisify(connection.scard).bind(connection);
        this.hset = promisify(connection.hset).bind(connection);
        this.hget = promisify(connection.hget).bind(connection);
        this.hgetall = promisify(connection.hgetall).bind(connection);
        this.hexists = promisify(connection.hexists).bind(connection);
        this.rpush = promisify(connection.rpush).bind(connection);
        this.lpush = promisify(connection.lpush).bind(connection);
        this.lrange = promisify(connection.lrange).bind(connection);

    }

    __conn() {
        return new RedisClient(opts);
    }

    instance() {
        return this.connection;
    }

    buffer(data:any) {
        return Buffer.from(data);
    }
}