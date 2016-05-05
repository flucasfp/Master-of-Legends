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
			$("#summonerLevel").text(summonerLeague[summonerInfo[accessKeySummonerInfo].id][0].tier +" "+summonerLeague[summonerInfo[accessKeySummonerInfo].id][0].entries[0].division);	
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

	function getLegendScore(winMatches,totalMatches,championPoints){
//		return totalMatches;
		return parseInt(championPoints/totalMatches*(winMatches));
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
			$("#topChampionsMasteryList").append(championModule.createChampionListItemHTML(summonerMastery[countChampions],getHighestGrade(summonerMastery[countChampions]),false));
			countChampions++;
		}

		var countChampions = 0;
		var currentChampion = 0;
		while(countChampions!=maxShowed && currentChampion!=summonerMastery.length){
			if(!summonerMastery[currentChampion].chestGranted){
				$("#nextChestList").append(championModule.createChampionListItemHTML(summonerMastery[currentChampion],getHighestGrade(summonerMastery[currentChampion]),false));;
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
			$(targetDiv).append(championModule.createChampionListItemHTML(summonerMastery[i],getHighestGrade(summonerMastery[i]),true));

		}
		
	};

	function showSummonerMasteryChart(){
		chartCreator.createOverviewChart("allChampionsChartContainer",summonerInfo[accessKeySummonerInfo].name,summonerMastery);
	};

	function showSummonerPieCharts(){
		var divRolePieChart = "rolePiechart";
		var divLanePieChart = "lanePiechart";
		var rolePieChartTitle = summonerInfo[accessKeySummonerInfo].name+"'s Champion Points by Role";
		var lanePieChartTitle = summonerInfo[accessKeySummonerInfo].name+"'s Champion Points by Position*";
		var roleData = {series:[{name:'Roles',colorByPoint:true,data:[]}],drilldown:{series:[]}};
		var laneData = {series:[{name:'Lanes',colorByPoint:true,data:[]}],drilldown:{series:[]}};
		
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

	function checkSummonerRankedStatsResponse(stats){
		var facts = crossfilter(stats.champions);

		var championDimension = facts.dimension(function(d){
			return d.id;
		});

		var championWinGroup = championDimension.group().reduceSum(function(d){ return d.stats.totalSessionsWon});
		var championTotalGroup = championDimension.group().reduceSum(function(d){ return d.stats.totalSessionsPlayed});

		var winValuesArray = championWinGroup.top(Infinity);
		var playedValuesArray = championTotalGroup.top(Infinity);

		var dataObject = {};
		for(var i=0;i<winValuesArray.length;i++){
			dataObject[winValuesArray[i].key] = {'win':winValuesArray[i].value};
		}
		for(var i=0;i<playedValuesArray.length;i++){
			dataObject[playedValuesArray[i].key].played = playedValuesArray[i].value;		
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
								getLegendScore(winMatches,totalMatches,championPoints)								
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

		serverCommunication.getSummonerRankedStats(summonerInfo[accessKeySummonerInfo].id,summonerInfo.region,checkSummonerRankedStatsResponse);
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
