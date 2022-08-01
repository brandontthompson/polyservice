import { middleware, polyservice } from '../index';
import { web } from './web';

(() => {

    polyservice.register(web);
    polyservice.register(require('./testservice').test);
    polyservice.use(require('./middleware.test').testmiddleware);
    polyservice.init();

})();
