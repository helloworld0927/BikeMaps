// Leaflet map code and functions

/* GLOBAL VARIABLES */
var map; //global map object
	// Dynamically clustered point data layer
	// accidentPoints = new L.LayerGroup({

/* ICON DEFINITIONS */
var bikeRedIcon = L.MakiMarkers.icon({
		icon: "bicycle",
		color: "#d9534f",
		size: "m"
	}),
	bikeYellowIcon = L.MakiMarkers.icon({
		icon: bikeRedIcon.options.icon,
		color: "#f0ad4e",
		size: "m"
	}),
	bikeGreyIcon = L.MakiMarkers.icon({
		icon: "bicycle",
		color: "#999",
		size: "m"
	}),
	policeIcon = L.MakiMarkers.icon({
		icon: "police",
		color: "#004",
		size: "m"
	}),
	icbcIcon = L.MakiMarkers.icon({
		icon: "car",
		color: "#20a5de",
		size: "m"
	});

var accidentPoints = new L.MarkerClusterGroup({
	// maxClusterRadius: 50,
	// disableClusteringAtZoom: 16});,
	
	iconCreateFunction: function(cluster) {
		var children = cluster.getAllChildMarkers();

		//Count the number of markers in each cluster
		var	nPolice = 0,
			nIcbc = 0,
			nBikeR = 0,
			nBikeY = 0,
			nUnknown = 0,
			marker;
		
		children.forEach( function(c) {
			marker = c.options.icon.options; // options for each point in clusters icon, used here to differentiate the points in each cluster
			if (marker.icon === policeIcon.options.icon) {
				nPolice++;
			} else if (marker.icon === icbcIcon.options.icon) {
				nIcbc++;
			} else if (marker.icon === bikeRedIcon.options.icon && marker.color === bikeRedIcon.options.color) {
				nBikeR++;
			} else if (marker.icon === bikeYellowIcon.options.icon && marker.color === bikeYellowIcon.options.color) {
				nBikeY++;
			} else {
				nUnknown++;
			}
		});

		// if(nUnknown > 0){
		// 	console.log("error");
		// }

		// Build the svg layer
		return pieChart([{
			"type": 'Police',
			"count": nPolice,
			"color": policeIcon.options.color
		}, {
			"type": 'ICBC',
			"count": nIcbc,
			"color": icbcIcon.options.color
		}, {
			"type": 'BikeR',
			"count": nBikeR,
			"color": bikeRedIcon.options.color
		}, {
			"type": 'BikeY',
			"count": nBikeY,
			"color": bikeYellowIcon.options.color
		}, {
			"type": 'Unknown',
			"count": nUnknown,
			"color": bikeGreyIcon.options.color
		}]);
	},
});

function pieChart(data){
	var types = [],
		counts = [],
		colors = [];

	data.forEach(function(d){
		types.push(d.type);
		counts.push(d.count);
		colors.push(d.color);
	});

	var color = d3.scale.ordinal()
		.domain(types)
		.range(colors)

	var arc = d3.svg.arc()
		.outerRadius(40)
		.innerRadius(10);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.count; });

	var width = 50, 
		height = 50;

	var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
	var vis = d3.select(svg)
		.data(data)
		.attr('class', 'marker-cluster-pie')
		.attr('width', width)
		.attr('height', height)
		.append("g")
		.attr('transform', 'translate(' + width/2 + ',' + width/2 + ')');

	data.forEach(function(d){
		d.count = +d.count;
	});

	var g = vis.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr('class', 'arc');

	g.append('path')
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.type); });


	var html = serializeXmlNode(svg);

	return new L.DivIcon({
		html: html,
		className: 'marker-cluster',
		iconSize: new L.Point(40,40)
	});
};

function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}


var	userRoutes = new L.LayerGroup([]);

	// Heatmap layer corresponding to all accident data
var	heatMap = L.heatLayer([], {
		radius: 40,
		blur: 20,
	});


