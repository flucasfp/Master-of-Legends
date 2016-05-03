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

    //public vars/methods:
    return{
    	createOverviewChart: createOverviewChart,
		createPieChartDrilldown: createPieChartDrilldown
    };
})();
