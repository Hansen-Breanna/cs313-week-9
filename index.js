const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const fs = require('fs');
const app = express()
app.use(express.urlencoded({
  extended: true
}))

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/rate', (req, res) => res.render('pages/rate'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.post('/getRate', function (req, res) {
  var weight = Number(req.body.weight);
  var type = req.body.mail_type;
  var zone = req.body.zone;
  var rate = calculateRate(weight, type, zone);

  var params = {
    weight: weight,
    type: type,
    rate: rate
  };

  res.render('pages/rate', params);
})

function calculateRate(weight, type, zone) {
  var price;
  var rate;
  if (type == "stamped") {
    rate = {1:.55 , 2:.75 , 3:.95 , 3.5:1.15};
  } else if (type == "metered") {
    rate = {1:.51 , 2:.71 , 3:.91 , 3.5:1.11};
  } else if (type == "flat") {
    rate = {1:"1.00", 2:"1.20", 3:"1.40", 4:"1.60", 5:"1.80", 6:"2.00", 7:"2.20", 8:"2.40", 9:"2.60",
      10:"2.80", 11:"3.00", 12:"3.20", 13:"3.40"};
  } 
  for (var cost in rate) {
    if (weight <= cost) {
      price = "$" + rate[cost];
      break;
    } else {
      price = "Weight is over the limit for this type of mail.";
    }
  }

  if (type == "retail") {
    var rawdata = fs.readFileSync('public/retail.json');
    var zoneRate = JSON.parse(rawdata);
    for (var getZone in zoneRate) {
      if (zone == getZone) {
        var newZone = zoneRate[getZone];
        for (var rate in newZone) {
          if (weight <= rate) {
            price = "$" + newZone[rate];
            break;
          }
        }
      }
    }
  return price;
  }
}