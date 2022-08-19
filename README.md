# Polyservice
## The easiest way to write microservices
Focus on writing business logic not boilerplate for your microservices!

What is polyservice?

Polyservice is an extremely lightweight and fast way to write business logic that needs to run in multiple environments with many IO controllers.
Meaning the same function(s) can be used for a web API, CLI tool and a socket.io application with little to no extra code modifications.

The goal of Polyservice, aside from being unopinionated about your project's structure, is to make writing microservices extremely fast by abstracting out the setup and boilerplate without removing any control from the developer.

#### Polyservice is not just for microservices! Polyservice can easily be set up for monolithic applications as well, it all depends on your use case.


## Installation
[![NPM](https://nodei.co/npm/polyservice.png?compact=true)](https://npmjs.org/package/polyservice)


polyservice is available through the npm registry
```
$ npm install polyservice
```

## Features
- Robust controller system
- Built in type checking for incoming data
- Expandable plugin system
- Modular design
- Plug-n-play approach for IO controllers and middleware

### Features in development
- Auto generated client libraries
- Auto generated documentation

## Quick start
The quickest way to jump int writing services is to use one of the existing "poly controllers"
for this guide we will be creating a web service using the polyexpress controller
  - installation `npm install polyexpress`
  - this controller is a wrapper for the express framework

### Creating a service

We start by creating a service object, this object will define the name of your service
an array of method objects, which we will do in the next section Creating your methods,
and a controller or an array of controllers in which your service will be used by

```
import { service } from "polyservice";
import { web } from "polyexpress";

const myService:service = {
  name: "myservice",
  method: [ echo ],
  controller: web
}

```

### Creating your methods
The polyservice framework uses an interface called method to define the basic structure of your service method objects
controllers will expand this interface with additional information needed for that controller

In this example we are using the webMethod since we are writing a http api. 
Other controllers may use their own method interface to use more than one interface please refer to the following typescript code
`const someMethod:webMethod & othercontrollerMethod = {}`

the arguments key is an optional key and uses an object of polyargs which can be extended by controllers that require additional information

```
import { result } from "polyservice";
import { requestMethod, webMethod, requestType } from "polyexpress";
const echo:webMethod = {
  name: "echo",
  request: requestType.POST, // required for web controller
  arguments: {
    input:{ type:"string", requestMethod: requestMethod.PARAM } // requestMethod is required by the web controller
  }
  callback: function(input:string):result{
    const response:result = {
      code: 200,
      message: input
    }
    
    return result;
  }
}
```

### Registering your service
In the entrypoint of your code 
Here we are using polyservice's built in HttpListener singleton however you can use your own node.js Http or Https server if desired.
```
import { polyservice, HttpListener } from "polyservice";
(() => {

  polyservice.register(myService);
  polyservice.init({ httplistener: HttpListener.createServer } /** params to pass to the controller objects on init **/);
  
  HttpListener.Instance.Listen(process.env.PORT || 3000);

})();

```

### Good Job! 
You should now have a running http server with an endpoint at
`localhost:3000/myservice/echo/MESSAGE`

## Full Documentation
[the full documentation can be found on the Wiki](https://github.com/brandontthompson/polyservice/wiki)


Additional Polyservice controller packages includes the following
* polyexpress - expressjs

-- Still in development --
* polysocket - socket.io
* polycommand - Yargs
* polyrpc - gRPC


## Future plans
This framework is actively being developed and you can follow the progress right here on github
