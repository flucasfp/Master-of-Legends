var chartCreator=(function(){

	function createOverviewChart(div,summonerName,summonerMastery){
		var arrayXAxisNames = [];
		var data = [];
		var tooltip = {};
		var currentChampionName = "";
		var currentChampionKey = "";
		var championHtmlString = "";
		var currentTooltip = {};

		for(var i=0; i<summonerMastery.length; i++){
			if(summonerMastery[i].championLevel != 1 && summonerMastery[i].championLevel != 2){
				currentChampionKey = championModule.getChampionKeyByID(summonerMastery[i].championId);
				currentChampionName = championModule.championsInfo.data[currentChampionKey].name;
				championHtmlString = currentChampionName;
				currentTooltip = "<img width='50px' height='50px' src='"+championModule.getChampionSquareImgURL(currentChampionKey)+"'></img><div><b style='font-size:18px'>"+
					currentChampionName+"</b>,<br>"+championModule.championsInfo.data[currentChampionKey].title
					+"</div>"+summonerMastery[i].championPoints+" Champion Points";

				tooltip[currentChampionName] = currentTooltip;

				arrayXAxisNames.push(championHtmlString);
				data.push(summonerMastery[i].championPoints);
			}
		}

		var chart = $('#'+div).highcharts({
	        chart: {
	            type: 'column',
	            backgroundColor: 'transparent',
	            style:{
	            	color:'white'
	            }
	       	},
	        title: {
	        	text: summonerName+"'s Champions Mastery",
	        	style:{
	                	color: 'white'
	            }
	        },
	        subtitle:{
	        	text: "Ignoring levels 1 and 2",
	        	style:{
	        		color:'white'
	        	}
	        },
	        xAxis: {
	            categories: arrayXAxisNames,
	            crosshair: false,
	            labels:{
	            	style:{
	            		color:'white'
	            	}
	            }
	        },
	        plotOptions: {
	            series: {
	                animation: {
	                    duration: 1500
	                }
	            }
        	},
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Champion Points',
	                style:{
	                	color: 'white'
	                }
	            },
	            labels:{
	            	style:{
	            		color:'white'
	            	}
	            }
	        },
	        tooltip:{
	        	useHTML: true,
	        	formatter: function(){
					return tooltip[this.x];
	        	}
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: [
	        	{showInLegend: false, 
	            name: 'Champions',
	            data: data}
	        ]
	    });
	};

	function createPieChartDrilldown(div,titleText,dataInput){
		var series = dataInput.series;
		var drilldown = dataInput.drilldown;

		$('#'+div).highcharts({
			chart: {
			    type: 'pie',
				backgroundColor: 'transparent',
	            style:{
	            	color:'white'
	            }
			},
			noData:{
			    style: {
	                fontWeight: 'bold',
	                fontSize: '15px',
	                color: 'white'
            	},
            	useHTML:true
			},
			lang:{
				noData:"<div style='text-align:center'>No data to display :(<br>You should play more!</div>"
			},
		    legend: { 
		        borderRadius: 5,
		        borderWidth: 1,
				backgroundColor: 'white'
		    },
			title: {
				text: titleText,
				style:{
	                	color: 'white'
	            }
			},
			subtitle: {
			    text: 'Click the slices to view Champions and click the legends to filter',
				style:{
	                	color: 'white'
	            }
			},
			plotOptions: {
			pie: {
			            allowPointSelect: true,
			            cursor: 'pointer',
			            dataLabels: {
			                enabled: false
			            },
			            showInLegend: true
			        },
			    series: {
			        dataLabels: {
			            enabled: false
			        }
			    },
			},

			tooltip:{
		        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> Champion Points<br/>'
		    },
			series:series,
			drilldown:drilldown
	    });
	};

	//Everything now is part of the Parallel Coordinates Chart:
	function numberStringFormatter(number){
		var s = "";
		if((number/1000000)>=1){
			return ((number/1000000)+"m");
		}
		if((number/1000)>=1){
			return ((number/1000)+"k");
		}
		return number;
	}

	var imgSize = 36;
	var championsCoordChart;
	var dataCoordChart;
	var svgContainer;
	var divCoordChart = "#coordChartContainer";
	var coorChartColors = ['#1f78b4','#e31a1c','#33a02c','#fdbf6f','#ff7f00','#a6cee3','#cab2d6','#6a3d9a','#fb9a99','#b2df8a','#ffff99','#b15928'];
	//creating the div that will be the tooltip:
   	$("#coordChartTooltipDiv").remove();
   	var tooltipDiv = d3.select('body').append("div")
   						.attr("id","coordChartTooltipDiv")
					    .attr("class", "coordChart-tooltip")
					    .style("display", "none");
	function createParalChartTooltip(i,championID,winRate,points,score,lineHover){
		return function(){
			var championName = championModule.getChampionNameByID(championID);
			var championImgURL = championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(championID));
			var htmlString = "<div class='tooltipInnerDiv'>";
			htmlString = htmlString + "<img src='"+championImgURL+"'></img>"+"<br><span><b>"+championName+"<b></span><br>";
			htmlString = htmlString + "<br><b>Win Rate: </b>"+winRate*100+"%";
			htmlString = htmlString + "<br><b>Champion Points: </b>"+points+"";
			htmlString = htmlString + "<br><b>LegendScore: </b>"+score+"";
			htmlString = htmlString + "</div>";
			$("#coordChartTooltipDiv").html(htmlString);
			if(lineHover){
				//If the mouse hovered the line, redraw the image of the champion
				//This way the champion go above the others in the axix
				var img1 = svgContainer.select(".winRateImgChamp"+championID);
				img1.remove();
				svgContainer.append("svg:image")
							.attr("width",imgSize)
	   						.attr("height",imgSize)
		   					.attr("class","winRateImgChamp"+championID)
		   					.attr("x",$(img1[0][0]).attr("x"))
		   					.attr("y",$(img1[0][0]).attr("y"))
		   					.attr("xlink:href",championImgURL);	

				var img2 = svgContainer.selectAll(".pointsImgChamp"+championID);
				img2.remove();
				svgContainer.append("svg:image")
							.attr("width",imgSize)
	   						.attr("height",imgSize)
		   					.attr("class","pointsImgChamp"+championID)
		   					.attr("x",$(img2[0][0]).attr("x"))
		   					.attr("y",$(img2[0][0]).attr("y"))
		   					.attr("xlink:href",championImgURL);	

				var img3 = svgContainer.selectAll(".scoreImgChamp"+championID);
				img3.remove();
				svgContainer.append("svg:image")
							.attr("width",imgSize)
	   						.attr("height",imgSize)
		   					.attr("class","scoreImgChamp"+championID)
		   					.attr("x",$(img3[0][0]).attr("x"))
		   					.attr("y",$(img3[0][0]).attr("y"))
		   					.attr("xlink:href",championImgURL);	
			}

			$("#coordChartTooltipDiv").show();

		};
	}
	function makeParalCoordChart(){
		var filter = $("#paralCoordFilter").val().toLowerCase();
		var champions = chartCreator.championsCoordChart;
		var data = chartCreator.dataCoordChart;

		if(typeof data === 'undefined'){
			return;
		}
		//before call this function, set the championsCoordChart and dataCoordChart vars!
		var margin = {top: 30, right: 140, bottom: 30, left: 20};
		var width = parseInt($(divCoordChart).css("width"));

		var height = 400;
		var spaceBetweenAxis = 160;
		var coordNumber = 3;
		
		d3.selectAll("#coordChart").remove();

		svgContainer = d3.select(divCoordChart).append("svg")
			.attr("id","coordChart")
			.attr("width",width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    var maxPoints = -1;
	    var maxScore = -1;

	    for(var i=0;i<data.length;i++){
	    	if(data[i][1]>maxPoints){
	    		maxPoints = data[i][1];
	    	}
	    	if(data[i][2]>maxScore){
	    		maxScore = data[i][2];
	    	}
	    }

		var winRateScale = d3.scale.linear().domain([0,1]).range([0,(width-margin.right-margin.left)]);
		var pointsScale = d3.scale.linear().domain([0,maxPoints]).range([0,(width-margin.right-margin.left)]);
		var scoreScale = d3.scale.linear().domain([0,maxScore]).range([0,(width-margin.right-margin.left)]);

		var xAxisWinRate = d3.svg.axis().scale(winRateScale).tickFormat(function(d){return (d*100)+"%";});
		var xAxisPoints = d3.svg.axis().scale(pointsScale).tickFormat(numberStringFormatter);
		var xAxisScore = d3.svg.axis().scale(scoreScale).tickFormat(numberStringFormatter);

		var spaceBetweenAxisAndTextLabel = 20;

		var scoreYPosition = margin.left + (height-margin.bottom);

		svgContainer.append('g').attr("class", "x axis")
	    							.attr("transform", "translate("+margin.left+","+scoreYPosition+ ")")
	    							.call(xAxisScore);

	    var pointsYPosition =  (height-margin.bottom - (spaceBetweenAxis*1));


	   	svgContainer.append('g')
	   						.attr("class","x axis")
	   						.attr("transform", "translate("+margin.left+"," +pointsYPosition+ ")")
	   						.call(xAxisPoints);

	   	var winRateYPosition =  (height-margin.bottom - (spaceBetweenAxis*2));

		svgContainer.append('g')
	   						.attr("class","x axis")
	   						.attr("transform", "translate("+margin.left+"," +winRateYPosition+ ")")
	   						.call(xAxisWinRate);

	   	//Inserting the axis labels:
	   	svgContainer.append("text")
	   						.text("Win Rate")
	   						.attr("class","axis-label")
	   						.attr("x", width-margin.right+spaceBetweenAxisAndTextLabel)
	   						.attr("y",winRateYPosition+5);
	    svgContainer.append("text")
	   						.text("Champion")
	   						.attr("class","axis-label")
	   						.attr("x", width-margin.right+spaceBetweenAxisAndTextLabel)
	   						.attr("y",pointsYPosition+5);
	   	svgContainer.append("text")
	   						.text("Points")
	   						.attr("class","axis-label")
	   						.attr("x", width-margin.right+spaceBetweenAxisAndTextLabel)
	   						.attr("y",pointsYPosition+6+parseInt($(".axis-label").css("font-size")));
		svgContainer.append("text")
	   						.text("Legend")
	   						.attr("class","axis-label")
	   						.attr("x", width-margin.right+spaceBetweenAxisAndTextLabel)
	   						.attr("y",scoreYPosition+5);
	   	svgContainer.append("text")
	   						.text("Score")
	   						.attr("class","axis-label")
	   						.attr("x", width-margin.right+spaceBetweenAxisAndTextLabel)
	   						.attr("y",scoreYPosition+6+parseInt($(".axis-label").css("font-size")));


	   	for(var i=0;i<data.length;i++){
	   		if(filter.length==0 || championModule.getChampionNameByID(champions[i]).toLowerCase().indexOf(filter)!=-1 || championModule.getChampionRoleByID(champions[i]).toLowerCase() == filter ){
		   		var polylinePoints = "";
		   		polylinePoints=polylinePoints+parseInt(winRateScale(data[i][0])+margin.left)+","+winRateYPosition+" ";
				polylinePoints=polylinePoints+parseInt(pointsScale(data[i][1])+margin.left)+","+pointsYPosition+" ";
				polylinePoints=polylinePoints+parseInt(scoreScale(data[i][2])+margin.left)+","+scoreYPosition;	   		
		   		//line from winrate to champion points
		   		svgContainer.append("polyline")
		   					.attr("id","champLine"+champions[i])
		   					.attr("class","coordChart-line")
		   					.attr("points",polylinePoints)
		   					.attr("stroke", coorChartColors[i%coorChartColors.length])
		   					.on('mouseover',createParalChartTooltip(i,champions[i],chartCreator.dataCoordChart[i][0],chartCreator.dataCoordChart[i][1],chartCreator.dataCoordChart[i][2],true))
		   					.on('mousemove',function(){
		   						tooltipDiv.style("left", (d3.event.pageX - 34) + "px")
	      								  .style("top", (d3.event.pageY - 12) + "px");
		   					})
		   					.on('mouseout',function(){
								$("#coordChartTooltipDiv").hide();	   						
		   					});
		   		

		   		//now insert the champion image
		   		var championImgURL = championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(champions[i]));
		   		var imagemX1 = svgContainer.append("svg:image")
		   					.attr("width",imgSize)
		   					.attr("height",imgSize)
		   					.attr("class","winRateImgChamp"+champions[i])
		   					.attr("x",parseInt(winRateScale(data[i][0])+margin.left-(imgSize/2)))
		   					.attr("y",winRateYPosition-imgSize)
		   					.attr("xlink:href",championImgURL);	

		   		var imagemX2 = svgContainer.append("svg:image")
		   					.attr("width",imgSize)
		   					.attr("height",imgSize)
		   					.attr("class","pointsImgChamp"+champions[i])
		   					.attr("x",parseInt(pointsScale(data[i][1])+margin.left-(imgSize/2)))
		   					.attr("y",pointsYPosition-imgSize)
		   					.attr("xlink:href",championImgURL);

		   		var imagemX3 = svgContainer.append("svg:image")
		   					.attr("width",imgSize)
		   					.attr("height",imgSize)
		   					.attr("class","scoreImgChamp"+champions[i])
		   					.attr("x",parseInt(scoreScale(data[i][2])+margin.left-(imgSize/2)))
		   					.attr("y",scoreYPosition-imgSize)
		   					.attr("xlink:href",championImgURL);
		   					
		   	}
		}
	}

   	//make it responsive!
	$(window).on('resize',function(){makeParalCoordChart()});
	

    //public vars/methods:
    return{
    	createOverviewChart: createOverviewChart,
		createPieChartDrilldown: createPieChartDrilldown,
		championsCoordChart:championsCoordChart,
		dataCoordChart:dataCoordChart,
		makeParalCoordChart:makeParalCoordChart
    };
})();
