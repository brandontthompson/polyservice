import { service } from '../index';
(() => {
    service.register(require('./testservice').test);
    service.register(require('../index').adminconnector);
    // service.use(require('./middleware.test').testmiddleware);
    service.init();

})();