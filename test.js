var IBMi = require('./index');

hello();

async function hello() {
  console.log('hi');

  var myibmi = new IBMi('http://10.1.31.153:8008');

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

  var actions = [];
  actions.push(myibmi.executeSQL("select * from product where manuID = 'SAMSUNG'"));
  actions.push(myibmi.callProgram(['barry', 'fak100'], fak100parms));
  actions.push(myibmi.sendDataQueue(['barry', 'testdq'], "This is my fucking test!!!!!!!", null));
  actions.push(myibmi.popDataQueue(['barry', 'testdq'], {}));

  console.log(await myibmi.send(actions));
}