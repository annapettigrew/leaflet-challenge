
// Storing the API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Performing a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  

// Creating a pop ip with more information about the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

  }

  function createCircleMarker(feature, latlng){
    let options = {
     radius:feature.properties.mag*5,
     fillColor: chooseColor(feature.properties.mag),
     color: chooseColor(feature.properties.mag),
     weight: 1,
     opacity: 0.8,
     fillOpacity: 0.35
    } 
    return L.circleMarker(latlng,options);
  }

// Creating a layer that contains the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

// Creating the map
  createMap(earthquakes);
}

// Adding the color to the circle markers
function chooseColor(mag){
  switch(true){
      case(0.0 <= mag && mag <= 2.5):
          return "#8FBC8F";
      case (2.5 <= mag && mag <=4.0):
          return "#698B69";
      case (4.0 <= mag && mag <=5.5):
          return "#FF7F24";
      case (5.5 <= mag && mag <= 8.0):
          return "#FF8C00";
      case (8.0 <= mag && mag <=20.0):
          return "#8A3324";
      default:
          return "#8B2323";
  }
}
// Creating Legend Layer
var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
 
  var grades = [0, 2.5 ,4.0, 5.5, 8.0, 20.0];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += 
    "<i style='background: " + chooseColor(grades[i]+ 1) + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
return div;
};


function createMap(earthquakes) {

// Creating the base layers.

  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  
// Creating basemaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

// holding the overlay
  var overlayMaps = {
    Earthquakes: earthquakes
  };

// Creating the map giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Creating a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
legend.addTo(myMap);
}

