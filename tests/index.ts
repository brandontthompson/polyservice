import { service } from '../index';
(() => {
    service.register(require('./testservice').test);
    service.use(require('./middleware.test').testmiddlware);
    service.init();
})();