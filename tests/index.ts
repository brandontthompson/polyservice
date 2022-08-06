import { middleware, polyservice } from '../index';
import express ,{ web } from './web';
import { HttpListener } from "../server";
(() => {

    polyservice.register(require('./testservice').test);
	polyservice.use(express.json())
	polyservice.use(express.urlencoded({extended:false}))
    polyservice.use(require('./middleware.test').testmiddleware);
    polyservice.init();

    HttpListener.Instance.Listen();
})();
