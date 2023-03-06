mapboxgl.accessToken = 'pk.eyJ1IjoiY3dvcmxleWNyaWFkbyIsImEiOiJjbDdvMTVrdmgwbXl2M25udjhxdmswNm45In0.9x-iDqKgeW5YiqUSNij1UA';
var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/cworleycriado/cl9x1j6bk000k15nxuqgqff1b', // style URL
  center: [-104.88799, 39.78023],
  zoom: 13
});

map.on('load', () => {

  map.addLayer({
    'id': 'openmaps-basemap',
    'type': 'raster',
    'source': {
      'type': 'raster',
      'tiles': [
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      'tileSize': 256
    }
  }, 'denver-buildings', 'denver-food-stores');
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
// Add custom attribution for grocery icons
map.addControl(new mapboxgl.AttributionControl({
  customAttribution: 'Icons from www.flaticon.com licensed by CC 3.0'
}));

// Change the cursor to a crosshair when the mouse is over the places layer.
map.on('mouseenter', 'denver-buildings', () => {
  map.getCanvas().style.cursor = 'crosshair';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'denver-buildings', () => {
  map.getCanvas().style.cursor = '';
});

// Set the features of the food stores layer to a global variable.
var foodFeatures = [];

function loadFeatures() {
  foodFeatures = map.queryRenderedFeatures({
    layers:['denver-food-stores']});
}

// popup for buildings
// When a click event occurs on a feature in the Buildings layer, open a popup at the
// location of the feature.
map.on('click', 'denver-buildings', (e) => {
  loadFeatures();
  let buildingVertices = e.features[0].geometry.coordinates.slice();
  let foodFeatureCol = turf.featureCollection(foodFeatures);
  let polygon = turf.polygon(buildingVertices,{name: 'building-polygon'});
  let buildingCentroid = turf.centroid(polygon);
  let nearestPoint = turf.nearestPoint(buildingCentroid, foodFeatureCol);
  let distance = turf.distance(buildingCentroid, nearestPoint, {units: 'feet'});
  //console.log('Distance to closest food store: ' + distance.toFixed(2) + ' feet');
  
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML('<b>Building ID: </b>' + ' ' + e.features[0].properties.id + '<br>' + '<b>Building Type: </b>' + e.features[0].properties.type + '<br>' + '<img src="images/groceries.svg" width="12" height="12"> ' + '<b>Distance to closest food store: </b>' + distance.toFixed(2) + ' feet')
    .addTo(map);
});

var chkBuildingsElement = document.getElementById("denver-buildings");

var chkFoodStoresElement = document.getElementById("denver-food-stores");

chkBuildingsElement.onclick = function(e) {
  console.log("Buildings layer checked");
  visibilityToggle(e)
}

chkFoodStoresElement.onclick = function(e) {
  console.log("Food Stores layer checked");
  var isChecked = e.target.checked;
  if (isChecked) {
    map.setLayoutProperty('denver-food-stores', 'visibility', 'visible');
  } else {
    map.setLayoutProperty('denver-food-stores', 'visibility', 'none');
  }
}

function visibilityToggle(e) {
  var isChecked = e.target.checked;
  console.log("id: " + e.target.id);
  if (isChecked) {
    map.setLayoutProperty(e.target.id, 'visibility', 'visible');
  } else {
    map.setLayoutProperty(e.target.id, 'visibility', 'none');
  }
}
