var util = require('util');

var request = require('request');
var request_p = util.promisify(request);

module.exports = class IBMi {
  /**
   * Constructor for the IBMi class.
   *
   * @param {string} server Host name or address and port number of ILEusion server.
   * @constructor
   */
  constructor(server) {
    this.url = server;
  }

  /**
   * Execute an SQL statement against the remote Db2 for i database.
   * 
   * @param {string} statement SQL statement to be executed on the server.
   * @returns IBM i action / JSON Body
   */
  executeSQL(statement) {
    return {
      action: "/sql",
      query: statement
    };
  }

  /**
   * Construct a function based on a program or function call for later user.
   * 
   * @param {array} path An array leading to the program or function. [0]=Library, [1]=Object, [2]=Function (optional)
   * @param {object|null} returnType An object defining the return type of the function. Can use `null` if calling a program or is `void`.
   * @param {array} args An array defining the types of values being passed into the program or function.
   * @returns IBM i action / JSON Body
   */
  constructCall(path, returnType, args) {
    var endpoint = this.url;
    var body = {
      action: "/call",
      library: path[0].toUpperCase(),
      object: path[1].toUpperCase(),
      args: args
    };

    if (path[2] !== undefined)
      body.function = path[2];

    if (returnType !== undefined)
      body.result = returnType;

    return function (args) {
      if (args != null) {
        for (var i = 0; i < args.length; i++) {
          if (Array.isArray(args[i])) {
            body.args[i].values = args[i];
          } else {
            body.args[i].value = args[i];
          }
        }
      }

      return body;
    };
  }

  /**
   * Call an ILE program on IBM i.
   * 
   * @param {array} path An array leading to the program or function. [0]=Library, [1]=Object
   * @param {array} args An array defining the types of values being passed into the program or function.
   * @returns IBM i action / JSON Body
   */
  callProgram(path, args) {
    var theFunc = this.constructCall(path, undefined, args);

    return theFunc(null);
  }

  /**
   * Call an ILE exported function on IBM i.
   * 
   * @param {array} path An array leading to the program or function. [0]=Library, [1]=Object, [2]=Function name
   * @param {object|null} returnType An object defining the return type of the function. Can use `null` if calling a program or is `void`.
   * @param {array} args An array defining the types of values being passed into the program or function.
   * @returns IBM i action / JSON Body
   */
  callFunction(path, returnType, args) {
    var theFunc = this.constructCall(path, returnType, args);

    return theFunc(null);
  }

  /**
   * Push an item into a data queue.
   * 
   * @param {array} path An array leading to the data queue. [0]=Library, [1]=Object
   * @param {any} data Data which will be pushed into the data queue.
   * @param {key} key The key to be used when inserting into the data queue. If not key is required, can pass `null`.
   * @returns IBM i action / JSON Body
   */
  sendDataQueue(path, data, key) {
    var body = {
      action: "/dq/send",
      library: path[0].toUpperCase(),
      object: path[1].toUpperCase(),
      data: data
    };

    if (key !== null)
      body.key = key;

    return body;
  }
  /**
   * Pop an item from a data queue.
   * 
   * @param {array} path An array leading to the data queue. [0]=Library, [1]=Object
   * @param {object} props Properties object with the following information (all optional, call also pass `null`):
   * ```
{
  waittime: 0,
  keyorder: 'EQ',
  key: 'MYKEY'
}```
   * @returns IBM i action / JSON Body
   */
  popDataQueue(path, props) {
    var body = {
      action: "/dq/pop",
      library: path[0].toUpperCase(),
      object: path[1].toUpperCase(),
      waitime: 0
    };

    if (props) {
      if (props.waittime !== undefined)
        body.waitime = props.waittime;

      if (props.keyorder !== undefined)
        body.keyorder = props.keyorder;

      if (props.key !== undefined)
        body.key = key;
    }

    return body;
  }

  CL(command) {
    return {
      action: "/cl",
      command: command
    };
  }

  /**
   * 
   * @param {array} actions An array of JSON objects
   * @returns array of results for each transaction.
   */
  send(actions) {
    return sendRequest(this.url + '/transaction', actions);
  }
}



async function sendRequest(endpoint, jsonBody) {
  try {
    const result = await request_p({
      method: 'post',
      body: jsonBody,
      json: true,
      url: endpoint
    });

    var body = result.body;

    if (body.success !== undefined) {
      if (body.success === false) {
        return Promise.reject(body);
      }
    }

    return Promise.resolve(body);
  } catch (error) {
    return Promise.reject(error);
  }
};