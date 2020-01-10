	function makeRadialChart(){
		var svg = d3.select("svg#userResult")
		.attr("width", svgWidth)
		.attr("height", svgHeight)
	  .append("g")
		.attr("transform", "translate(" + svgWidth/2 + "," +svgHeight/2 + ")");


		var graphBack = svg.append("g")
			.attr("class","graph-back");

		 var rectMajor = graphBack.append("rect")
			.attr("x", "0")
			.attr("y", "0")
			.attr("width", svgWidth)
			.attr("height", svgHeight/2)
			.attr("fill", "none")
			.attr("class", "bg-major")
			.attr("transform", "translate(" + -svgWidth/2 + "," + -svgHeight/2 + ")");

		 var rectMinor = graphBack.append("rect")
			.attr("x", "0")
			.attr("y", "0")
			.attr("width", svgWidth)
			.attr("height", svgHeight/2)
			.attr("fill", "none")
			.attr("class", "bg-minor")
			.attr("transform", "translate(" + -svgWidth/2 + "," + 0 + ")");

		graphBack.append("text")
			.attr("x", "15")
			.attr("y", "25")
			.style("font-weight","bold")
			.style("font-size","14")
			.style("fill", function(d, i) {return "#40a778";})
			.text("특권영역")
			.attr("class", "graph-semi-title")
			.attr("text-anchor", "start")
			.attr("transform", "translate(" + -45 + "," + -svgHeight/2 + ")");

		graphBack.append("text")
			.attr("x", "15")
			.attr("y", "-15")
			.style("font-weight","bold")
			.style("font-size","14")
			.style("fill", function(d, i) {return "#f16d48";})
			.text("차별영역")
			.attr("class", "graph-semi-title")
			.attr("text-anchor", "start")
			.attr("transform", "translate(" + -45 + "," +svgHeight/2 + ")");


		var circleGraphHolder = svg.append("g")
			.attr("class","circle-graph-holder");

		//d3.json("js/data.json", function(error, data) {
		d3.json("js/data.json?" + new Date().getTime(), function(error, data) {
			if (error) throw error;
			//data.sort(function(a,b) { return b.value - a.value; });

			//d3.extent() 배열을 받으면 그 배열중 최소값, 최대값을 배열로 반환
			//var extent = d3.extent(data, function(d) { return d.value; });
			//우리는 최대값 5로 고정이므로 
			var extent = [0, 10]; 

			var barScale = d3.scaleLinear()
			  .domain(extent)
			  .range([0, barHeight]);

			//키값 배열로 저장
			var keys = data.map(function(v,i,a) { return a[i].area; });
			console.log(keys);
			var numBars = keys.length; //전체길이: 9x2 = 18

			//x축
			var xScale = d3.scaleLinear()
			  .domain(extent)
			  .range([0, -barHeight]);

			var xAxis = d3.axisLeft(xScale)
			  .ticks(5)
			  .tickFormat(d3.format("d"));


			/*
			d3.axisLeft(yScale)
				.ticks(5)
				.tickFormat(d3.format("d"))*/
			  

			//원형으로 축 그려주기
			var circles = circleGraphHolder.selectAll("circle")
				  .data(xScale.ticks(5))
				.enter().append("circle")
				  .attr("r", function(d) {return barScale(d);})
				  .style("fill", "rgba(0, 0, 0,0.02)")
				  .style("stroke", "rgba(0,0,0,0.5)")
				  .style("stroke-dasharray", "2")
				  .style("stroke-width",".5px");

			//.arc() 아치(호)를 생성해주는 메소드
			// .innerRadius() 안쪽 반지름 값, 0이면 안쪽 반지름이 없기 때문에 그래프가 완전한 원이 되고 값이 있으면 도넛 형태
			// .outerRadius() 바깥쪽 반지름값
			// 데이터에 알맞게 아치 객체를 생성해준 후에 path의 d 값으로 객체의 값을 넘겨줘야한다. 
			var arc = d3.arc()
				.innerRadius(0)
				.startAngle(function(d,i) { return (i * 2 * Math.PI) / numBars; }) //시작각
				.endAngle( function(d,i) { return ((i + 1) * 2 * Math.PI) / numBars; }); //끝각			

			var tooltip = d3.select(".tooltip");

			// 아치 객체를 이용해 각 bar segment를 생성해준다. 
			var segments =  circleGraphHolder.selectAll("path")
					.data(data)
				.enter().append("path")
					.each(function(d,i) {  //데이터 값에 맞게 길이를 반환해줌
						var radi = barScale(d.value);
						d.outerRadius = radi;
					})
					.style("fill", function(d,i){
						if(d.type=="major"){
							return "url(#greenGrad)";
						}else if(d.type=="minor") {
							return "url(#redGrad)";				
						}			
					})
					.attr("d", arc)
					.attr("class", "each-graph")
					.attr("filter", "url(#glow)");

			segments.on("mouseover", function(d) {
					d3.select(this).classed("graph-hover", true);
					
					tooltip
					  .style("left", d3.event.pageX - 30 + "px")
					  .style("top", d3.event.pageY - 160 + "px")
					  .style("display", "inline-block")
					  .html((d.area) + "<br><span>" + (d.value) + "</span>");
					
				})
				.on("mouseout", function(d) {
					d3.select(this).classed("graph-hover", false)
					tooltip.style("display", "none");
				});


			// 각 bar segment에 애니메이션 효과
			/*	segments.transition().ease("elastic").duration(1000).delay(function(d,i) {return (25-i)*100;})
				  .attrTween("d", function(d,index) {
					var i = d3.interpolate(d.outerRadius, barScale(+d.value));
					return function(t) { d.outerRadius = i(t); return arc(d,index); };
				  });*/

			// 가장 밖의 원 테두리 
			 circleGraphHolder.append("circle")
			  .attr("r", barHeight)
			  .classed("outer", true)
			  .style("fill", "none")
			  .style("stroke", "#111")
			  .style("stroke-opacity", "0.5")
			  .style("stroke-width","2px");

			// 각 bar segment를 가르는 라인
			var lines = circleGraphHolder.selectAll("line")
			  .data(keys)
			.enter().append("line")
			  .attr("y2", -barHeight )
			  .style("stroke", "#111")
			  .style("stroke-opacity", "0.5")
			  .style("stroke-width",".5px")
			  .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });

			var baseLine = circleGraphHolder.append("line")
				.classed("baseline", true)
				.attr("y2",(barHeight+200)*2 )
				.style("stroke", "#111")
				.style("stroke-width","2px")
				.attr("transform", "translate(0,"+ -1*(barHeight+200)+")");

		/*
			var baseLine = svg.selectAll("line")
				.data(basedata)
				.enter().append("line")
				.classed("baseline", true)
				.attr("y2", -barHeight )
				.style("stroke", "#fff")
				.style("stroke-width","2px");		*/

			// 척도 나타내는 축 생성 
			 circleGraphHolder.append("g")
			.attr("class", "x axis")
			.call(xAxis);


			// 각 항목별 텍스트 라벨
			var labelRadius = barHeight * 1.025;

			var labels =  circleGraphHolder.append("g")
			  .classed("labels", true);

			labels.append("def")
				.append("path")
				.attr("id", "label-path")
				.attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

			labels.selectAll("text")
				.data(keys)
			  .enter().append("text")
				.style("text-anchor", "middle")
				.style("font-weight","normal")
				.style("font-size","12")
				.style("fill", function(d, i) {return "#111";})
				.append("textPath")
				.attr("xlink:href", "#label-path")
				.attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
				.text(function(d) {return d.toUpperCase(); });

		});
	
	}

	
	/*
		segments.transition().duration(1000)
			.attrTween("d", function(d,i){
					var i = d3.interpolate(d.outerRadius, barScale(+d.value));
					var radi = randomRange(0,5);
					return function(t) { d.outerRadius = radi; return arc(d,i); };
				  });*/

			/*.each( function(d,i) { 
				var radi = randomRange(0,5);
				d.outerRadius = radi;
			});*/

	