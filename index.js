
var request = require('request');

module.exports = class IBMi {
  constructor(server) {
    this.url = server;
  }

  executeSQL(statement, callback) {
    sendRequest(this.url + '/sql', {
      query: statement
    }, callback);
  }

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

    return function(args, callback) {
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

  callProgram(path, args, callback) {
    var theFunc = this.constructCall(path, undefined, args);

    theFunc(null, callback);
  }

  callFunction(path, returnType, args, callback) {
    var theFunc = this.constructCall(path, returnType, args);

    theFunc(null, callback);
  }

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

  popDataQueue(path, props, callback) {
    var body = {
      library: path[0].toUpperCase(),
      object: path[1].toUpperCase(),
      waitime: 0
    };

    if (props.waittime !== undefined)
      body.waitime = props.waittime;

    if (props.keyorder !== undefined)
      body.keyorder = props.keyorder;

    if (props.key !== undefined)
      body.key = key;

    sendRequest(this.url + '/dq/pop', body, callback);
  }
}

function sendRequest(endpoint, jsonBody, callback) {
  request({method: 'post', body: jsonBody, json: true, url: endpoint}, function (err, res, body) {
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