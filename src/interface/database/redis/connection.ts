import { RedisClient } from 'redis';
import { Redis } from './redis';

let instance:Redis;
export const connection = function (connection?:RedisClient) {
    if (!instance)
        instance = new Redis(connection);
    return instance;
}
