import { service } from '../index';
(() => {
    service.register(require('./testservice').test);
    service.use(require('./middleware.test').testmiddleware);
    service.init();

})();