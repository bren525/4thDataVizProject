var GLOBAL = {};
GLOBAL.filters = {
	age: null,
	cause: null,
	year: null
}
GLOBAL.categories = {
	age: {
		title: "Number of Deaths per Age Group",
		xlabel: "Number of Deaths",
		ylabel: "Age Group",
		filter: null,
		color: "blue",
		excludeColor: "lightblue"
	},
	year: {
		title: "Number of Deaths per Year",
		xlabel: "Number of Deaths",
		ylabel: "Year",
		filter: null,
		color: "red",
		excludeColor: "maroon"
	},
	cause: {
		title: "Number of Deaths per Cause of Death",
		xlabel: "Number of Deaths",
		ylabel: "Cause of Death",
		filter: null,
		color: "green",
		excludeColor: "lime"
	}
}
window.addEventListener("load", run);

function run () {
	GLOBAL.svg = "svg";
	$.get("http://localhost:8080/data", function(data) {
		GLOBAL.data = JSON.parse(data);
		draw(GLOBAL.svg);
	})
}

function draw (svg) {
	d3.select("#"+svg).selectAll("g").remove();

	for (category in GLOBAL.categories) {
		var data = getData(category);
		var colors = [];
		for (var i in data.values) {
			if (GLOBAL.categories[category].filter != null && GLOBAL.categories[category].filter != data[i]) {
				colors.push(GLOBAL.categories[category].excludeColor);
			} else {
				colors.push(GLOBAL.categories[category].color);
			}
		}
		var viz = viz_lib.bar_graph(svg, 100, 100, 700, 400, data, colors, .2);
		viz.selectAll("rect").on("click", applyFilter(category));
	}
}

function getData(category) {
	var data = {};
	data.xlabel = GLOBAL.categories[category].xlabel;
	data.ylabel = GLOBAL.categories[category].ylabel;
	data.title = GLOBAL.categories[category].title;
	var values = {};
	for (i in GLOBAL.data) {
		var row = GLOBAL.data[i]
		if (isIncluded(row, category)) {
			values[row[category]] = (values[row[category]] || 0) + row.count;
		}
	}
	data.values = [];
	for (var key in values) {
		values.push({label: key, val: values[key]});
	}
	return data;
}

function isIncluded(row, category) {
	for (var cat in GLOBAL.categories) {
		if (category != cat && GLOBAL.categories[cat].filter !,= null && GLOBAL.categories[cat].filter != row[cat]) {
			return false;
		}		
	}
	return true;
}

function applyFilter(category) {
	return function(element) {
		if (GLOBAL.categories[category].filter == element.label){
			GLOBAL.categories[category].filter = null
		} else {
			GLOBAL.categories[category].filter = element.label
		}
		draw(GLOBAL.svg);
	}
}