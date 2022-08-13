import { middleware, polyservice } from '../index';
import express ,{ web } from '../../polyexpress';
import { HttpListener } from "../httplistener";
import { testplugin } from "./testplug";
(() => {

    polyservice.register(require('./testservice').test);
	polyservice.use(express.json())
	polyservice.use(express.urlencoded({extended:false}))
    polyservice.use(require('./middleware.test').testmiddleware);
    polyservice.plugin(testplugin)
    polyservice.init({httplistener: HttpListener.createServer });

    HttpListener.Instance.Listen(process.env.HTTP_PORT||3000);
})();
