var GLOBAL = {};
GLOBAL.filters = {
	age: null,
	cause: null,
	year: null
}
window.addEventListener("load", run);

function run () {
	var svg = "svg";
	$.get("/data", function(err, data) {
		if (err) {
			console.log(err)
		}
		GLOBAL.data = data;
		draw(svg);
	})
}

function draw (svg) {
	d3.select("#"+svg).selectAll("g").remove();

	var cause_data = get_cause_data();
	var cause_breakdown = viz_lib.bar_graph(svg, 100, 100, 700, 400, cause_data, GLOBAL.colors, 0);
	cause_breakdown.selectAll("rect").on("click", filterCause);
}

function get_cause_data() {
	var data = {};
	data.xlabel = "Cause of Death";
	data.ylabel = "Number of Deceased";
	data.title = "Number of Deaths per Cause of Death";
	data.values = [];
	values = {};
	for (row in GLOBAL.data) {
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