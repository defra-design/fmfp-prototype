//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

    // Area of P4 for usability testing ==============================================================

    router.get('/P4testingv1/area', function (req, res) {
        res.render('P4testingv1/area',{
            "formAction":"/P4testingv1/area-check"
        })
      })
    
      router.post('/P4testingv1/area', function (req, res) {
        res.render('/P4testingv1/area',{
            "formAction":"/P4testingv1/area-check"
        })
      })
      
      // Route to check if address or area has been selected
      router.post('/P4testingv1/area-check', function (req, res) {
      
        if (req.body['chooseptype']=="tidal") {
          res.redirect("tidal")
        } else {
          res.redirect("options")
        }
      })

