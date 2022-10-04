// store API endpoint using queryURL
var eq_sevenday = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
var plate_data = 'static/js/plate_data.json'

// layer option 1: light mode
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    //accessToken: API_KEY removed for security
});

// layer option 2: dark mode
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    //accessToken: API_KEY removed for security
});

// layer option 3: satelite street mode
let satelite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    //accessToken: API_KEY removed for security
});

// create the map object with center, zoom level and default layer.
let map = L.map('map', {
    center: [25, 0],
    zoom: 2.5,
    layers: [satelite]
});

// create a base layer to hold all three maps
let base_maps = {
    'Satelite View': satelite,
    'Light Mode': light,
    'Dark Mode': dark
};

// 1. add a second layer for earthquake and tectonic plate data
let all_earthquakes = new L.LayerGroup();
let tectonic_plates = new L.LayerGroup();

// 2. add to the overlays object.
let overlays = {
    'Earthquakes': all_earthquakes,
    'Tectonic Plates': tectonic_plates,
};

// add a control to the map that allows the user to change which layers are visible
L.control.layers(base_maps, overlays).addTo(map);

// retrive Tectonic Plate geoJSON data.
d3.json(plate_data).then(function (tect_data) {
    L.geoJson(tect_data, {
        color: "orange",
        weight: 2
    })
        .addTo(tectonic_plates);

    // add the tectonicplates layer to the map.
    tectonic_plates.addTo(map);
});

// retreive the earthquake GeoJSON data from USGS, 7-day (variable URL set at line 2) and set style
d3.json(eq_sevenday).then(function (data) {
    function style(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: get_color(feature.properties.sig),
            color: '#000000',
            radius: get_radius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };

    function get_radius(magnitude) {
        // magnitude ranges from -1 to 10
        // magnitude radius scaled based on mag value multiplied by 1 plus the ratio of the value plus two divided by 6
        // this is done to give a better scale of the magnitude than just multiplying the mag by a flat value
        return magnitude * (1 + (((magnitude + 2) / 6)))
    };

    function get_color(significance) {
        // significance ranges from 0 to 1000 
        if (significance > 900) {
            return 'rgb(217,33,32)';
        }
        if (significance > 800) {
            return 'rgb(230,100,44)';
        }
        if (significance > 700) {
            return 'rgb(230,142,52)';
        }
        if (significance > 600) {
            return 'rgb(217,173,60)';
        }
        if (significance > 500) {
            return 'rgb(181,189,76)';
        }
        if (significance > 400) {
            return 'rgb(127,185,114)';
        }
        if (significance > 300) {
            return 'rgb(99,173,153)';
        }
        if (significance > 200) {
            return 'rgb(85,161,177)';
        }
        if (significance >= 100) {
            return 'rgb(72,139,194)';
        }
        if (significance >= 0) {
            return 'rgb(64,101,177)';
        }
    }

    L.geoJson(data, {
        // create the circles on the map based on lat/lng
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // return the marker style
        style: style,
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h3>' + feature.properties.place +
                '</h3><hr><p>' + new Date(feature.properties.time) + '</p>' +
                '<span><p><b>Magnitude: </b>' + feature.properties.mag + '</span><br>' +
                '<span><b>Significance: </b>' + feature.properties.sig + '</span><br>' +
                '<span><b>Depth: </b>' + feature.geometry.coordinates[2]);
        }
    }).addTo(all_earthquakes);

    // add the earthquake layer to map.
    all_earthquakes.addTo(map);

    // add horizontal legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            significance = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900],
            labels = [];
        div.innerHTML += "<h2>Significance</h2>" + "<p>Larger circles indicate higher magnitude; however, the significance value is determined on a <br>" +
            "number of factors, including: magnitude, maximum MMI, felt reports, and estimated impact.<br> The larger the number, the more signficant the event.</p>"

        // loop through our density intervals and generate a label with a colored square for each interval
        // first loop for colored legend boxes
        for (var i = 0; i < significance.length; i++) {
            div.innerHTML +=
                '<span style="background:' + get_color(significance[i] + 1) + '"></span> ';
        }

        // a line break
        div.innerHTML += '<br>';

        // second loop for text
        for (var i = 0; i < significance.length; i++) {
            div.innerHTML +=
                '<label>' + significance[i] + (significance[i + 1] ? '&ndash;' + significance[i + 1] : '+') + '</label>';
        }
        return div;
    };

    legend.addTo(map);

});

