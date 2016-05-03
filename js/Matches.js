var matchesModule=(function(){

	function groupLaneRoleChampion(matchesArray){
		var dict = {}
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
				dict[currentLabeledLane] = [];
			}else{
				if(currentLabeledLane=="Bot "){
					if(currentRole == "DUO_CARRY"){
						currentLabeledLane = currentLabeledLane+"Carry";
						if(!dict.hasOwnProperty(currentLabeledLane)){							
							dict[currentLabeledLane] = [];							
						}
					}else{
						if(currentRole == "DUO_SUPPORT"){
							currentLabeledLane = currentLabeledLane+"Support";
							if(!dict.hasOwnProperty(currentLabeledLane)){								
								dict[currentLabeledLane] = [];
							}
						}
					}
				}
			}

			if( (currentLabeledLane=="Bot ") && ((currentRole=="DUO")||(currentRole=="NONE")||(currentRole=="SOLO")) ){
				//I cant say if the role is carry or support :(
			}else{				
				dict[currentLabeledLane].push(championModule.getChampionNameByID(championId));	
			}
			

		}
		console.log(dict);



		return dict;
	}
    //public vars/methods:
    return{
		groupLaneRoleChampion: groupLaneRoleChampion
    };
})();
