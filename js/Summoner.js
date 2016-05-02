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
	}

	function showSummonerMasteryList(){
		var targetDiv = "";
		for(var i=0;i<summonerMastery.length;i++){
			targetDiv = "#championLevelGroup"+summonerMastery[i].championLevel;
			$(targetDiv).show();
			$(targetDiv).append(championModule.createChampionListItemHTML(summonerMastery[i],getHighestGrade(summonerMastery[i]),true));

		}
		
	}

	function showSummonerMasteryChart(){
		chartCreator.createOverviewChart("allChampionsChartContainer",summonerInfo[accessKeySummonerInfo].name,summonerMastery);
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

    //public vars/methods;
    return{
    	startPage: startPage,
    	getSumMasteryPointsByRole:getSumMasteryPointsByRole,
    	totalMasteryPoints: totalMasteryPoints
    };
})();