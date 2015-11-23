var GLOBAL = {};
GLOBAL.categories = {
	age: {
		title: function(){
			var title = "Mortality Count by Age Group";
			title += (GLOBAL.categories.cause.filter != null) ? "\n Caused By " + GLOBAL.causeStrings[GLOBAL.categories.cause.filter] : "";
			title += (GLOBAL.categories.year.filter != null) ? " in " + GLOBAL.categories.year.filter : "";
			console.log(title);
			return title;
		},
		ylabel: "Number of Deaths",
		xlabel: "Age Group",
		filter: null,
		color: "blue",
		excludeColor: "lightblue",
		ystart: 600
	},
	year: {
		title: function(){
			var title = "Mortality Count by Year";
			title += (GLOBAL.categories.age.filter != null) ? " for " + GLOBAL.categories.age.filter + " Year Olds" : "";
			title += (GLOBAL.categories.cause.filter != null) ? "\n Caused By " + GLOBAL.causeStrings[GLOBAL.categories.cause.filter] : "";
			return title;
		},
		ylabel: "Number of Deaths",
		xlabel: "Year",
		filter: null,
		color: "red",
		excludeColor: "#FE5353",
		ystart: 1100
	},
	cause: {
		title: function(){
			var title = "Mortality Count by Cause of Death";
			title += (GLOBAL.categories.age.filter != null) ? " for " + GLOBAL.categories.age.filter + " Year Olds" : "";
			title += (GLOBAL.categories.year.filter != null) ? " in " + GLOBAL.categories.year.filter : "";
			return title;
		},
		ylabel: "Number of Deaths",
		xlabel: "Cause of Death",
		filter: null,
		color: "green",
		excludeColor: "#94D192",
		ystart: 100
	}
}
GLOBAL.causeStrings = {
	"01": "Tuberculosis",
	"02": "Syphilis",
	"03": "HIV",
	"04": "Cancer",
	"05": "Cancer Of Stomach",
	"06": "Cancers Of Colon, Rectum And Anus",
	"07": "Cancer Of Pancreas",
	"08": "Cancers Of Trachea, Bronchus And Lung",
	"09": "Cancer Of Breast",
	10: "Cancers Of Cervix And Ovary",
	11: "Cancer Of Prostate",
	12: "Cancers Of Urinary Tract",
	13: "Non-Hodgkin's Lymphoma",
	14: "Leukemia",
	15: "Other Cancers",
	16: "Diabetes Mellitus",
	17: "Alzheimer's Disease",
	18: "Major Cardiovascular Diseases",
	19: "Diseases Of Heart ",
	20: "Hypertensive Heart Disease",
	21: "Ischemic Heart Diseases",
	22: "Other Diseases Of Heart",
	23: "hypertension And Hypertensive Renal Disease",
	24: "Cerebrovascular Diseases",
	25: "Atherosclerosis",
	26: "Other Diseases Of Circulatory System",
	27: "Influenza And Pneumonia",
	28: "Chronic Lower Respiratory Diseases",
	29: "Peptic Ulcer",
	30: "Chronic Liver Disease And Cirrhosis",
	31: "Nephritis, Nephrotic Syndrome, And Nephrosis",
	32: "Pregnancy, Childbirth And The Puerperium",
	33: "Conditions In The Perinatal Period",
	34: "Chromosomal Abnormalities",
	35: "Sudden Infant Death Syndrome",
	36: "Abnormal Clinical Findings",
	37: "All Other Diseases",
	38: "Motor Vehicle Accidents",
	39: "All Other Unspecified Accidents",
	40: "Suicide",
	41: "Assault (Homicide)",
	42: "All Other External Causes"
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
			if (GLOBAL.categories[category].filter != null && GLOBAL.categories[category].filter != data.values[i].label) {
				colors.push(GLOBAL.categories[category].excludeColor);
			} else {
				colors.push(GLOBAL.categories[category].color);
			}
		}
		var viz = viz_lib.bar_graph(svg, 100, GLOBAL.categories[category].ystart, 700, 400, data, colors, .2);
		viz.selectAll("rect").on("click", applyFilter(category));
	}
}

function getData(category) {
	var data = {};
	data.xlabel = GLOBAL.categories[category].xlabel;
	data.ylabel = GLOBAL.categories[category].ylabel;
	data.title = GLOBAL.categories[category].title();
	var values = {};
	for (i in GLOBAL.data) {
		var row = GLOBAL.data[i]
		if (isIncluded(row, category)) {
			values[row[category]] = (values[row[category]] || 0) + row.count;
		}
	}
	data.values = [];
	for (var key in values) {
		data.values.push({label: key, val: values[key]});
	}
	return data;
}

function isIncluded(row, category) {
	for (var cat in GLOBAL.categories) {
		if (category != cat && GLOBAL.categories[cat].filter != null && GLOBAL.categories[cat].filter != row[cat]) {
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