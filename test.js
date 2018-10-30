var IBMi = require('.');

var myibmi = new IBMi('http://10.1.31.153:8008');

var fak100parms = [{
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

myibmi.executeSQL("select * from product where manuID = 'SAMSUNG'", function (err, res) {
  if (err) {
    console.log(err)
  } else {
    console.log(res);
  }
});

var fak100 = myibmi.constructCall(['barry', 'fak100'], null, fak100parms);

fak100(["Barry", 443, 4], function(err, res) {
  console.log(res);
});

myibmi.sendDataQueue(['barry', 'testdq'], "This is my fucking test!!!!!!!", null, function(err, res) {
  console.log(res);
  myibmi.popDataQueue(['barry', 'testdq'], {}, function(err, res) {
    console.log(res);
  })
});

// myibmi.sendDataQueue(['barry', 'testdq'], "Hello world!!!", null, function(err, res) {
//   console.log(res);
// });

// myibmi.popDataQueue(['barry', 'testdq'], "Hello world!!!", null, function(err, res) {
//   console.log(res);
// });