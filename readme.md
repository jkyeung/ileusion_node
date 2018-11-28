## ILEusion Node.js module

This is the Node.js module for ILEusion. It allows for interaction with an IBM i over the HTTP layer.

## APIs

### `IBMi()` constructor

```js
var IBMi = require('ileusion');
var address = 'someibmi:8008'; //ILEusion server address

var myibmi = new IBMi(address);
```

---

### `Promise IBMi#send(actions)`

Send an array of transactions to the ILEusion server to processed one after another.

Returns an array that matches the length of transactions count passed in. Check for `body[x].success === false` to determine whether one of the transactions failed. There will also be a `message` atrribute when it is not successful.

```js
var myibmi = new IBMi(address);

var transactions = []; //To be populated.

await myibmi.send(transactions);
```

---

### `object IBMi#executeSQL(string, mode)`

Execute an SQL statement on the the remote server.

1. The SQL statement.
2. The mode of execution. `IBMi.SQL_SELECT()` (or `1`) to fetch data (`select`) from the server, or `IBMi.SQL_EXEC()` (`2`) to execute any other statements. The default is `1`.

```js
transactions.push(myibmi.executeSQL("select * from mytable where u_id = 1"));
transactions.push(myibmi.executeSQL("delete from product where prodkey = 880", IBMi.SQL_EXEC()));
```

---

### `object IBMi#callProgram(path, parameters)`

Call a program on the remote server.

1. An array with the path to the object: `[library, object]`
2. An array of objects which specify the parameters. Each object requires `type` and `length`. Then also `value` for a single value or `values` (array) for a parameter with multiple dimentions (`dim`/`[]`).

Returns a JSON transaction object.

```js
var fak100parms = [
  {
    type: 'char',
    length: 20,
    value: 'Dave'
  },
  {
    type: 'int',
    length: 10,
    value: 6
  },
  {
    type: 'int',
    length: 10,
    value: 7
  },
  {
    type: 'int',
    length: 10,
    value: 0
  }
];

transactions.push(myibmi.callProgram(['barry', 'fak100'], fak100parms));
```

---

### `object IBMi#sendDataQueue(path, value, key)`

Push a value to a data queue on the remote server.

1. An array with the path to the object: `[library, object]`
2. The string value which will be pushed.
3. The string key which will be used for the value.

Returns a JSON transaction object.

```js
transactions.push(myibmi.sendDataQueue(['barry', 'testdq'], "This is my test: " + (new Date().getTime())));
```

---

### `object IBMi#popDataQueue(path, options)`

Fetch the next value from a data queue on the remote server.

1. An array with the path to the object: `[library, object]`
2. Options object with the following keys: `waittime` (number), two-character `keyorder` and `key` string.

Returns a JSON transaction object.

```js
transactions.push(myibmi.popDataQueue(['barry', 'testdq']));
```

---

### `object IBMi#CL(string)`

Execute a CL command on the remote server.


Returns a JSON transaction object.

```js
transactions.push(myibmi.CL("addliliohls"));
transactions.push(myibmi.CL("addlible systools"));
```
