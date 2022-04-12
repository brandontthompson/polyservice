import express from 'express';
import { middleware, service } from '../index';

(() => {

    // service.register();
    service.register(require('./testservice').test);
    service.use(express.urlencoded({extended:false}));
    service.use(express.json());
    service.use(require('./middleware.test').testmiddleware);
    service.use(middleware.simpleError)
    service.init();

})();