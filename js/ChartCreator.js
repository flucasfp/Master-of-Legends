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
	        		console.log(tooltip[this.x]);
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


    //public vars/methods:
    return{
    	createOverviewChart: createOverviewChart

    };
})();
