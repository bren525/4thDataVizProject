var GLOBAL = {};
GLOBAL.filters = {
	age: null,
	cause: null,
	year: null
}
window.addEventListener("load", run);

function run () {
	var svg = "svg";
	$.get("http://localhost:8080/data", function(data) {
		GLOBAL.data = JSON.parse(data);
		draw(svg);
	})
}

function draw (svg) {
	d3.select("#"+svg).selectAll("g").remove();

	var cause_data = getCauseData();
	var cause_breakdown = viz_lib.bar_graph(svg, 100, 100, 700, 400, cause_data, GLOBAL.colors, .2);
	cause_breakdown.selectAll("rect").on("click", filterCause);
}

function getCauseData() {
	var data = {};
	data.xlabel = "Cause of Death";
	data.ylabel = "Number of Deceased";
	data.title = "Number of Deaths per Cause of Death";
	data.values = [];
	var values = {};
	for (i in GLOBAL.data) {
		var row = GLOBAL.data[i]
		if (isIncluded(row)) {
			values[row.cause] = (values[row.cause] || 0) + row.count;
		}
	}
	for (cause in values) {
		data.values.push({label: cause, val: values[cause]});
	}
	return data;
}

function isIncluded(row) {
	for (filter in GLOBAL.filters) {
		if (GLOBAL.filters[filter] != null && GLOBAL.filters[filter] != row[filter]) {
			return false;
		}		
	}
	return true;
}

function filterCause(element) {

}