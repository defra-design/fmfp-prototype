/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()



  var source = new ol.source.Vector({wrapX: false});
  var vector = new ol.layer.Vector({
    source: source
  });

  var baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  var map = new ol.Map({
    target: 'map',
    layers: [ baseMapLayer, vector],
    view: new ol.View({
            center: ol.proj.fromLonLat([0.90401, 51.80645]),
            zoom: 15 //Initial Zoom Level
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


  var typeSelect = document.getElementById('type');

  var draw; // global so we can remove it later
  // function addInteraction() {
  //   var value = typeSelect.value;
  //   if (value !== 'None') {
  //     draw = new ol.interaction.Draw({
  //       source: source,
  //       type: 'Polygon'
  //     });
  //     map.addInteraction(draw);
  //   }
  // }

  function addInteraction() {

      draw = new ol.interaction.Draw({
        source: source,
        type: 'Polygon'
      });
      map.addInteraction(draw);

  }


  var drawShapeBtn = document.getElementById('drawShapeBtn');
  var markerBtn = document.getElementById('markerBtn');

  drawShapeBtn.addEventListener('click', function (event) {
    if ( this.classList.contains('active') ) {
      this.classList.remove('active')
      map.removeInteraction(draw);
      vector.setVisible(false);
      markerVectorLayer.setVisible(true);
    } else {
      this.className += " active";
      map.removeInteraction(draw);
      addInteraction();
      vector.setVisible(true);
      markerVectorLayer.setVisible(false);
    }
  }, false);

  markerBtn.addEventListener('click', function (event) {
    if ( this.classList.contains('active') ) {
      this.classList.remove('active')
      markerVectorLayer.setVisible(false);
    } else {
      this.className += " active";
      markerVectorLayer.setVisible(true);
      map.removeInteraction(draw);
    }
  }, false);









  


})
