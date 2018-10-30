var request = require('request');

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
   * @param {function} callback Callback function(err, res)
   */
  executeSQL(statement, callback) {
    sendRequest(this.url + '/sql', {
      query: statement
    }, callback);
  }

  /**
   * Construct a function based on a program or function call for later user.
   * @returns {function} Returns a function(arrayparms, callback(err, res));
   * 
   * @param {array} path An array leading to the program or function. [0]=Library, [1]=Object, [2]=Function (optional)
   * @param {object|null} returnType An object defining the return type of the function. Can use `null` if calling a program or is `void`.
   * @param {array} args An array defining the types of values being passed into the program or function.
   */
  constructCall(path, returnType, args) {
    var endpoint = this.url;
    var body = {
      library: path[0].toUpperCase(),
      object: path[1].toUpperCase(),
      args: args
    };

    if (path[2] !== undefined)
      body.function = path[2];

    if (returnType !== undefined)
      body.result = returnType;

    return function (args, callback) {
      if (args != null) {
        for (var i = 0; i < args.length; i++) {
          if (Array.isArray(args[i])) {
            body.args[i].values = args[i];
          } else {
            body.args[i].value = args[i];
          }
        }
      }

      sendRequest(endpoint + '/call', body, callback);
    };
  }

  /**
   * Call an ILE program on IBM i.
   * 
   * @param {array} path An array leading to the program or function. [0]=Library, [1]=Object
   * @param {array} args An array defining the types of values being passed into the program or function.
   * @param {function} callback Callback function(err, res)
   */
  callProgram(path, args, callback) {
    var theFunc = this.constructCall(path, undefined, args);

    theFunc(null, callback);
  }

  /**
   * Call an ILE exported function on IBM i.
   * 
   * @param {array} path An array leading to the program or function. [0]=Library, [1]=Object, [2]=Function name
   * @param {object|null} returnType An object defining the return type of the function. Can use `null` if calling a program or is `void`.
   * @param {array} args An array defining the types of values being passed into the program or function.
   * @param {function} callback Callback function(err, res)
   */
  callFunction(path, returnType, args, callback) {
    var theFunc = this.constructCall(path, returnType, args);

    theFunc(null, callback);
  }

  /**
   * Push an item into a data queue.
   * 
   * @param {array} path An array leading to the data queue. [0]=Library, [1]=Object
   * @param {any} data Data which will be pushed into the data queue.
   * @param {key} key The key to be used when inserting into the data queue. If not key is required, can pass `null`.
   * @param {function} callback Callback function(err, res)
   */
  sendDataQueue(path, data, key, callback) {
    var body = {
      library: path[0].toUpperCase(),
      object: path[1].toUpperCase(),
      data: data
    };

    if (key !== null)
      body.key = key;

    sendRequest(this.url + '/dq/send', body, callback);
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
   * @param {function} callback Callback function(err, res)
   */
  popDataQueue(path, props, callback) {
    var body = {
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

    sendRequest(this.url + '/dq/pop', body, callback);
  }
}

function sendRequest(endpoint, jsonBody, callback) {
  request({
    method: 'post',
    body: jsonBody,
    json: true,
    url: endpoint
  }, function (err, res, body) {
    if (err) {
      callback(err, null);
    } else {
      if (body.success !== undefined) {
        if (body.success === false) {
          callback(body.message, null);
          err = body.message;
        }
      }

      if (err == null)
        callback(null, body);
    }
  })
};