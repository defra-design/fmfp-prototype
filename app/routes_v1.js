const express = require('express');
const router = express.Router();

var folder = "v1";
var servicename = "Flood map for planning";

// Add your routes here

// Area of P4 for usability testing ==============================================================
router.get('/v1/area', function (req, res) {
  res.render('v1/area',{
      "formAction":"/v1/area-check"
  })
})

router.post('/v1/area', function (req, res) {
  res.render('/v1/area',{
      "formAction":"/v1/area-check"
  })
})

// Route to check if address or area has been selected
router.post('/v1/area-check', function (req, res) {

  if (req.body['chooseptype']=="tidal") {
    res.redirect("tidal")
  } else {
    res.redirect("options")
  }
})

module.exports = router;
