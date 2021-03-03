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
app.get('/getRate', (req, res) => res.render('pages/rate'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.post('/getRate', function (req, res) {
  var weight = Number(req.body.weight);
  var type = req.body.mail_type;
  var zone = req.body.zone;
  var rate = calculateRate(weight, type, zone);

  var params = {
    weight: weight,
    type: type,
    zone: zone,
    rate: rate
  };

  res.render('pages/rate', params);
})

function calculateRate(weight, type, zone) {
  var price;
  // read rates json
  var rawdata = fs.readFileSync('public/rates.json');
  var getRates = JSON.parse(rawdata);
  var rates = getRates[type];
  // type retail
  if (type == "retail") {
    for (var matchWeight in rates) {
      if (weight <= matchWeight) {
        var getZone = rates[matchWeight];
        for (var getRate in getZone) {
          if (zone <= getRate) {
            price = "$" + getZone[getRate];
            break;
          }
        }
        break;
      }
    }
    // type stamped, metered, or flat
  } else {
    for (var weightCost in rates) {
      if (weight <= weightCost) {
        price = "$" + rates[weightCost];
        break;
      } else {
        price = "Weight is over the limit for this type of mail.";
      }
    }
  }
  return price;
}