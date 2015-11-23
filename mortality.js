var GLOBAL = {};
GLOBAL.filters = {
	age: null,
	cause: null,
	year: null
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

	var cause_data = getCauseData();
	var causeColors = [];
	for (var i in cause_data.values) {
		if (GLOBAL.filters.cause != null && GLOBAL.filters.cause != cause_data[i]) {
			causeColors.push("#7ec0ee");
		} else {
			causeColors.push("blue");
		}
	}
	var cause_breakdown = viz_lib.bar_graph(svg, 100, 100, 700, 400, cause_data, causeColors, .2);
	cause_breakdown.selectAll("rect").on("click", filterCause);

	var age_data = getAgeData();
	var ageColors = [];
	for (var i in age_data.values) {
		if (GLOBAL.filters.age != null && GLOBAL.filters.age != age_data[i]) {
			ageColors.push("#7ec0ee");
		} else {
			ageColors.push("blue");
		}
	}
	var age_breakdown = viz_lib.bar_graph(svg, 100, 600, 700, 400, age_data, ageColors, .2);

	var year_data = getYearData();
	var yearColors = [];
	for (var i in year_data.values) {
		if (GLOBAL.filters.year != null && GLOBAL.filters.year != year_data[i]) {
			yearColors.push("#7ec0ee");
		} else {
			yearColors.push("blue");
		}
	}
	var year_breakdown = viz_lib.bar_graph(svg, 100, 1100, 700, 400, year_data, yearColors, .2);
}

function getData(category) {
	var values_obj = {};
	for (i in GLOBAL.data) {
		var row = GLOBAL.data[i]
		if (isIncluded(row)) {
			values_obj[row[category]] = (values_obj[row[category]] || 0) + row.count;
		}
	}
	var values = [];
	for (var key in values_obj) {
		values.push({label: key, val: values_obj[key]});
	}
	return values;
}

function getCauseData() {
	var data = {};
	data.xlabel = "Cause of Death";
	data.ylabel = "Number of Deceased";
	data.title = "Number of Deaths per Cause of Death";
	data.values = getData("cause");
	return data;
}

function getAgeData() {
	var data = {};
	data.xlabel = "Age Group";
	data.ylabel = "Number of Deceased";
	data.title = "Number of Deaths per Age Group";
	data.values = getData("age");
	return data;
}

function getYearData() {
	var data = {};
	data.xlabel = "Year of Death";
	data.ylabel = "Number of Deceased";
	data.title = "Number of Deaths per Year of Death";
	data.values = getData("year");
	return data;
}

function isIncluded(row) {
	for (var filter in GLOBAL.filters) {
		if (GLOBAL.filters[filter] != null && GLOBAL.filters[filter] != row[filter]) {
			return false;
		}		
	}
	return true;
}

function filterCause(element) {
	if (GLOBAL.filters.cause == element.label){
		GLOBAL.filters.cause = null
	} else {
		GLOBAL.filters.cause = element.label
	}
	draw(GLOBAL.svg);
}