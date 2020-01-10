$(function(){
	var ieTest = false,
		screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		imgURL = "http://img.khan.co.kr/spko/storytelling/2019/running/",
		isMobile = screenWidth <= 800 && true || false,
		isNotebook = (screenWidth <= 1300 && screenHeight < 750) && true || false,
		isMobileLandscape = ( screenWidth > 400 && screenWidth <= 800 && screenHeight < 450 ) && true || false;
	window.onbeforeunload = function(){ window.scrollTo(0, 0) ;}
	var svgWidth = (screenWidth > 600)? 600 : screenWidth,
		svgHeight = (screenHeight > 600) ? 600: screenHeight,
	    barHeight = svgHeight / 2 - 40;
	var powerCategory =  ["외모차별 X", "나이차별 X", "경제력(중산층)", "비장애인", "성별", "이성애", "고학력", "서울", "외모차별 O", "나이차별 O", "경제력(중산층)", "장애", "성별", "성소수자", "저학력", "지방"];
	var circleAxisBgColor = ["#cfcfcf", "#d8d8d8", "#e1e1e1", "#ebebeb","#f5f5f5"];
	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};

	var interviewwData1 = [
		{"area": "외모차별 X", "value": 4, "type":"major"},
		{"area": "나이차별 X", "value": 0, "type":"major"},
		{"area": "경제력(중산층)", "value": 2, "type":"major"},
		{"area": "비장애인", "value": 5, "type":"major"},
		{"area": "성별", "value": 0, "type":"major"},
		{"area": "이성애", "value": 5, "type":"major"},
		{"area": "고학력", "value": 2, "type":"major"},
		{"area": "서울", "value": 0, "type":"major"},
		{"area": "외모차별 O", "value": 0, "type":"minor"},
		{"area": "나이차별 O", "value": 4, "type":"minor"},
		{"area": "경제력(중산층)", "value": 0, "type":"minor"},
		{"area": "장애", "value": 0, "type":"minor"},
		{"area": "성별", "value": 2, "type":"minor"},
		{"area": "성소수자", "value": 0, "type":"minor"},
		{"area": "저학력", "value": 0, "type":"minor"},
		{"area": "지방", "value":2, "type":"minor"}
  	];

	var interviewwData2 = [
		{"area": "외모차별 X", "value": 0, "type":"major"},
		{"area": "나이차별 X", "value": 4, "type":"major"},
		{"area": "경제력(중산층)", "value": 3, "type":"major"},
		{"area": "비장애인", "value": 0, "type":"major"},
		{"area": "성별", "value": 3, "type":"major"},
		{"area": "이성애", "value": 0, "type":"major"},
		{"area": "고학력", "value": 5, "type":"major"},
		{"area": "서울", "value": 5, "type":"major"},
		{"area": "외모차별 O", "value": 3, "type":"minor"},
		{"area": "나이차별 O", "value": 0, "type":"minor"},
		{"area": "경제력(중산층)", "value": 0, "type":"minor"},
		{"area": "장애", "value": 3, "type":"minor"},
		{"area": "성별", "value": 0, "type":"minor"},
		{"area": "성소수자", "value": 3, "type":"minor"},
		{"area": "저학력", "value": 0, "type":"minor"},
		{"area": "지방", "value":0, "type":"minor"}
  	];


	//인트로용 차트 데이터 생성
	var introChartData = [];
	for(i=0;i<powerCategory.length;i++){
		var obj = {};
		obj.area = powerCategory[i];
		obj.value = 0;
		obj.type = (i>7)? "minor":"major";
		introChartData.push(obj);
	}
	function makeChartBasic(svgName, chartData, chartWidth, type, padding){
		var data = chartData,
			svgWidth = svgHeight = chartWidth
			type = type,
			padding = padding,
			barHeight = svgHeight / 2 - (padding*2);
		
		var svg = d3.select(svgName)
			.attr("width", svgWidth)
			.attr("height", svgHeight)
			.append("g")
				.attr("transform", "translate(" + svgWidth/2 + "," +svgHeight/2 + ")");
		var graphBack = svg.append("g")
			.attr("class","graph-back");
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

		var extent = [0, 5]; 

		var barScale = d3.scaleLinear()
		  .domain(extent)
		  .range([0,barHeight]);

		var keys = powerCategory;
		var numBars = keys.length; 

		//x축
		var xScale = d3.scaleLinear()
		  .domain(extent)
		  .range([0, -barHeight]);

		var xAxis = d3.axisLeft(xScale)
		  .ticks(5)
		  .tickFormat(d3.format("d"));
		  
		//원형으로 축 그려주기
		var circles = circleGraphHolder.selectAll("circle")
			  .data(xScale.ticks(5))
			.enter().append("circle")
			  .attr("r", function(d) {return barScale(d);})
			  .style("fill", "rgba(0, 0, 0,0.02)")
			  .style("stroke", "rgba(0,0,0,0.5)")
			  .style("stroke-dasharray", "2")
			  .style("stroke-width",".5px");

		var arc = d3.arc()
				.innerRadius(0)
				.startAngle(function(d,i) { return (i * 2 * Math.PI) / numBars; }) //시작각
				.endAngle( function(d,i) { return ((i + 1) * 2 * Math.PI) / numBars; }); //끝각			
		if(type=="intro"){
			var segments = circleGraphHolder.selectAll("path")
					.data(data)
				.enter().append("path")
					.each(function(d,i) { 
						var radi = barScale(randomRange(0,5) );
						d.outerRadius = radi;
					})
					.style("fill", function(d,i){
						if(d.type=="major"){
							return "url(#greenGrad)";
						}else if(d.type=="minor") {
							return "#ff561b";				
						}			
					})
					.attr("d", arc)
					.attr("class", "each-graph");
		}else if(type=="user"){
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

			var tooltip = d3.select(".tooltip");
			segments.on("mouseover", function(d) {
					d3.select(this).classed("graph-hover", true);
					tooltip
					  //.style("left", d3.event.pageX - 30 + "px")
					  //.style("top", d3.event.pageY - 160 + "px")
					  .style("display", "inline-block")
					  .html((d.area) + "<br><span>" + (d.value) + "</span>");
					
				})
				.on("mouseout", function(d) {
					d3.select(this).classed("graph-hover", false)
					tooltip.style("display", "none");
				});

		}else if(type="interviewee"){
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
		}


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
		  .style("stroke-opacity", (type=="intro")? "0.2":"0.7")
		  .style("stroke-width",".5px")
		  .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });

		var baseLine = circleGraphHolder.append("line")
			.classed("baseline", true)
			.attr("y2",(barHeight+200)*2 )
			.style("stroke", "#111")
			.style("stroke-width","2px")
			.attr("transform", "translate(0,"+ -1*(barHeight+200)+")");

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
			.style("font-size","11")
			.style("fill", function(d, i) {return "#111";})
			.append("textPath")
			.attr("class","label-text")
			.attr("xlink:href", "#label-path")
			.attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
			.text(function(d) {return d.toUpperCase(); });


	};


	makeChartBasic("#headGraph", introChartData, svgWidth, "intro", 20);
	makeChartBasic("#userResult", interviewwData1, svgWidth, "user", 20);
	makeChartBasic("#intervieweeChart01", interviewwData1, svgWidth, "interviewee", 20);
	makeChartBasic("#intervieweeChart02", interviewwData2, svgWidth, "interviewee", 20);
			
	$(".loading-page").fadeOut(200, function(){
		
	});

	
	function showTestPage(){
		$(".page--1").fadeOut(function(){
			$(".page--2").fadeIn();
			var testPagePosTop = $(".test-area-header").offset().top;
			$("html, body").animate({scrollTop: testPagePosTop -100}, 500, "swing");
		});
	};

	function showResultPage(){
		$(".page--2").fadeOut(function(){			
			$(".page--3").fadeIn();		
			var resultPagePosTop = $(".user-result-header").offset().top;
			$("html, body").animate({scrollTop: resultPagePosTop -100}, 500, "swing");
		});
	};


	$("#goTestBtn").on("click", function(){
		showTestPage();
	});
	$("#goResultBtn").on("click", function(){
		showResultPage();
	});

});