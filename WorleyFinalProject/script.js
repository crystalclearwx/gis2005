mapboxgl.accessToken = 'pk.eyJ1IjoiY3dvcmxleWNyaWFkbyIsImEiOiJjbDdvMTVrdmgwbXl2M25udjhxdmswNm45In0.9x-iDqKgeW5YiqUSNij1UA';
var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/cworleycriado/clbbgd53t000114o87ubo3rra', // style URL
  center: [-106.124, 39.606],
  zoom: 7.9,
  cooperativeGestures: true
});

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
}));

// add zoom and navigation buttons
map.addControl(new mapboxgl.NavigationControl());

// enable scroll zoom with CTRL message
map.addControl(new mapboxgl.FullscreenControl());

map.addControl(new mapboxgl.AttributionControl({
  customAttribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}));

// Change the cursor to a pointer when the mouse is over a feature in the snowfall layer.
map.on('mouseenter', 'snowfall', () => {
  map.getCanvas().style.cursor = 'pointer';
});

// Change it back to an open hand when it leaves.
map.on('mouseleave', 'snowfall', () => {
  map.getCanvas().style.cursor = '';
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'coffee', () => {
  map.getCanvas().style.cursor = 'pointer';
});

// Change it back to an open hand when it leaves.
map.on('mouseleave', 'coffee', () => {
  map.getCanvas().style.cursor = '';
});

const frameCount = 5;
let currentImage = 0;

function getPath() {
  return `https://docs.mapbox.com/mapbox-gl-js/assets/radar${currentImage}.gif`;
}

map.on('load', () => {

  map.addLayer({
    'id': 'maptiler-winter',
    'type': 'raster',
    'source': {
      'type': 'raster',
      'tiles': [
        'https://api.maptiler.com/maps/winter-v2/256/{z}/{x}/{y}.png?key=XQzXchP2xtIV0RogNHYa'
      ],
      'tileSize': 256
    }
   }, 'coffee','snowfall');
});

map.on('load', () => {
  map.addSource('radar', {
    type: 'image',
    url: getPath(),
    coordinates: [
      [-107.266231, 40.535094],
      [-104.749342, 40.535094],
      [-104.749342, 39.024732],
      [-107.266231, 39.024732]
    ]
  });
  
  map.addLayer({
    id: 'radar-layer',
    'type': 'raster',
    'source': 'radar',
    'paint': {
      'raster-fade-duration': 0
    }
  });
  
  setInterval(() => {
    currentImage = (currentImage + 1) % frameCount;
    map.getSource('radar').updateImage({ url: getPath() });
  }, 200);
});

function loadFeatures() {
  coffeeFeatures = map.queryRenderedFeatures({
    layers:['coffee']});
}

// popup for snow reports
// When a click event occurs on a feature in the snowfall layer, open a popup at the
// location of the feature.
map.on('click', 'snowfall', (e) => {
  loadFeatures();
  let snowfallVertices = e.features[0].geometry.coordinates.slice();
  let coffeeFeatureCol = turf.featureCollection(coffeeFeatures);
  let point = turf.point(snowfallVertices,{name: 'snowfall-points'});
  let nearestPoint = turf.nearestPoint(point, coffeeFeatureCol);
  let distance = turf.distance(point, nearestPoint, {units: 'miles'});
  //console.log('Distance to closest food store: ' + distance.toFixed(2) + ' feet');
  
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML('<b>Report Source: </b>' + ' ' + e.features[0].properties.Report_Sou + '<br>' + '<b>Precipitation Type: </b>' + ' ' + e.features[0].properties.Precip_Typ + '<br>' + '<b>Measurement (in inches): </b>' + ' ' + e.features[0].properties.Measuremen + '<br>' + '<img src="images/coffee.png" width="12" height="12"> ' + '<b>Distance to closest coffee shop: </b>' + distance.toFixed(2) + ' miles')
    .addTo(map);
});

map.on('click', 'coffee', (e) => {
  loadFeatures();
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML('<b> Coffee Shop: </b>' + ' ' + e.features[0].properties.Name + '<br>' + '<b> Address: </b>' + ' ' + e.features[0].properties.Full_Addre)
    .addTo(map);
  });

function GoToAspen() {
  map.setCenter([-106.8175,39.1911]);
  map.setZoom(13);
}

function GoToBreck() {
  map.setCenter([-106.0384,39.4817]);
  map.setZoom(13);
}

function GoToCB() {
  map.setCenter([-106.9878,38.8697]);
  map.setZoom(13);
}

function GoToEstes() {
  map.setCenter([-105.5217,40.3772]);
  map.setZoom(13);
}

function GoToNed() {
  map.setCenter([-105.5108,39.9614]);
  map.setZoom(13);
}

function defaultMapview() {
  map.setCenter([-106.124, 39.606]);
  map.setZoom(7.9);
}