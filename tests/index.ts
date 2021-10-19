import { service } from '../lib';
(() => {
    // const opts:ioptions = {
    //     timeout: 15,
    //     requests: 15,
    //     timeBetweenRequests: 5
    // }
    service.register(require('./service/DEV/test').test)
    // service.register(require('../tests/testservice').test);
    // use(rateLimit(opts));
    service.init();
})();