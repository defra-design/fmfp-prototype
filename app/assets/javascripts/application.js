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

  var mapboxLayer = new ol.layer.MapboxVector ({
    styleUrl: 'mapbox://styles/ant-defra/cknou8uzf5hfw17qzo0076s58',
    accessToken:
      'pk.eyJ1IjoiYW50LWRlZnJhIiwiYSI6ImNrbmtkaDEyMzA2emQycHFsOW04YjB1eWkifQ.NR7GSXgdwmFKZzLwSti3uA',
  });

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



  // If statement that changes the map layers on the confirm page
  // I need to look at pin location changes next.
  if(document.getElementById("map").classList.contains("map--confirm")){
    var map = new ol.Map({
      target: 'map',
      layers: [ baseMapLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.571657, 53.381048]),
        zoom: 15, //Initial Zoom Level
        maxZoom: 17
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  } else if (document.getElementById("map").classList.contains("map--fz1")) {
    var map = new ol.Map({
      target: 'map',
      // controls: ol.control.defaults().extend([
      //   new ol.control.FullScreen({
      //     label: 'Full screen \u2922'
      //   })
      // ]),
      layers: [ mapboxLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.564057, 53.378333]),
        zoom: 15 //Initial Zoom Level
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  }
  else if (document.getElementById("map").classList.contains("map--fz3")) {
    var map = new ol.Map({
      target: 'map',
      // controls: ol.control.defaults().extend([
      //   new ol.control.FullScreen({
      //     label: 'Full screen \u2922'
      //   })
      // ]),
      layers: [ mapboxLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.570489, 53.385511]),
        zoom: 15 //Initial Zoom Level
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  }
  else if (document.getElementById("map").classList.contains("map--fzd")) {
    var map = new ol.Map({
      target: 'map',
      // controls: ol.control.defaults().extend([
      //   new ol.control.FullScreen({
      //     label: 'Full screen \u2922'
      //   })
      // ]),
      layers: [ mapboxLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.576372, 53.382467]),
        zoom: 15 //Initial Zoom Level
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  }
  else {
    //Swaps the map to the FLood Zone Layers from Mapbox Studio
    var map = new ol.Map({
      target: 'map',
      layers: [ mapboxLayer, polygonLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-2.571657, 53.381048]),
        zoom: 15 //Initial Zoom Level
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    });
  }

  // Adding a marker on the map

  if (document.getElementById("map").classList.contains("map--fzd")){
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-2.580372, 53.382467])
      ),
    });
  } else if (document.getElementById("map").classList.contains("map--fz3")) {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-2.573489, 53.385511])
      ),
    });
  } else if (document.getElementById("map").classList.contains("map--fz1")) {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-2.566257, 53.378333])
      ),
    });
  } else {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-2.571657, 53.381048])
      ),
    });
  }

  marker.setStyle(new ol.style.Style({
    image: new ol.style.Icon(({
      crossOrigin: 'anonymous',
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
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





  /////// POLYGON STUF ///////

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


  // EVENT HANDLER FOR CUSTOM DETAILS COMPONENT
  $('.map-toggle').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
  });

  // STUFF FOR THE MODAL //

  $('.govuk-button--pdf-download').on('click', function(e) {
    e.preventDefault();
    $('.dialog').toggleClass('is-visible');
    $('.dialog').find('#dialog-main').focus();
  });

  $('.dialog-cancel').on('click', function(e) {
    e.preventDefault();
    $('.dialog').toggleClass('is-visible');
  });

  $('.dialog-close').on('click', function(e) {
    e.preventDefault();
    $('.dialog').toggleClass('is-visible');
  });

  $(document).keydown(function(event) {
  if ((event.keyCode == 27) && $('.dialog').hasClass('is-visible')) {
    $('.dialog').toggleClass('is-visible');
  }

});

  // add all the elements inside modal which you want to make focusable
  const  focusableElements =
      'button, [href], input, select, [tabindex]:not([tabindex="-1"])';
  const modal = document.querySelector('#dialog-main'); // select the modal by it's id

  const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
  const focusableContent = modal.querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal


  document.addEventListener('keydown', function(e) {
    let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) { // if shift key pressed for shift + tab combination
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus(); // add focus for the last focusable element
        e.preventDefault();
      }
    } else { // if tab key is pressed
      if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
        firstFocusableElement.focus(); // add focus for the first focusable element
        e.preventDefault();
      }
    }
  });

  firstFocusableElement.focus();

})
