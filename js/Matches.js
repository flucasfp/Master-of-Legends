var matchesModule=(function(){

	function groupLaneRoleChampion(matchesArray){
		if(typeof matchesArray === 'undefined'){
			return null; //maybe the user has no ranked data :(
		}
		var dict = {};
		var sumChampionMatches = {};
		//championLanes = [['MID', 'MIDDLE'], ['TOP'], ['JUNGLE'], ['BOT', 'BOTTOM']];
		//roles =  DUO, NONE, SOLO, DUO_CARRY, DUO_SUPPORT
		//championLanesLabels = ['Mid','Top','Jungle','Bot Carry','Bot Support'];
		//the idea of this function is to create an Object that filters matches by: [lane categ. by role] then [champion]
		var laneDict = {
			"MID": "Mid",
			"MIDDLE": "Mid",
			"TOP": "Top",
			"JUNGLE": "Jungle",
			"BOT": "Bot ",
			"BOTTOM":"Bot "
		};
		for(var i=0; i<matchesArray.length; i++){
			var championId = matchesArray[i].champion;
			var currentRole = matchesArray[i].role;
			var currentLane = matchesArray[i].lane;

			var currentLabeledLane = laneDict[currentLane];

			if((!dict.hasOwnProperty(currentLabeledLane)) && currentLabeledLane!="Bot "){
				dict[currentLabeledLane] = {};
			}else{
				if(currentLabeledLane=="Bot "){
					if(currentRole == "DUO_CARRY"){
						currentLabeledLane = currentLabeledLane+"Carry";
						if(!dict.hasOwnProperty(currentLabeledLane)){							
							dict[currentLabeledLane] = {};							
						}
					}else{
						if(currentRole == "DUO_SUPPORT"){
							currentLabeledLane = currentLabeledLane+"Support";
							if(!dict.hasOwnProperty(currentLabeledLane)){								
								dict[currentLabeledLane] = {};
							}
						}
					}
				}
			}

			if( (currentLabeledLane=="Bot ") && ((currentRole=="DUO")||(currentRole=="NONE")||(currentRole=="SOLO")) ){
				//I cant say if the role is carry or support :(
			}else{				
				if(dict[currentLabeledLane].hasOwnProperty(String(championId))){
					//count the number of matches for each champion for each lane:
					dict[currentLabeledLane][String(championId)] = dict[currentLabeledLane][String(championId)] + 1;
				}else{
					dict[currentLabeledLane][String(championId)] = 1;
				};
				//now I sum the number os games gathered by champion
				if(sumChampionMatches.hasOwnProperty(String(championId))){
					sumChampionMatches[String(championId)] = sumChampionMatches[String(championId)] + 1;
				}else{
					sumChampionMatches[String(championId)] = 1;				
				};
			}			

		}//end for

		//Now I will divide the champion Points proporcionally to the number of games played in that lane
		var dictLanePointsSum = {};
		var namesForDictArray = Object.getOwnPropertyNames(dict);
		for(var i=0; i<namesForDictArray.length; i++){
			dictLanePointsSum[namesForDictArray[i]] = 0;
			championsForLaneArray = Object.getOwnPropertyNames(dict[namesForDictArray[i]]);
			for(var k=0; k<championsForLaneArray.length; k++){
				//TotalChampionPoints * TotalGamesPlayedInThisLane/TotalGamesPlayed
				dict[namesForDictArray[i]][championsForLaneArray[k]] = parseInt(summonerModule.getChampionPointsByChampionID(+championsForLaneArray[k])*dict[namesForDictArray[i]][championsForLaneArray[k]]/sumChampionMatches[championsForLaneArray[k]]);
				dictLanePointsSum[namesForDictArray[i]] = dictLanePointsSum[namesForDictArray[i]] + dict[namesForDictArray[i]][championsForLaneArray[k]];
			}
			dict[namesForDictArray[i]].totalPoints = dictLanePointsSum[namesForDictArray[i]];
		}
		return dict;
		//I didn't expected that this would be so complicated x.x
	}

    //public vars/methods:
    return{
		groupLaneRoleChampion: groupLaneRoleChampion
    };
})();
