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
    zIndex: 0,
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

  const getPolygonAndCentreForPage = classlist => {
    if (classList.contains('map--confirm')) {
      return {
        polygon: undefined,
        center: ol.proj.fromLonLat([-2.574057, 53.380933])
      }
    } else if (classList.contains('map--fz1')) {
      return {
        polygon: new ol.geom.Polygon([[
          [-286174.43623254425,7053067.554461638],
          [-286017.1270941105,7053124.874194159],
          [-285979.7133411567,7053023.488355808],
          [-286138.86797365965,7052966.762035848],
          [-286174.43623254425,7053067.554461638]
        ]]),
        center: [-285799.8,7053023.498395808]
      }
    } else if (classList.contains('map--fz2')) {
      return {
        polygon: new ol.geom.Polygon([[
          [-287453.6950260728,7053547.81645298],
          [-287387.71521187964,7053471.082060037],
          [-287247.15437214554,7053574.344476758],
          [-287311.99951164605,7053657.167138065],
          [-287453.6950260728,7053547.81645298]
        ]]),
        center: [-287050.15437214554,7053574.344476758]
      }
    } else if (classList.contains('map--fz3')) {
      return {
        polygon: new ol.geom.Polygon([[
          [-286435.02510355425,7054885.783510737],
          [-286296.37422890955,7054878.498864598],
          [-286312.82934150315,7054656.417462274],
          [-286433.5187799759,7054664.330472198],
          [-286435.02510355425,7054885.783510737]
        ]]),
        center: ol.proj.fromLonLat([-2.570489, 53.385511])
      }
    } else if (classList.contains('map--fzd')) {
      return {
        polygon: new ol.geom.Polygon([[
          [-286799.37845813454,7053750.640779134],
          [-286757.7712044237,7053814.590622908],
          [-286630.3911880156,7053725.190187324],
          [-286660.58136806946,7053662.1983952755],
          [-286799.37845813454,7053750.640779134]
        ]]),
        center: [-286490.3911880156,7053725.190187324]
      }
    }
  }

  // polygonSource is the source for digitising (confirm-location)
  const polygonSource = new ol.source.Vector({ wrapX: false })

  let layers
  // If statement that changes the map layers on the confirm page
  // I need to look at pin location changes next.
  const classList = document.getElementById('map').classList
  const { polygon, center } = getPolygonAndCentreForPage(classList)
  if (classList.contains('map--confirm')) {
    // This Part is for any pages (just map--confirm in reality) that require digitising polygons
  // polygonLayer is the layer for digitising (confirm-location)
    const polygonLayer = new ol.layer.Vector({
      source: polygonSource,
      style: [polygonStyle, polygonVertexStyle]
    })
    layers = [baseMapLayer, polygonLayer]
  } else {
    // This Part is for any pages that require a static polygon
    const staticPolygonLayer = new ol.layer.Vector({
      ref: 'centre',
      visible: true,
      zIndex: 1,
      source: new ol.source.Vector({
        wrapX: false,
        features: [
          new ol.Feature({
            name: 'polygon',
            geometry: polygon
          })]
      }),
      style: [new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#B10E1E', width: 3 }),
        fill: new ol.style.Fill({ color: 'rgba(178, 17, 34, 0.1)' })
      })]
    })
    layers = [mapboxLayer, staticPolygonLayer]
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
  }
  // End of changes to make the polygon available

  const buttons = document.getElementsByName('delete-shape')
  if (buttons.length === 1) {
    buttons[0].addEventListener('click', function (event) {
      if (polygonSource.getFeatures().length === 1) {
        polygonSource.removeFeature(polygonSource.getFeatures()[0])
      }
      map.addInteraction(draw)
    })
  }

  // EVENT HANDLER FOR CUSTOM DETAILS COMPONENT
  $('.map-toggle').on('click', function (e) {
    e.preventDefault()
    $(this).toggleClass('active')
  })
})
