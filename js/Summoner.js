var summonerModule=(function(){

	var summonerInfo = {};
	var summonerLeague = {"leagueNotFound":false};
	var accessKeySummonerInfo = ""; //string that stores the master Object Property of the response, ex: "lukehawk"
	var summonerMastery = {};
	var summonerMatches = {};

	function loadSummonerOverview(){
		//show summonerIcon	
		$("#summonerIcon").attr("src","http://ddragon.leagueoflegends.com/cdn/6.9.1/img/profileicon/"+this.summonerInfo[this.accessKeySummonerInfo].profileIconId+".png");
		//show summonerName
		$("#summonerName").text(this.summonerInfo[this.accessKeySummonerInfo].name);
		//show summonerRegion
		$("#summonerRegion").text("  "+this.summonerInfo.region);
		//show level or league
		if(summonerLeague.leagueNotFound){
			$("#summonerLevel").text("Level: "+this.summonerInfo[this.accessKeySummonerInfo].summonerLevel);	
		}else{
			$("#summonerLevel").text(summonerLeague[this.summonerInfo[this.accessKeySummonerInfo].id][0].tier +" "+summonerLeague[this.summonerInfo[this.accessKeySummonerInfo].id][0].entries[0].division);	
		}
	}

	function loadMasteryAndMatchesInformation(){
		serverCommunication.getMasteryAndMatches(this.summonerInfo[this.accessKeySummonerInfo].id,this.summonerInfo.region,checkSummonerMasteryandMasteryResponse);

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

	function showSummonerMasteryList(){
		var targetDiv = "";
		for(var i=0;i<this.summonerMastery.length;i++){
			targetDiv = "#championLevelGroup"+this.summonerMastery[i].championLevel;
			$(targetDiv).show();
			$(targetDiv).append(championModule.createChampionListItemHTML(this.summonerMastery[i],getHighestGrade(this.summonerMastery[i])));

		}
		
	}

	function showSummonerMasteryChart(){

	}

	function checkSummonerMasteryandMasteryResponse(mastery, matches){
		this.summonerMastery = mastery;
		this.summonerMatches = matches;
		showSummonerMasteryList();
		showSummonerMasteryChart();
	}
	
	function checkSummonerInfoResponse(queryData){
		if(queryData=='error'){
			//if summoner doesnt exist, redirect to index
			window.location.assign("index.html?error=summonerNotFound");
		}else{
			this.summonerInfo = queryData;
			this.accessKeySummonerInfo = Object.keys(queryData)[0];
			//now let's get League info about the summoner
			serverCommunication.getSummonerLeague(this.summonerInfo[this.accessKeySummonerInfo].id,this.summonerInfo.region,checkSummonerLeagueResponse);
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
	}

    //public vars/methods:
    return{
    	startPage: startPage
    };
})();
