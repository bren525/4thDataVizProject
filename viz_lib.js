var viz_lib = (function() {
	var viz_lib = {};

	viz_lib.table = function (svg, startX, startY, width, height, data) {
		//make table
		var columns = data.columns;
	    var table = d3.select("#"+svg).append("table")
	    	.attr("x", startX)
	    	.attr("y", startY)
	    	.attr("width", width)
	    	.attr("height", height);
        thead = table.append("thead"),
        tbody = table.append("tbody");

	    // append the header row
	    thead.append("tr")
	        .selectAll("th")
	        .data(columns)
	        .enter()
	        .append("th")
	            .text(function(column) { return column; });

	    // create a row for each object in the data
	    var rows = tbody.selectAll("tr")
	        .data(data.values)
	        .enter()
	        .append("tr");

	    // create a cell in each row for each column
	    var cells = rows.selectAll("td")
	        .data(function(row) {
	            return columns.map(function(column) {
	                return {column: column, value: row[column]};
	            });
	        })
	        .enter()
	        .append("td")
	        .attr("style", "font-family: Courier") // sets the font style
	            .html(function(d) { return d.value; });
	    
	    return table;
	};

	viz_lib.bar_graph = function (svg, startX, startY, width, height, data, colors, margin) {
		var bars = data.values;
		var barWidth = width / bars.length;
		var barMargin = barWidth * margin;
		barWidth = barWidth - barMargin
		var maxBar = Math.max.apply(Math, bars.map(function(d){return d.val;}));
		var barScale = height / maxBar;

		var graph = d3.select("#" + svg).append("g");

		//Make the bars
		graph.selectAll("g")
			.data(bars)
			.enter()
			.append("g")
				.append("rect")
					.attr("x", function(d, i) {return startX + i * (barWidth + barMargin);})
					.attr("y", function(d, i) {return startY + height - barScale * d.val;})
					.attr("width", barWidth)
					.attr("height", function(d, i) {return d.val;})
					.style("fill", colors[i % colors.length]);

		//Make the text labels for the categories
		graph.selectAll("g").append("text")
			.text(function(d) {return d.label;})
			.attr("fontsize",15)
			.attr("x", function(d, i) {return startX + (i + .5) * (barWidth + barMargin);})
			.attr("y", startY + height + 15 )
			.style("text-anchor", "middle");

		//Make the axis
		var yAxis = d3.svg.axis()
			.scale(d3.scale.linear().domain([0, 100]).range([100, 0]))
			.orient("left");
		graph
			.append("g")
				.attr("class", "y axis")
				.attr("fill","none")
				.attr("stroke","black")
				.attr("shape-rendering","crispEdges")
				.attr("font-family","sans-serif")
				.attr("font-size","11px")
				.attr("transform", "translate(" + startX + ", " + startY + ")")
				.call(yAxis);

		//Title the graph
		graph
			.append("g")
				.append("text")
					.attr("x", startX + width / 2)
					.attr("y", startY - 20)
					.attr("font-size", "24px")
					.style("text-anchor", "middle")
					.text(data.title);

		//Label the x axis
		graph
			.append("g")
				.append("text")
					.attr("x", startX + width / 2)
					.attr("y", startY + height + 50)
					.attr("font-size", "18px")
					.style("text-anchor", "middle")
					.text(data.xlabel);

		//Label the y axis
		graph
			.append("g")
				.append("text")
					.attr("font-size", "18px")
					.style("text-anchor", "middle")
					.attr("transform", "translate(" + (startX - 50) + ", " + (startY + height / 2) + ")rotate(-90)")
					.text(data.ylabel);
		return graph;
	};

	return viz_lib;
})();
