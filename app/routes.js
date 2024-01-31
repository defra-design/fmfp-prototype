// routes.js

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


// Add your routes here

// CLEAR SESSION ==============================================================
router.get('/cls', function (req, res) {
	req.session.destroy()
	res.render('index')
  })
  // CLEAR SESSION GO TO MAP SELECT ==============================================================
router.get('/clsmap', function (req, res) {
	req.session.destroy()
	res.redirect('test-2_8/maps/zones')
  })

// set up route variable default status
router.get('/rflood_O1', function (req, res) {
	req.session.data = { recorded_flood: 'option1' }
	res.redirect(`/v1/recorded_flood`)
})

// set up route variable default status
router.get('/rflood_O2', function (req, res) {
	req.session.data = { recorded_flood: 'option2' }
	res.redirect(`/v1/recorded_flood`)
})

// set up route variable default status
router.get('/rflood_O3', function (req, res) {
	req.session.data = { recorded_flood: 'option3' }
	res.redirect(`/v1/recorded_flood`)
})

// set up route variable default status
router.get('/AEPs_O1', function (req, res) {
	req.session.data = { aep_option: 'option1' }
	res.redirect(`/v1/P4AEP`)
})

// set up route variable default status
router.get('/AEPs_v2', function (req, res) {
	req.session.data = { chooseptype: 'aepv2' }
	res.redirect(`/v2/P4AEP`)
})

// set up route variable default status
router.get('/rflood_v2', function (req, res) {
	req.session.data = { chooseptype: 'historicv2' }
	res.redirect(`/v2/recorded_flood`)
})

// set up route variable default status
router.get('/AEPs_O2', function (req, res) {
	req.session.data = { aep_option: 'option2' }
	res.redirect(`/v1/P4AEP`)
})

// set up route variable default status
router.get('/AEPs_O3', function (req, res) {
	req.session.data = { aep_option: 'option3' }
	res.redirect(`/v1/P4AEP`)
})

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
      res.redirect("/v2/P4AEP")
    } else {
      res.redirect("options")
    }
  })
  

// Area of P4 for usability testing ==============================================================
router.get('/v2/area', function (req, res) {
  res.render('v2/area',{
      "formAction":"/v2/area-check"
  })
})

router.post('/v2/area', function (req, res) {
  res.render('/v2/area',{
      "formAction":"/v2/area-check"
  })
})

// Route to check if address or area has been selected
router.post('/v2/area-check', function (req, res) {

  if (req.body['chooseptype']=="aepv2") {
    res.redirect("P4AEP")
  } else {
    res.redirect("recorded_flood")
  }
})

// From flood zones map to select options map page ==============================================================
router.get('/test-2_8/maps/zones', function (req, res) {
  res.render('test-2_8/maps/zones',{
      "formAction":"/test-2_8/maps/zones-check"
  })
})

router.post('/test-2_8/maps/zones', function (req, res) {
  res.render('/test-2_8/maps/zones',{
      "formAction":"/test-2_8/maps/zones-check"
  })
})

// Route to check if there has been a selection
router.post('/test-2_8/maps/zones-check', function (req, res) {
  res.redirect("/test-2_8/maps/selection");
})


// From flood selection map to select options displayed ==============================================================
router.get('/test-2_8/maps/selection', function (req, res) {
  res.render('test-2_8/maps/selection',{
      "formAction":"/test-2_8/maps/selection-check"
  })
})

router.post('/test-2_8/maps/selection', function (req, res) {
  res.render('/test-2_8/maps/selection',{
      "formAction":"/test-2_8/maps/selection-check"
  })
})

// Route to check if there has been a selection
router.post('/test-2_8/maps/selection-check', function (req, res) {

  if (req.body['chooseptype']=="tidal") {
    res.redirect("/test-2_8/maps/selection")
  } else {
    res.redirect("/test-2_8/maps/selection")
  }
})

module.exports = router