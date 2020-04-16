/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()

  var polygonStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new ol.style.Stroke({
      color: '#B10E1E',
      width: 3
    }),
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: 'public/images/map-draw-cursor-2x.png'
    })
  });

  var polygonVertexStyle = new ol.style.Style({
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: 'public/images/map-draw-cursor-2x.png'
    }),
    // Return the coordinates of the first ring of the polygon
    geometry: function (feature) {
      if (feature.getGeometry().getType() === 'Polygon') {
        var coordinates = feature.getGeometry().getCoordinates()[0]
        return new ol.geom.MultiPoint(coordinates)
      } else {
        return null
      }
    }
  });

  var polygonSource = new ol.source.Vector({wrapX: false});
  var polygonLayer = new ol.layer.Vector({
    source: polygonSource,
    style: [polygonStyle, polygonVertexStyle]
  });

  var baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  var map = new ol.Map({
    target: 'map',
    layers: [baseMapLayer, polygonLayer],
    view: new ol.View({
      center: ol.proj.fromLonLat([0.90401, 51.80645]),
      zoom: 15 //Initial Zoom Level
    }),
    interactions: ol.interaction.defaults({
      altShiftDragRotate: false,
      pinchRotate: false
    })
  });

  // Adding a marker on the map
  var marker = new ol.Feature({
    geometry: new ol.geom.Point(
      ol.proj.fromLonLat([0.90401, 51.80645]) // postcode CO5 7QG
    ),
  });

  marker.setStyle(new ol.style.Style({
    image: new ol.style.Icon(({
      crossOrigin: 'anonymous',
      src: '/public/images/iconfinder_marker.png'
    }))
  }));

  var markerSource = new ol.source.Vector({
    features: [marker]
  });

  var markerLayer = new ol.layer.Vector({
    source: markerSource,
  });
  map.addLayer(markerLayer);

  // Click handler for pointer
  map.on('singleclick', function (e) {
    if (markerLayer.getVisible() === true) {
      var point = markerSource.getFeatures()[0];
      point.getGeometry().setCoordinates([e.coordinate[0], e.coordinate[1]])
    }
  })

  // Modify polygon drawing style
  var modifyStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new ol.style.Stroke({
      color: '#FFBF47',
      width: 3
    }),
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: '/public/images/map-draw-cursor-2x.png'
    })
  });

  var modify = new ol.interaction.Modify({
    source: polygonSource,
    style: modifyStyle
  });

  // Draw polygon drawing style
  var drawStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new ol.style.Stroke({
      color: '#005EA5',
      width: 3
    }),
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: '/public/images/map-draw-cursor-2x.png'
    })
  });

  var draw = new ol.interaction.Draw({
    source: polygonSource,
    type: 'Polygon',
    style: drawStyle
  });

  draw.on('drawend', function (e) {
    var coordinates = e.feature.getGeometry().getCoordinates()[0]
    if (coordinates.length >= 4) {
      setTimeout(function () {
        map.removeInteraction(draw)
      }, 500);
    }
  });

  var snap = new ol.interaction.Snap({
    source: polygonSource
  });

  function addInteractions() {
    if (polygonSource.getFeatures().length === 0) {
      map.addInteraction(draw);
    }
    map.addInteraction(modify);
    map.addInteraction(snap);
  }

  function removeInteractions() {
    map.removeInteraction(draw);
    map.removeInteraction(modify);
    map.removeInteraction(snap);
  }

  var radios = document.getElementsByName('marker-or-shape');
  for (var i = 0, length = radios.length; i < length; i++) {
    radios[i].addEventListener('click', function(event) {

      var deleteBtn = document.getElementById("deleteShapeBtn");

      if (this.value == 'draw-shape') {
        addInteractions();
        deleteBtn.disabled = false;
        polygonLayer.setVisible(true);
        markerLayer.setVisible(false);
      } else if (this.value == 'delete-shape' &&
        polygonSource.getFeatures().length === 1) {
          polygonSource.removeFeature(polygonSource.getFeatures()[0]);
      } else if (this.value === 'move-marker') {
        removeInteractions();
        deleteBtn.disabled = true;
        polygonLayer.setVisible(false);
        markerLayer.setVisible(true);
      }
    }, false);
  }

  var buttons = document.getElementsByName('delete-shape');
  if (buttons.length === 1) {
    buttons[0].addEventListener('click', function(event) {
      if (polygonSource.getFeatures().length === 1) {
          polygonSource.removeFeature(polygonSource.getFeatures()[0]);
      }

      map.addInteraction(draw);
      document.getElementById("draw-shape").focus();

    });
  }

// DRAGGABLE MARKER
  var translate1 = new ol.interaction.Translate({
  	features: new ol.Collection([marker])
  });
  map.addInteraction(translate1);

  map.on('pointermove', function(e) {
    if (e.dragging) return;
    var hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });
//////////////////////

})
