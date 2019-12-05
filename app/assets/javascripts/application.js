/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()


  var baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  var map = new ol.Map({
    target: 'map',
    layers: [ baseMapLayer],
    view: new ol.View({
            center: ol.proj.fromLonLat([0.90401, 51.80645]),
            zoom: 16 //Initial Zoom Level
          })
  });
  //Adding a marker on the map
  var marker = new ol.Feature({
    geometry: new ol.geom.Point(
      ol.proj.fromLonLat([0.90401, 51.80645]) // postcode CO5 7QG
    ),
  });

  marker.setStyle(new ol.style.Style({
          image: new ol.style.Icon(({
              crossOrigin: 'anonymous',
              src: '/public/images/pin.png'
          }))
      }));

  var vectorSource = new ol.source.Vector({
    features: [marker]
  });
  var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
  });
  map.addLayer(markerVectorLayer);




})
