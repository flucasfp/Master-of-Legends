var summonerModule =(function(){

	var summonerInfo = {};
	var summonerLeague = {"leagueNotFound":false};
	var accessKeySummonerInfo = ""; //string that stores the master Object Property of the response, ex: "lukehawk"
	var summonerMastery = {};
	var summonerMatches = {};
	var totalMasteryPoints = 0;

	function loadSummonerOverview(){
		//show summonerIcon	
		$("#summonerIcon").attr("src","http://ddragon.leagueoflegends.com/cdn/6.9.1/img/profileicon/"+summonerInfo[accessKeySummonerInfo].profileIconId+".png");
		//show summonerName
		$("#summonerName").text(summonerInfo[accessKeySummonerInfo].name);
		//show summonerRegion
		$("#summonerRegion").text("  "+summonerInfo.region);
		//show level or league
		if(summonerLeague.leagueNotFound){
			$("#summonerLevel").text("Level: "+summonerInfo[accessKeySummonerInfo].summonerLevel);	
		}else{
			$("#summonerLevel").addClass(summonerLeague[summonerInfo[accessKeySummonerInfo].id][0].tier).text(summonerLeague[summonerInfo[accessKeySummonerInfo].id][0].tier +" "+summonerLeague[summonerInfo[accessKeySummonerInfo].id][0].entries[0].division);
		}
	}

	function loadMasteryAndMatchesInformation(){
		serverCommunication.getMasteryAndMatches(summonerInfo[accessKeySummonerInfo].id,summonerInfo.region,checkSummonerMasteryandMasteryResponse);

	}

	function loadPage(){
		loadSummonerOverview();
		loadMasteryAndMatchesInformation();
	}

	function getHighestGrade(championSummonerMastery){
		if(Object.keys(championSummonerMastery).indexOf('highestGrade')!=-1){
			return championSummonerMastery.highestGrade;
		}else{
			return "-";
		}
	}

	function getLegendScore(winMatches,totalMatches,championPoints,kda){
		return kda;
	}
	function showSummonerParalCoordChart(champions,data){
		//IDs:
		chartCreator.championsCoordChart = champions;
		// [ [],[winrate, champPoints, legendScore], [] , ...  ]
		chartCreator.dataCoordChart =  data;
		
		chartCreator.makeParalCoordChart();
	}
	function showSummonerMasteryOverview(){
		var countChampions = 0;
		var maxShowed = 3;
		while(countChampions!=maxShowed && countChampions!=summonerMastery.length){
			$("#topChampionsMasteryList").append(championModule.createChampionListItemHTML(summonerMastery[countChampions],summonerMastery[countChampions].championPoints,true));
			countChampions++;
		}

		var countChampions = 0;
		var currentChampion = 0;
		while(countChampions!=maxShowed && currentChampion!=summonerMastery.length){
			if(!summonerMastery[currentChampion].chestGranted){
				$("#nextChestList").append(championModule.createChampionListItemHTML(summonerMastery[currentChampion],summonerMastery[currentChampion].championPoints,true));;
				countChampions++;
			}
			currentChampion++;
		}
	};

	function showSummonerMasteryList(){
		var targetDiv = "";
		for(var i=0;i<summonerMastery.length;i++){
			targetDiv = "#championLevelGroup"+summonerMastery[i].championLevel;
			$(targetDiv).show();
			$(targetDiv).append(championModule.createChampionListItemHTML(summonerMastery[i],summonerMastery[i].championPoints,true));

		}
		
	};

	function showSummonerMasteryChart(){
		chartCreator.createOverviewChart("allChampionsChartContainer",summonerInfo[accessKeySummonerInfo].name,summonerMastery);
	};

	function showSummonerPieCharts(){
		var divRolePieChart = "rolePiechart";
		var divLanePieChart = "lanePiechart";
		var rolePieChartTitle = summonerInfo[accessKeySummonerInfo].name+"'s Champion Points by Champion Role";
		var lanePieChartTitle = summonerInfo[accessKeySummonerInfo].name+"'s Champion Points by Played Position*";
		var roleData = {series:[{name:'Roles',colorByPoint:true,data:[]}],drilldown:{series:[]}};
		var laneData = {series:[{name:'Lanes',colorByPoint:true,data:[]}],drilldown:{series:[]}};
		
		if(summonerMastery.length!=0){
			//init roleData Object:
			for(var i=0; i<championModule.championRoles.length; i++){
				var roleObject = {};
				roleObject.name = championModule.championRoles[i];
				roleObject.y = 0;
				roleObject.drilldown = championModule.championRoles[i];
				roleData.series[0].data.push(roleObject);

				var drilldownObject = {};
				drilldownObject.name = championModule.championRoles[i];
				drilldownObject.id = championModule.championRoles[i];
				drilldownObject.data = [];
				roleData.drilldown.series.push(drilldownObject);
			};

			//set values to roleData Object
			for(var i=0; i<summonerMastery.length; i++){
				for(var k=0; k<roleData.series[0].data.length; k++){
					if(roleData.series[0].data[k].name == championModule.getChampionRoleByID(summonerMastery[i].championId) ){
						roleData.series[0].data[k].y = roleData.series[0].data[k].y + summonerMastery[i].championPoints;
						roleData.drilldown.series[k].data.push([championModule.getChampionNameByID(summonerMastery[i].championId),summonerMastery[i].championPoints]);
					}
				}
			}
		}




		var dict = matchesModule.groupLaneRoleChampion(summonerMatches.matches);
		//dict is an object in the tipe:{'Mid':{'champ1': 20,'champ2':30,'totalPoints':50}, {'Top':...}, ...}
		if(dict==null){
			dict = {};
		}else{
			var nextIndex = 0;
			var i=0;
			while(i<championModule.championLanesLabels.length){
			//for(var i=0;i<championModule.championLanesLabels.length;i++){
				if(dict.hasOwnProperty(championModule.championLanesLabels[i])){
					laneData.series[0].data.push({name:championModule.championLanesLabels[i],drilldown:championModule.championLanesLabels[i],y:dict[championModule.championLanesLabels[i]].totalPoints});
					laneData.drilldown.series.push({name:championModule.championLanesLabels[i],id:championModule.championLanesLabels[i],data:[]});
					//drilldowns:
					for(var k=0;k<Object.getOwnPropertyNames(dict[championModule.championLanesLabels[i]]).length;k++){
						var currentKey = Object.getOwnPropertyNames(dict[championModule.championLanesLabels[i]])[k];
						if(currentKey!='totalPoints'){
							laneData.drilldown.series[nextIndex].data.push([championModule.getChampionNameByID(+currentKey),dict[championModule.championLanesLabels[i]][currentKey]]);
						}
					}
					nextIndex=nextIndex+1;
				}	
				i=i+1;			
			}
		}
				
		chartCreator.createPieChartDrilldown(divRolePieChart,rolePieChartTitle,roleData);
		chartCreator.createPieChartDrilldown(divLanePieChart,lanePieChartTitle,laneData);

	};

	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	var matchlistMap;
	var matchlistChart;
	var geoJsonObject;
	var originalInitialDate = Infinity, originalFinalDate = -1;
	var matchInitialDate = -1, matchFinalDate = Infinity;
	var laneVisivel = [true, true, true, true, true];
	var listChampions = [];

	function createMatchlistMap(){
		matchlistMap = L.map('matchlistMap',{dragging:true,minZoom:3,zoomControl:false}).setView([33, 35], 3);
		var topLayer = 1;
		var imageUrl = "img/SR.jpg";		
		var imageBounds = [[0, 0], [57, 70]];

		matchlistMap.setMaxBounds(imageBounds);

		L.imageOverlay(imageUrl, imageBounds).addTo(matchlistMap);
		
		$.getJSON('geojson/summonersRift.geojson',function(data){
						
			geoJsonObject = L.geoJson(data,{
			    style: function (feature) {
			        return {color: 'black',fillColor:'blue',opacity:1.0, weight:2,fillOpacity:0.6};
			    },
			    onEachFeature: function (feature, layer) {
			        layer.bindPopup(feature.properties.name);
			    }
			}).addTo(matchlistMap);
		});
	}

	function getChartData(matchlist){
		var interval = "week";

		matchlist.sort(function(a,b){return a.timestamp-b.timestamp;});

		for(var i=0;i<matchlist.length;i++){
			if(matchlist[i].timestamp < originalInitialDate){
				originalInitialDate = matchlist[i].timestamp;
			}
			if(matchlist[i].timestamp > originalFinalDate){
				originalFinalDate = matchlist[i].timestamp;
			}
		};

		var countTop = d3.map();
		var countJungle = d3.map();
		var countMid = d3.map();
		var countCarry = d3.map();
		var countSupport = d3.map();

		for(var i=0;i<matchlist.length;i++){
			var day = d3.time[interval](new Date(matchlist[i].timestamp)).getTime();

			if(matchlist[i].lane=="TOP"){
				if(countTop.keys().indexOf(""+day)==-1){//first time here
					countTop.set(day,1);
				}else{//not the first time here
					var oldValue = countTop.get(day);
					countTop.set(day,oldValue+1); //++
				}				
			}

			if(matchlist[i].lane=="JUNGLE"){
				if(countJungle.keys().indexOf(""+day)==-1){//first time here
					countJungle.set(day,1);
				}else{//not the first time here
					var oldValue = countJungle.get(day);
					countJungle.set(day,oldValue+1); //++
				}				
			}

			if(matchlist[i].lane=="MID"){
				if(countMid.keys().indexOf(""+day)==-1){//first time here
					countMid.set(day,1);
				}else{//not the first time here
					var oldValue = countMid.get(day);
					countMid.set(day,oldValue+1); //++
				}				
			}

			if(matchlist[i].lane+matchlist[i].role=="BOTTOMDUO_CARRY"){
				if(countCarry.keys().indexOf(""+day)==-1){//first time here
					countCarry.set(day,1);
				}else{//not the first time here
					var oldValue = countCarry.get(day);
					countCarry.set(day,oldValue+1); //++
				}				
			}

			if(matchlist[i].lane+matchlist[i].role=="BOTTOMDUO_SUPPORT"){
				if(countSupport.keys().indexOf(""+day)==-1){//first time here
					countSupport.set(day,1);
				}else{//not the first time here
					var oldValue = countSupport.get(day);
					countSupport.set(day,oldValue+1); //++
				}				
			}

		};

		var days;
		if(matchInitialDate==-1){
			days = d3.time[interval+"s"](originalInitialDate, originalFinalDate);	
		}else{
			days = d3.time[interval+"s"](matchInitialDate, matchFinalDate);	
		}

		var topData = new Array(days.length);
		var jungleData = new Array(days.length);
		var midData = new Array(days.length);
		var carryData = new Array(days.length);
		var supportData = new Array(days.length);


		for(var i=0;i<days.length;i++){
			if(typeof countTop.get(days[i].getTime()) === 'undefined'){
				topData[i] = [days[i].getTime(), 0];
			}else{
				topData[i] = [days[i].getTime(), countTop.get(days[i].getTime())];
			}

			if(typeof countMid.get(days[i].getTime()) === 'undefined'){
				midData[i] = [days[i].getTime(), 0];
			}else{
				midData[i] = [days[i].getTime(), countMid.get(days[i].getTime())];
			}

			if(typeof countJungle.get(days[i].getTime()) === 'undefined'){
				jungleData[i] = [days[i].getTime(), 0];
			}else{
				jungleData[i] = [days[i].getTime(), countJungle.get(days[i].getTime())];
			}

			if(typeof countCarry.get(days[i].getTime()) === 'undefined'){
				carryData[i] = [days[i].getTime(), 0];
			}else{
				carryData[i] = [days[i].getTime(), countCarry.get(days[i].getTime())];
			}

			if(typeof countSupport.get(days[i].getTime()) === 'undefined'){
				supportData[i] = [days[i].getTime(), 0];
			}else{
				supportData[i] = [days[i].getTime(), countSupport.get(days[i].getTime())];
			}
		};

		return [topData,jungleData,midData,carryData,supportData];


	}

	function updateMatchListChart(matchlist){

		var dataSet = getChartData(matchlist);

		for(var i=0;i<5;i++){
			matchlistChart.series[i].setData(dataSet[i]);
		}
		

	}

	function createMatchListChart(matchlist){

		var dataSet = getChartData(matchlist);
		
		var topData = dataSet[0];
		var jungleData = dataSet[1];
		var midData = dataSet[2];
		var carryData = dataSet[3];
		var supportData = dataSet[4];
				
		$('#time-chart').highcharts({
		colors:['#7cb5ec','#f15c80', '#90ed7d', '#f7a35c', '#8085e9', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
        chart: {
            type: 'area',
            panning: true,
            panKey: "shift", 
            zoomType: 'x',
            opacity:1.0,
            backgroundColor: 'transparent',
	            style:{
	            	color:'white'
	            },
	        events:{
	        	load: function(){
	        		matchlistChart = this;
	        	}
	        }

        },
        legend: { 
		        borderRadius: 5,
		        borderWidth: 1,
				backgroundColor: 'white'
		},
        title: {
            text: 'Ranked Games By Week',
            style:{
	                	color: 'white'
	            }
        },
        subtitle: {
            text: 'Click and drag to zoom in. Hold down shift key to pan.',
            style:{
	                	color: 'white'
	            }
        },
        xAxis: {
        	type: 'datetime',
        	minRange:24 * 3600 * 1000 * 8,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            },
            labels:{
            	style:{
	            		color:'white'
	            	}
            },
            events:{
            	setExtremes: function(event){

            		if(typeof event.min === 'undefined'){
            			matchInitialDate = originalInitialDate;
            		}else{
            			matchInitialDate = event.min;
            		};
            		if(typeof event.max === 'undefined'){
            			matchFinalDate = originalFinalDate;
            		}else{
            			matchFinalDate = event.max;
            		};

          			updateMatchListChampions(filterMatchList(summonerMatches.matches));

            	}
            }
        },
        yAxis: {
            title: {
                text: 'Number of Games',
                style:{
	                	color: 'white'
	                }
            },
            labels: {
                formatter: function () {
                    return this.value;
                },
                style:{
	                	color: 'white'
	                }
            }
        },
        tooltip: {
        	xDateFormat: '%a %d/%m/%Y',
            shared: true,
            valueSuffix: ' games'
        },
        plotOptions: {
        	threshold: null,
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                		radius:2,
                		enabled: false,
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            },
          	series:{
          		fillOpacity: 1.0,
          		events:{
          			legendItemClick: function(event){

          				var idClicked = event.target._i;

          				laneVisivel[idClicked] = !laneVisivel[idClicked];

          				updateMatchListChampions(filterMatchList(summonerMatches.matches));

          			}
          		}
          	}
        },
        series: [{
            name: 'Top',
            data: topData,
            marker:{
            	symbol: 'circle'
            }
        }, {
            name: 'Jungle',
            data: jungleData,
            marker:{
            	symbol: 'circle'
            }
        }, {
            name: 'Mid',
            data: midData,
            marker:{
            	symbol: 'circle'
            }
        }, {
            name: 'Bot Carry',
            data: carryData,
            marker:{
            	symbol: 'circle'
            }
        }, {
            name: 'Bot Support',
            data: supportData,
            marker:{
            	symbol: 'circle'
            }
        }]
    });
	}

	var championsCounter = d3.map();

	function setChampionsCounterToZero(){
		for(var i=0;i<championsCounter.keys().length;i++){
			championsCounter.set(championsCounter.keys()[i],0);
		}
	}

	function updateMatchListChampions(matchlist){
		setChampionsCounterToZero();
		//championsCounter = d3.map();
		var oldValue;
		var container = "#matchlistChampions";

		for(var i=0;i<matchlist.length;i++){
			if(typeof championsCounter.get(matchlist[i].champion) !== 'undefined'){ //counter already exists
				oldValue = championsCounter.get(matchlist[i].champion);
				championsCounter.set(matchlist[i].champion, oldValue+1 );
			}else{
				championsCounter.set(matchlist[i].champion, 1);
			}
		}
		var countArray = championsCounter.entries().sort(function(a,b){return b.value-a.value;});

		$(container).empty();

		for(var i=0;i<countArray.length;i++){
			$(container).append("<div class='championListItem championId"+countArray[i].key+"' ><img src='"+
				championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(+countArray[i].key))+
				"'><span class='championListKey'>"+championModule.getChampionNameByID(+countArray[i].key)+"</span> <span class='championListValue'> "+countArray[i].value+" game(s)</span></div>");
		}
		//define click event
		$(".championListItem").each(function(){
			$(this).click(function(){
				/*

				if($(this).hasClass('clicked')){
					
					$(this).removeClass('clicked');

					var championId = +$(this).attr('class').split(" ")[1].split('championId')[1];
					listChampions.splice(listChampions.indexOf(championId), 1);

					updateMatchListChart(filterMatchList(matchlist));

					return;
				};				

				var championId = +$(this).attr('class').split(" ")[1].split('championId')[1];
				listChampions.push(championId);

				$(this).addClass('clicked');

				updateMatchListChart(filterMatchList(matchlist));
				*/
			})


		});
		/*
		$(container).append("<div><span id='resetChampionList' style='cursor:pointer' class='championListValue'> Reset</span></div>");
		$("#resetChampionList").click(function(){
			//resetMatchListChampions(filterMatchList(matchlist));
			resetMatchListChampions(matchlist);
		});
		*/


	}
	function resetMatchListChampions(matchlist){
			listChampions = [];
			updateMatchListChart(filterMatchList(matchlist));
			updateMatchListChampions(filterMatchList(matchlist));
	}

	function updateMatchListMap(matchlist){

	}

	function filterMatchList(matchlist){

		var TOP_INDEX = 0;
		var JUNGLE_INDEX = 1;
		var MID_INDEX = 2;
		var CARRY_INDEX = 3;
		var SUPPORT_INDEX = 4;

		if(typeof matchInitialDate === 'undefined'){
			matchInitialDate = -1;
		}
		if(typeof matchFinalDate === 'undefined'){
			matchFinalDate = Infinity;
		}

		var result = [];
		var valid = false;

		for(var i=0; i<matchlist.length; i++){
			valid = false;
			if(matchlist[i].timestamp>=matchInitialDate && matchlist[i].timestamp<=matchFinalDate){

				if(matchlist[i].lane=='TOP' && laneVisivel[TOP_INDEX]){
					valid = true;					
				}
				if(matchlist[i].lane=='JUNGLE' && laneVisivel[JUNGLE_INDEX]){
					valid = true;
				}
				if(matchlist[i].lane=='MID' && laneVisivel[MID_INDEX]){
					valid = true;
				}
				if(matchlist[i].lane+matchlist[i].role=='BOTTOMDUO_CARRY' && laneVisivel[CARRY_INDEX]){
					valid = true;
				}
				if(matchlist[i].lane+matchlist[i].role=='BOTTOMDUO_SUPPORT' && laneVisivel[SUPPORT_INDEX]){
					valid = true;
				}

				if(valid==true){
					if(listChampions.length==0 || listChampions.indexOf(matchlist[i].champion)!=-1){
						result.push(matchlist[i]);
					}
				}				

			}//end time check

		}//end for

		return result;
	}

	function showMatchlistChart(){
		createMatchlistMap();
		
		createMatchListChart(filterMatchList(summonerMatches.matches));

		updateMatchListChampions(filterMatchList(summonerMatches.matches));

		updateMatchListMap(filterMatchList(summonerMatches.matches));


	};

	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	function checkSummonerRankedStatsResponse(stats){
		var facts = crossfilter(stats.champions);

		var championDimension = facts.dimension(function(d){
			return d.id;
		});

		var championWinGroup = championDimension.group().reduceSum(function(d){ return d.stats.totalSessionsWon});
		var championTotalGroup = championDimension.group().reduceSum(function(d){ return d.stats.totalSessionsPlayed});
		var kdaGroup = championDimension.group().reduceSum(function(d){
			if(d.stats.totalDeathsPerSession!=0){
				return ((d.stats.totalChampionKills+d.stats.totalAssists)/(d.stats.totalDeathsPerSession))/(championDimension.filterExact(d.id).top(Infinity).length)
			}else{
				return ((d.stats.totalChampionKills+d.stats.totalAssists)/1)/(championDimension.filterExact(d.id).top(Infinity).length)
			}
		});
		
		var winValuesArray = championWinGroup.top(Infinity);
		var playedValuesArray = championTotalGroup.top(Infinity);
		var kdaValuesArray = kdaGroup.top(Infinity);

		var dataObject = {};
		for(var i=0;i<winValuesArray.length;i++){
			dataObject[winValuesArray[i].key] = {'win':winValuesArray[i].value};
		}
		for(var i=0;i<playedValuesArray.length;i++){
			dataObject[playedValuesArray[i].key].played = playedValuesArray[i].value;		
		}
		for(var i=0;i<playedValuesArray.length;i++){
			dataObject[kdaValuesArray[i].key].kda = kdaValuesArray[i].value;
		}

		championsArray = [];
		dataArray = [];
		for(var i=0;i<playedValuesArray.length;i++){

			championsArray.push(playedValuesArray[i].key);
			var winMatches = dataObject[playedValuesArray[i].key].win;
			var totalMatches = dataObject[playedValuesArray[i].key].played;
			var championPoints = getChampionPointsByChampionID(playedValuesArray[i].key);

			dataArray.push( [
								parseFloat((winMatches/totalMatches).toFixed(4)),
								championPoints,
								getLegendScore(winMatches,totalMatches,championPoints,dataObject[playedValuesArray[i].key].kda)								
							]
						 );
		}

		showSummonerParalCoordChart(championsArray,dataArray);
	}

	function checkSummonerMasteryandMasteryResponse(mastery, matches){
		for(var i=0;i<mastery.length;i++){
			totalMasteryPoints = totalMasteryPoints + mastery[i].championLevel;
		};
		$("#sumMasteryPointsDisplayDiv").text(totalMasteryPoints);
		summonerMastery = mastery;
		summonerMatches = matches;
		showSummonerMasteryOverview();
		showSummonerMasteryList();
		showSummonerMasteryChart();
		showSummonerPieCharts();
		showMatchlistChart();

		serverCommunication.getSummonerRankedStats(summonerInfo[accessKeySummonerInfo].id,summonerInfo.region,checkSummonerRankedStatsResponse);

		comparator.initSummonerNameInputs(summonerInfo[accessKeySummonerInfo].name,summonerInfo.region,summonerMastery);
		
	}
	
	function checkSummonerInfoResponse(queryData){
		if(queryData=='error'){
			//if summoner doesnt exist, redirect to index
			window.location.assign("index.html?error=summonerNotFound");
		}else{
			summonerInfo = queryData;
			accessKeySummonerInfo = Object.keys(queryData)[0];
			//now let's get League info about the summoner
			serverCommunication.getSummonerLeague(summonerInfo[accessKeySummonerInfo].id,summonerInfo.region,checkSummonerLeagueResponse);
			//the function loadPage will be called inside checkSummonerLeagueResponde
		};
	}
	function checkSummonerLeagueResponse(queryData){
		if(queryData=="error"){
			summonerLeague['leagueNotFound'] = true;
		}else{
			summonerLeague = queryData;
		}
		loadPage();
	}

	function startPage(){
		if(location.search.length==0){
			window.location.assign("index.html?error=summonerNotFound");
		}
		var ls = LocationSearcher.load();
		//the following piece of code is to remove all white spaces manually.
		//I tried Regex, but for some reason it replaces the empty spaces with '+'
		var originalSearchName = ls['summoner'];
		var searchNameWithPlus = "";
		var searchNameNoSpaces = "";
		for(var i=0;i<originalSearchName.length;i++){
			if(originalSearchName[i]!=" "){
				searchNameWithPlus = searchNameWithPlus + originalSearchName[i];
			}
		}
		for(var i=0;i<searchNameWithPlus.length;i++){
			if(searchNameWithPlus[i]!="+"){
				searchNameNoSpaces = searchNameNoSpaces + searchNameWithPlus[i]
			}
		}
		
		serverCommunication.getSummonerInfo(searchNameNoSpaces,ls['selectSummonerRegion'],checkSummonerInfoResponse);
	};
	
	function getSumMasteryPointsByRole(role){
		var newSum = 0;
		for(var i=0;i<summonerMastery.length;i++){
			if(role == 'All' || (role==championModule.getChampionRoleByID(summonerMastery[i].championId))){
				newSum = newSum + summonerMastery[i].championLevel;
			}				
		}
		return newSum;
	};

	function getChampionPointsByChampionID(championID){
		
		for(var i=0;i<summonerMastery.length;i++){
			if(championID == summonerMastery[i].championId){
				return summonerMastery[i].championPoints;
			}
		}
		return 0;

	}

    //public vars/methods;
    return{
    	startPage: startPage,
    	getSumMasteryPointsByRole:getSumMasteryPointsByRole,
    	totalMasteryPoints: totalMasteryPoints,
    	getChampionPointsByChampionID: getChampionPointsByChampionID,
    	summonerMatches: summonerMatches,
    	summonerMastery:summonerMastery
    };
})();
