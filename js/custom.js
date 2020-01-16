$(function(){
	var ieTest = false,
		screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		imgURL = "http://img.khan.co.kr/spko/storytelling/2019/running/",
		isMobile = screenWidth <= 800 && true || false,
		isNotebook = (screenWidth <= 1300 && screenHeight < 750) && true || false,
		isMobileLandscape = ( screenWidth > 400 && screenWidth <= 800 && screenHeight < 450 ) && true || false;
	window.onbeforeunload = function(){ window.scrollTo(0, 0) ;}
	var svgWidth = (screenWidth > 600)? 600 : screenWidth-20,
		svgHeight = (screenHeight > 600) ? 600: screenHeight-20,
	    barHeight = svgHeight / 2 - 40;
	var powerCategory = ["성별 차별X", "이성애", "고학력","서울", "외모차별 X", "나이차별 X", "경제력(중산층)", "비장애", "성별차별 O", "성소수자", "저학력", "지방", "외모차별 O", "나이차별 O", "경제력(중산층 X)", "장애"];
	var recordName = ["ngender", "hetero", "edu", "seoul", "nlooks", "nage", "wealth", "ndisable", "gender", "nhetero", "nedu", "nseoul", "looks", "age", "nwealth", "disable", "agegroup", "sex"];

	var circleAxisBgColor = ["#cfcfcf", "#d8d8d8", "#e1e1e1", "#ebebeb","#f5f5f5"];
	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};

	var interviewwData1 = [
		{area: "성별 차별X", value: 0, type: "major"},
		{area: "이성애", value: 5, type: "major"},
		{area: "고학력", value: 2, type: "major"},
		{area: "서울", value: 0, type: "major"},
		{area: "외모차별 X", value: 4, type: "major"},
		{area: "나이차별 X", value: 0, type: "major"},
		{area: "경제력(중산층)", value: 0, type: "major"},
		{area: "비장애", value: 5, type: "major"},
		{area: "성별차별 O", value: 2, type: "minor"},
		{area: "성소수자", value: 0, type: "minor"},
		{area: "저학력", value: 0, type: "minor"},
		{area: "지방", value: 2, type: "minor"},
		{area: "외모차별 O", value: 0, type: "minor"},
		{area: "나이차별 O", value: 4, type: "minor"},
		{area: "경제력(중산층 X)", value: 0, type: "minor"},
		{area: "장애", value: 0, type: "minor"}
  	];

	var interviewwData2 = [
		{area: "성별 차별X", value: 3, type: "major"},
		{area: "이성애", value: 0, type: "major"},
		{area: "고학력", value: 5, type: "major"},
		{area: "서울", value: 5, type: "major"},
		{area: "외모차별 X", value: 0, type: "major"},
		{area: "나이차별 X", value: 4, type: "major"},
		{area: "경제력(중산층)", value: 3, type: "major"},
		{area: "비장애", value: 0, type: "major"},
		{area: "성별차별 O", value: 0, type: "minor"},
		{area: "성소수자", value: 3, type: "minor"},
		{area: "저학력", value: 0, type: "minor"},
		{area: "지방", value: 0, type: "minor"},
		{area: "외모차별 O", value: 3, type: "minor"},
		{area: "나이차별 O", value: 0, type: "minor"},
		{area: "경제력(중산층 X)", value: 0, type: "minor"},
		{area: "장애", value: 3, type: "minor"}
  	];

	var statChartData = [];
	var statData;

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
			svgWidth = svgHeight = chartWidth,
			barHeight = svgHeight / 2 - (padding*2);

		var svg = d3.select(svgName)
			.attr("width", svgWidth)
			.attr("height", svgHeight)
			.append("g")
			.attr("transform", "translate(" + svgWidth/2 + "," +svgHeight/2 + ")")
			.attr("class", "svgHolder");

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
			.attr("transform", "translate(" + -45 + "," + -(svgHeight/2+7) + ")");
		graphBack.append("text")
			.attr("x", "15")
			.attr("y", "-15")
			.style("font-weight","bold")
			.style("font-size","14")
			.style("fill", function(d, i) {return "#f16d48";})
			.text("차별영역")
			.attr("class", "graph-semi-title")
			.attr("text-anchor", "start")
			.attr("transform", "translate(" + -45 + "," +(svgHeight/2+7) + ")");

		var circleGraphHolder = svg.append("g")
			.attr("class","circle-graph-holder")
			.attr("transform", "rotate(-90)");

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

		var segments = circleGraphHolder.selectAll("path")
				.data(data)
				.enter().append("path");

		if(type=="intro"){

			var checkPoint = new Array(data.length);
			checkPoint.forEach(function(v,i,a){
				v[i] = 0;
			});
			segments.each(function(d,i) {
						var radi = barScale(randomRange(1,5) );

						if (i < data.length/2){
							if (randomRange(0, 1) == 1){
								checkPoint[i] = 1;
								d.outerRadius = radi;
							} else {
								checkPoint[i] = 0;
								d.outerRadius = 0.1;
							}
						} else {
							if (checkPoint[i-(data.length/2)] == 0) {
								d.outerRadius = radi;
							} else {
								d.outerRadius = 0.1;
							}
						}

					})
					.style("fill", function(d,i){
						if(d.type=="major"){
							return "url(#greenGrad)";
						}else if(d.type=="minor") {
							return "url(#redGrad)";
						}
					});

		} else if(type=="user"){

			segments.each(function(d,i) {  //데이터 값에 맞게 길이를 반환해줌
						var radi = barScale(d.value);
						d.value == 0 ? d.outerRadius = 0.1 : d.outerRadius = radi;
					})
					.style("fill", function(d,i){
						if(d.type=="major"){
							//return "url(#greenGrad)";
							return "#40a778";
						}else if(d.type=="minor") {
							//return "url(#redGrad)";
							return "#f16d48";
						}
					});
					//.attr("filter", "url(#glow)");
			if(isMobile==false){
				var tooltip = d3.select(".tooltip");
				segments.on("mouseover", function(d) {
						d3.select(this).classed("graph-hover", true);
						tooltip
						  .style("left", d3.event.pageX - 30 - (svgWidth/2)+ "px")
						  .style("top", d3.event.pageY - 160 - (svgHeight/2) + "px")
						  .style("display", "inline-block")
						  .html((d.area) + "<br><span>" + (d.value) + "</span>");

					})
					.on("mouseout", function(d) {
						d3.select(this).classed("graph-hover", false)
						tooltip.style("display", "none");
					});
			}

		}else if(type="interviewee"){

			segments.each(function(d,i) {  //데이터 값에 맞게 길이를 반환해줌
						var radi = barScale(d.value);
						d.outerRadius = radi;
					})
					.style("fill", function(d,i){
						if(d.type=="major"){
							//return "url(#greenGrad)";
							return "#40a778";
						}else if(d.type=="minor") {
							//return "url(#redGrad)";
							return "#f16d48";
						}
					});
					//.attr("filter", "url(#glow)");
		}

		segments
		.transition()
		.attr("d", arc)
		.attr("class", "each-graph");



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
			.style("font-size",(isMobile==true)? "8px":"11px")
			.style("fill", function(d, i) {return "#111";})
			.append("textPath")
			.attr("class","label-text")
			.attr("xlink:href", "#label-path")
			.attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
			.text(function(d) {return d.toUpperCase(); });

		if(isMobile==true){
			d3.select(".title-up").style("top", svgHeight/2-28+"px");
			d3.select(".title-down").style("top", svgHeight/2+"px");
		}

	};


	var introAni;
	function startIntroAni(){
		introAni = setInterval(function(){
			var arc = d3.arc()
					.innerRadius(0)
					.startAngle(function(d,i) { return (i * 2 * Math.PI) / 16; }) //시작각
					.endAngle( function(d,i) { return ((i + 1) * 2 * Math.PI) / 16; }); //끝각

			var extent = [0, 5];

			var barScale = d3.scaleLinear()
			  .domain([0, 5])
			  .range([0, svgHeight / 2 - 40]);

			var checkPoint = new Array(introChartData.length);
			checkPoint.forEach(function(v,i,a){
			  v[i] = 0;
			});

			d3.select("#headGraph").selectAll("path").data(introChartData)
			.each(function(d,i) {
				var radi = barScale(randomRange(1,5));
				if (i < introChartData.length/2){
					if ( randomRange(0, 1) == 1 ){ // 50% 확률로 1, 이 경우 반대축은 0
						checkPoint[i] = 1;
						d.outerRadius = radi;
					} else {// 50% 확률로 0, 0 나오면 이 축은 0 반대축이 값이 나옴
						checkPoint[i] = 0;
						d.outerRadius = 0.1;
					}
				} else {
					if (checkPoint[i-(introChartData.length/2)] == 0) {
						d.outerRadius = radi;
					} else {
						d.outerRadius = 0.1;
					}
				}
			})
			.transition()
			.duration(1000)
			.attr("d", arc);
		}, 1500);

	}

	makeChartBasic("#headGraph", introChartData, svgWidth, "intro", 20);
	function hidePageTitle(){
		$(".title-img").css({"height":"1px"});
		if(isMobile==true){
			$(".title-up .title-img").css({"top":"28px"});
			$(".title-down .title-img").css({"top":"-10px"});
		}else{
			$(".title-up .title-img").css({"top":"82px"});
			$(".title-down .title-img").css({"top":"-12px"});
		}

	}
	function showPageTitle(){
		$(".title-up .title-img").animate({"height": $(".title-up .title-img").children("img").height()+"px", "top":"0px"},1500, "easeInOutQuad");
		$(".title-down .title-img").animate({"height": $(".title-down .title-img").children("img").height()+"px", "top":"0px"}, 1500, "easeInOutQuad");
	}

	hidePageTitle();

	if(isMobile==true){
		$(".test-area-body .que-list > ul > li").eq(0).css({"margin-top":"0"});
	}
	$(".loading-page").fadeOut(200, function(){
		startIntroAni();
		showPageTitle();
	});

	var userTestData = [];
	for(i=0;i<powerCategory.length;i++){
		var obj = {};
		obj.area = powerCategory[i];
		obj.value = 0;
		obj.type = (i>7)? "minor":"major";
		userTestData.push(obj);
	};


	var userChoice = [0,0,0,0,0,0,0,0];

	function makeScrollDownAuto(){
		$("html, body").animate({scrollTop: scrollValue + ( $(".test-area-body .que-list > ul > li").height()+30)}, 500, "swing");
	};

	$(".test-form .each-scale .anw-button").on("click", function(e){
		var clickedQueNum = $(this).siblings(".radio-hidden").attr("name").slice(4,5);
		var clickedValue = $(this).siblings(".radio-hidden").attr("value");
		var clickedPower = (clickedValue > 0)? "minor" : "major";

		if(clickedPower == "minor"){
			userTestData[Number(clickedQueNum)+8-1].value = Math.abs(clickedValue);
			userTestData[Number(clickedQueNum)-1].value = 0;
			userChoice[clickedQueNum-1] = "minor";
		}else if(clickedPower == "major"){
			userTestData[Number(clickedQueNum)-1].value = Math.abs(clickedValue);
			userTestData[Number(clickedQueNum)+8-1].value = 0;
			userChoice[clickedQueNum-1] = "major";
		}
		$(".bottom-fixed-bar .progress-bar .progress-text p .done").html( checkRadioBtnStatus());
		$(".bottom-fixed-bar .progress-bar .progress-body").animate({"width":100/8*checkRadioBtnStatus()+ "%"}, 400, "swing");
		makeScrollDownAuto();
	});

	var checkedPoint;
	function checkRadioBtnStatus(){
		checkedPoint = 0;
		for(u=0; u< userChoice.length; u++){
			if( isNaN(userChoice[u])){
				checkedPoint++;
			}
		}
		if(checkedPoint>=8){ $("#goResultBtn").removeClass("button-blocked");  }
		return checkedPoint;
	};

	var userInfoData = ["","",""];
	$(".user-info-que-list .anw-button").on("click", function(e){
		var clickedQueType = $(this).siblings(".radio-hidden").attr("name").slice(5);
		var clickedValue = $(this).siblings(".radio-hidden").attr("value");
		if(clickedQueType=="sex"){
			userInfoData[0] = clickedValue;
		}if(clickedQueType=="age"){
			userInfoData[1] = clickedValue;
		}
	});
	$("textarea#user-opinion").bind("input propertychange", function() {
		inputUserWord();
	});
	function inputUserWord(){
		userInfoData[2] = $("textarea#user-opinion").val().replace(/,/g,"，");
	}

	function drawPercentBar(){
		var majorNumb = 0,
			minorNumb = 0;
		for(m=0; m< userChoice.length; m++){
			if( userChoice[m] == "major"){
				majorNumb++;
			}
			if(m==userChoice.length){
				minorNumb = userChoice.length-majorNumb;
			}
		}
		var majorPer = Math.round(100/8*majorNumb),
			minorPer = 100 - majorPer;
		$(".bar-body").css({"width": minorPer+"%"});
		$(".result-percent-bar .percent-bar .user-pos").css({"left":minorPer+"%"});
		$(".side-major .numb").html(majorPer);
		$(".side-minor .numb").html(minorPer);
	};

	function drawUserScaleBlcok(){
		var $blockHolder = $(".user-result-table .scale-block-holder");
		var $textHead = $(".user-result-table .majororminor");
		for(i=0;i<$blockHolder.length;i++){
			$blockHolder.eq(i).removeClass("block-minor block-major");
			$blockHolder.eq(i).addClass("block-"+userChoice[i]);
			$textHead.eq(i).removeClass("major minor");
			$textHead.eq(i).html( (userChoice[i]=="major")? "특권":"차별" );
			$textHead.eq(i).addClass(userChoice[i]);
			$blockHolder.eq(i).html("");
			for(n=0;n<userTestData[i].value;n++){
				$blockHolder.eq(i).append("<span class='scale-block'></span>");
			}
			for(m=0;m<userTestData[i+8].value;m++){
				$blockHolder.eq(i).append("<span class='scale-block'></span>");
			}
		}
	};

	function resetTestValue(){
		 resetRadioValue();
		 $("textarea#user-opinion").val("");
		 for(n=0;n<userChoice.length;n++){
			userChoice[n] = 0;
		 }
		 for(d=0;d<userInfoData.length;d++){
			userInfoData[d] = "";
		 }
		 $("#userResult .svgHolder").remove();
		 $(".switch-btn-holder .each-btn").removeClass("on");
		 $(".show-user").addClass("on");
		 $(".show-average").addClass("show-average-blocked");
		 $(".result-chart").removeClass("result-chart-average");
	};
	function resetRadioValue(){
		var radio_name = [];
		var radio = $("input[type=radio]");
		$.each(radio, function (key, value) {
			radio_name.push($(value).attr("name"));
		});
		radio_name = $.unique(radio_name.sort()).sort();
		//console.log(radio_name);
		for (var i = 0; i < radio_name.length; i++) {
			$('input[name="' + radio_name[i] + '"]').removeAttr("checked");
			//$('input[name="' + radio_name[i] + '"]')[0].checked = true;
		}
		$(".bottom-fixed-bar .progress-bar .progress-text p .done").html("0");
		$(".bottom-fixed-bar .progress-bar .progress-body").width("0%");
		$("#goResultBtn").addClass("button-blocked");
	}

	function goBackTestPage(){
		resetTestValue();
		$(".page--3").fadeOut(function(){
			$(".page--2").fadeIn();
			var testPagePosTop = $(".test-area-header").offset().top;
			$("html, body").animate({scrollTop: testPagePosTop -100}, 500, "swing");
		});
	};

	function showTestPage(){
		$(".page--1").fadeOut(function(){
			$(".page--2").fadeIn();
			var testPagePosTop = $(".test-area-header").offset().top;
			$("html, body").animate({scrollTop: testPagePosTop -100}, 500, "swing");
		});
	};

	function showResultPage(){
		$(".page--2").fadeOut(function(){
			makeChartBasic("#userResult", userTestData, svgWidth, "user", 20);
			makeChartBasic("#intervieweeChart01", interviewwData1, svgWidth, "interviewee", 20);
			makeChartBasic("#intervieweeChart02", interviewwData2, svgWidth, "interviewee", 20);
			//console.log(userTestData);
			//console.log(userChoice);
			//console.log(userInfoData);
			drawPercentBar();
			drawUserScaleBlcok();
			$(".page--3").fadeIn();
			var resultPagePosTop = $(".user-result-header").offset().top;
			$("html, body").animate({scrollTop: resultPagePosTop -100}, 500, "swing");
		});
	};

	function statDataPlot(t){

		statChartData = [];
		
		var typeCount;
		statData.forEach(function(v, i, a){
			if (v.type == t){
				typeCount = v.count;
				for(i = 0; i < powerCategory.length; i++){
					var temp = {};
					temp.area = powerCategory[i];
					temp.value = v[recordName[i]];
					//temp.value = Number((v[recordName[i]] / v.count).toFixed(2));
					temp.type = (i > 7) ? "minor":"major";
					statChartData.push(temp);
				}
			}			
		});

		//console.log(statChartData);

		for (i = 0; i < 8; i++){
			var valueSum = Number(((statChartData[i].value - statChartData[i+8].value) / typeCount ).toFixed(2));
			if (valueSum > 0){
				statChartData[i].value = valueSum;
				statChartData[i+8].value = 0;
			} else if (valueSum < 0) {
				statChartData[i].value = 0;
				statChartData[i+8].value = Math.abs(valueSum);
			} else {
				statChartData[i].value = 0;
				statChartData[i+8].value = 0;
			}
		}

		makeChartBasic("#userResult", statChartData, svgWidth, "user", 20);
	}

	function switchingResultGraphc(t){
		$("#userResult .svgHolder").remove();
		if(t =="user"){
			$(".result-chart").removeClass("result-chart-average");
			makeChartBasic("#userResult", userTestData, svgWidth, "user", 20);
			$(".category-tab").hide();
			$(".category-tab ul li").removeClass("on");
			$(".category-tab ul li").eq(0).addClass("on");
		}else if(t =="average"){
			$(".result-chart").addClass("result-chart-average");
			$(".category-tab").show();
			statDataPlot("all");
		}
	};

	$(".category-tab ul li").on("click", function(){
		$(".category-tab ul li").removeClass("on");
		$(this).addClass("on");	
		
		var type = $(this).attr("data-type");
		$("#userResult .svgHolder").remove();
		statDataPlot(type);
	});

	$("#goTestBtn").on("click", function(){
		clearInterval(introAni);
		showTestPage();
	});
	$("#goResultBtn").on("click", function(){

		var record = {};
		userTestData.forEach(function(v, i, a){
			record[recordName[i]] = v.value;
		});

		record.sex = userInfoData[0];
		record.agegroup = userInfoData[1];
		record.comment = userInfoData[2];
		record.password = "ok!";

		setTimeout(function(){
			$.ajax({
				url: "dataload.php",
				data: record,
				type: "POST",
				success: function() {
					$.getJSON("dataload.php", function(data) {
						statData = data;
						console.log(statData);
						$(".totalUserNumb").html(statData[0].count + "명");
						$(".user-result-share .des em").show();
						$(".show-average").removeClass("show-average-blocked");

					});
				}

			});

		}, 500);

		showResultPage();

	});


	$("#retest").on("click", function(){
		goBackTestPage();
	});

	$(".switch-btn-holder .each-btn").on("click", function(){
		var typeCheck = ($(this).hasClass("show-user"))? "user":"average";
		switchingResultGraphc(typeCheck);
		$(".switch-btn-holder .each-btn").removeClass("on");
		$(this).addClass("on");
	});

	var scrollValue;
	$(window).scroll(function(){
		scrollValue = $(document).scrollTop();
	});


});

function sendSns(s) {
  var url = encodeURIComponent(location.href),
	  txt = encodeURIComponent($("title").html());
  switch (s) {
    case 'facebook':
      window.open('http://www.facebook.com/sharer/sharer.php?u=' + url);
      break;
    case 'twitter':
      window.open('http://twitter.com/intent/tweet?text=' + txt + '&url=' + url);
      break;
  }
}
