/* global $, ol */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()

  const baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  })

  const mapboxLayer = new ol.layer.MapboxVector({
    styleUrl: 'mapbox://styles/ant-defra/cknou8uzf5hfw17qzo0076s58',
    accessToken:
      'pk.eyJ1IjoiYW50LWRlZnJhIiwiYSI6ImNrbmtkaDEyMzA2emQycHFsOW04YjB1eWkifQ.NR7GSXgdwmFKZzLwSti3uA'
  })

  const polygonStyle = new ol.style.Style({
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
  })

  const polygonVertexStyle = new ol.style.Style({
    image: new ol.style.Icon({
      opacity: 1,
      size: [32, 32],
      scale: 0.5,
      src: 'public/images/map-draw-cursor-2x.png'
    }),

    // Return the coordinates of the first ring of the polygon
    geometry: function (feature) {
      if (feature.getGeometry().getType() === 'Polygon') {
        const coordinates = feature.getGeometry().getCoordinates()[0]
        return new ol.geom.MultiPoint(coordinates)
      } else {
        return null
      }
    }
  })

  const polygonSource = new ol.source.Vector({ wrapX: false })
  const polygonLayer = new ol.layer.Vector({
    source: polygonSource,
    style: [polygonStyle, polygonVertexStyle]
  })

  let layers
  let center
  // If statement that changes the map layers on the confirm page
  // I need to look at pin location changes next.
  const classList = document.getElementById('map').classList
  if (classList.contains('map--confirm')) {
    layers = [baseMapLayer, polygonLayer]
    center = ol.proj.fromLonLat([-2.564057, 53.378333])
  } else {
    layers = [mapboxLayer, polygonLayer]
    center = ol.proj.fromLonLat([-2.564057, 53.378333])
  }
  // Swaps the map to the FLood Zone Layers from Mapbox Studio
  const map = new ol.Map({
    target: 'map',
    layers,
    view: new ol.View({
      center,
      zoom: 15 // Initial Zoom Level
    }),
    interactions: ol.interaction.defaults({
      altShiftDragRotate: false,
      pinchRotate: false
    })
  })

  // Modify polygon drawing style
  const modifyStyle = new ol.style.Style({
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
  })

  const modify = new ol.interaction.Modify({
    source: polygonSource,
    style: modifyStyle
  })

  // Draw polygon drawing style
  const drawStyle = new ol.style.Style({
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
  })

  const draw = new ol.interaction.Draw({
    source: polygonSource,
    type: 'Polygon',
    style: drawStyle
  })

  draw.on('drawend', function (e) {
    const coordinates = e.feature.getGeometry().getCoordinates()[0]
    if (coordinates.length >= 4) {
      setTimeout(function () {
        map.removeInteraction(draw)
      }, 500)
    }
  })

  const snap = new ol.interaction.Snap({
    source: polygonSource
  })

  function addInteractions () {
    map.addInteraction(draw)
    map.addInteraction(modify)
    map.addInteraction(snap)
  }

  // Changes to make the polygon available
  if (document.getElementById('map').classList.contains('map--justboundary')) {
    addInteractions()
    document.getElementById('deleteShapeBtn').disabled = false
    polygonLayer.setVisible(true)
  }
  // End of changes to make the polygon available

  const buttons = document.getElementsByName('delete-shape')
  if (buttons.length === 1) {
    buttons[0].addEventListener('click', function (event) {
      if (polygonSource.getFeatures().length === 1) {
        polygonSource.removeFeature(polygonSource.getFeatures()[0])
      }
      map.addInteraction(draw)
      document.getElementById('draw-shape').focus()
    })
  }

  // EVENT HANDLER FOR CUSTOM DETAILS COMPONENT
  $('.map-toggle').on('click', function (e) {
    e.preventDefault()
    $(this).toggleClass('active')
  })
})
