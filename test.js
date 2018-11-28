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

  var actions = [
    myibmi.executeSQL("select * from product where manuID = 'SAMSUNG'"),
    myibmi.callProgram(['barry', 'fak100'], fak100parms),
    myibmi.sendDataQueue(['barry', 'testdq'], "This is my test: " + (new Date().getTime())),
    myibmi.popDataQueue(['barry', 'testdq']),
    myibmi.executeSQL("delete from product where prodkey = 880", IBMi.SQL_EXEC())
  ];

  console.log(await myibmi.send(actions));

  console.log('end');
}