/* Create the map with a tile layer and set global variable map */
function initialize() {
	/* STATIC VECTOR DEFINITIONS */
	var policePoints = new L.geoJson(policeData, {
			pointToLayer: function(feature, latlng) {
				heatMap.addLatLng(latlng);

				return L.marker(latlng, {
					icon: policeIcon
				});
			},
			onEachFeature: function(feature, layer) {
				var date = feature.properties.ACC_DATE.split("/");
				date = getMonthFromInt(parseInt(date[1])) + ' ' + date[2] + ', ' + date[0]; 	// Month dd, YYYY
				layer.bindPopup('<strong>Source:</strong> Victoria Police Dept.<br><strong>Date:</strong> ' + date);
			}
		}).addTo(accidentPoints),


		icbcPoints = new L.geoJson(icbcData, {
			pointToLayer: function(feature, latlng) {
				heatMap.addLatLng(latlng);

				return L.marker(latlng, {
					icon: icbcIcon
				});
			},
			onEachFeature: function(feature, layer) {
				var date = toTitleCase(feature.properties.Month) + " " + feature.properties.Year;
				layer.bindPopup('<strong>Source:</strong> ICBC<br><strong>Date: </strong>' + date);
			}
		}).addTo(accidentPoints),


		racksCluster = new L.MarkerClusterGroup({
			showCoverageOnHover: false,
			// spiderfyOnMaxZoom: false,
			maxClusterRadius: 20,
			singleMarkerMode: true,
			iconCreateFunction: function(cluster) {
				var c = ' rack-cluster-'
				if (cluster.getChildCount() > 1) {
					c += 'medium';
					size = new L.Point(10,10);
				} else {
					c += 'small';
					size = new L.Point(5,5);
				}

				return new L.DivIcon({ className: 'rack-cluster' + c, iconSize: size});
			},
		}),
		bikeRacksVictoria = new L.geoJson(bikeRacks, {
			pointToLayer: function(feature, latlng) {
				return L.marker(latlng);
			},
			onEachFeature: function(feature, layer) {
				layer.bindPopup('Bike rack');
			}
		}).addTo(racksCluster),


		bikeLanes = new L.geoJson(bikeRoutes, {
			style: function(feature) {
				switch (feature.properties.Descriptio) {
					case 'Buffered Bike Lane':
						return {
							color: '#007f16', // Dark green
						};
					case 'Cycle Track*':
						return {
							color: '#259238', // Faded dark green
							opacity: 0.8
						};
					case 'Multi-Use Trail':
						return {
							color: '#87a000', // Dark Yellow
							opacity: 0.8
						};
					case 'Conventional Bike Lane':
						return {
							color: '#00c322', // Green
							opacity: 0.8
						};
					case 'Priority Transit and Cycling Lanes*':
						return {
							color: '#05326d', // Dark blue
							opacity: 0.8
						};
					case 'Signed Bike Route':
						return {
							color: '#0e51a7', // blue
							opacity: 0.8
						};
					case 'Proposed Bicycle Network':
						return {
							color: '#ff9e00', // Faded green
							opacity: 0.3
						};
				}
			}
		});

	/* TILE LAYER DEFINITIONS */
	var stravaHM5 = L.tileLayer('http://gometry.strava.com/tiles/cycling/color5/{z}/{x}/{y}.png', {
			attribution: 'Ridership data &copy <a href=http://labs.strava.com/heatmap/>Strava labs</a>',
			minZoom: 3,
			maxZoom: 17,
			opacity: 0.8
		});

		// Unused
		mapquest = L.tileLayer('http://otile2.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
			attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">, \
	    	map data &copy <a href=http://openstreetmap.org>OpenStreetMap</a> contributors',
			maxZoom: 18
		}),

		// Based on OSM data
		skobbler = L.tileLayer('http://tiles1-b586b1453a9d82677351c34485e59108.skobblermaps.com/TileService/tiles/2.0/1111113120/10/{z}/{x}/{y}.png@2x', {
			attribution: '© Tiles: <a href="http://maps.skobbler.com/">skobbler</a>, Map data: <a href=http://openstreetmap.org>OpenStreetMap</a> contributors, CC-BY-SA',
		}),

		skobblerNight = L.tileLayer('http://tiles1-b586b1453a9d82677351c34485e59108.skobblermaps.com/TileService/tiles/2.0/1111113120/2/{z}/{x}/{y}.png@2x', {
			attribution: '© Tiles: <a href="http://maps.skobbler.com/">skobbler</a>, Map data: <a href=http://openstreetmap.org>OpenStreetMap</a> contributors, CC-BY-SA',
		}),
	
	/* MAP INIT AND DEFAULT LAYERS */
	map = L.map('map', {
		center: [48.5, -123.3],
		zoom: 11,
		layers: [skobbler, accidentPoints, userRoutes],
	});

	/* LAYER CONTROL */
	var baseMaps = {
			"Day": skobbler,
			"Night": skobblerNight,
		},
		overlayMaps = {
			"Accident points": accidentPoints,
			"Accident heat map": heatMap,
			"User route heat map": userRoutes,
			"Strava heat map": stravaHM5,
			"Bike Racks": racksCluster,
			"Bike lanes": bikeLanes,
		};
	L.control.layers(baseMaps, overlayMaps).addTo(map);


	/* DRAWING CONTROL */
	L.drawLocal.draw.toolbar.buttons.marker = 'Add an incident marker';
	L.drawLocal.draw.handlers.marker.tooltip.start = 'Place me where the incident occurred';
	L.drawLocal.draw.toolbar.buttons.polyline = 'Add your cycling route';

	map.addControl(new L.Control.Draw({
		draw: {
			polyline: {
				shapeOptions: {
					color: '#f357a1',
					weight: 5
				}
			},
			polygon: false,
			rectangle: false,
			circle: false,
			marker: {
				icon: bikeGreyIcon,
			}
		},
		edit: false,
	}));

}

function getPoint(latlng, date, type) {
	heatMap.addLatLng(latlng);

	var icon;
	if (type == "Collision") {
		icon = bikeRedIcon;
	} else {
		icon = bikeYellowIcon;
	}
	marker = L.marker(latlng, {
		icon: icon
	});

	date = date.split(",");
	date = date[0] + ',' + date[1]
	marker.bindPopup('<strong>Source:</strong> User submitted<br><strong>Date:</strong> ' + date + '<br><strong>Type:</strong> ' + type);

	accidentPoints.addLayer(marker);
}


function getPolyline(latlng, freq) {
	userRoutes.addLayer(L.polyline(latlng, {
		color: 'red',
		width: 40,
		opacity: 0.1,
		lineCap: 'round',
		clickable: false,
	}));
}


function locateUser() {
	this.map.locate({
		setView: true
	});
}

function getMonthFromInt(num){
	switch(num) {
		case 1:
			return "January";
		case 2:
			return "February";
		case 3:
			return "March";
		case 4:
			return "April";
		case 5:
			return "May";
		case 6:
			return "June";
		case 7:
			return "July";
		case 8:
			return "August";
		case 9:
			return "September";
		case 10:
			return "October";
		case 11:
			return "November";
		case 12:
			return "December";
	}
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}