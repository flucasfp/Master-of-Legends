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


	var championsCoordChart;
	var dataCoordChart;
	var divCoordChart = "#coordChartContainer";
	function makeParalCoordChart(){
		var champions = chartCreator.championsCoordChart;
		var data = chartCreator.dataCoordChart;

		//before call this function, set the championsCoordChart and dataCoordChart vars!
		var margin = {top: 30, right: 140, bottom: 30, left: 20};
		var width = parseInt($(divCoordChart).css("width"));

		var height = 400;
		var spaceBetweenAxis = 160;
		var coordNumber = 3;
		var coordLabels = ['Win Rate','Champion Points','LegendScore'];

		d3.selectAll("#coordChart").remove();

		var svgContainer = d3.select(divCoordChart).append("svg")
			.attr("id","coordChart")
			.attr("width",width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var winRateScale = d3.scale.linear().domain([0,1]).range([0,(width-margin.right-margin.left)]);
		var pointsScale = d3.scale.linear().domain([10000,100000]).range([0,(width-margin.right-margin.left)]);
		var scoreScale = d3.scale.linear().domain([200,800]).range([0,(width-margin.right-margin.left)]);

		var xAxisWinRate = d3.svg.axis().scale(winRateScale).orient("top");
		var xAxisPoints = d3.svg.axis().scale(pointsScale);
		var xAxisScore = d3.svg.axis().scale(scoreScale);

		
		var scoreYPosition = margin.left+"," + (height-margin.bottom);

		svgContainer.append('g').attr("class", "x axis")
	    							.attr("transform", "translate("+scoreYPosition+ ")")
	    							.call(xAxisScore);

	    var pointsYPosition =  (height-margin.bottom - (spaceBetweenAxis*1));

	   	svgContainer.append('g')
	   						.attr("class","x axis")
	   						.attr("transform", "translate("+margin.left+"," +pointsYPosition+ ")")
	   						.call(xAxisPoints);

	   	var winRateYPosition =  (height-margin.bottom - (spaceBetweenAxis*2));

		svgContainer.append('g')
	   						.attr("class","x axis")
	   						.attr("color","white")
	   						.attr("transform", "translate("+margin.left+"," +winRateYPosition+ ")")
	   						.call(xAxisWinRate);
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
