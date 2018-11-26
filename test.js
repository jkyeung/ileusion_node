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

  console.log(await myibmi.executeSQL("select * from product where manuID = 'SAMSUNG'"));

  var fak100 = myibmi.constructCall(['barry', 'fak100'], null, fak100parms);
  console.log(await fak100(["Barry", 443, 4]));

  console.log(await myibmi.sendDataQueue(['barry', 'testdq'], "This is my fucking test!!!!!!!", null));
  console.log(await myibmi.popDataQueue(['barry', 'testdq'], {}));
}