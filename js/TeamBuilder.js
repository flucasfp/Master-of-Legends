var teamBuilder=(function(){



	function checkMasteryAndMatchesInformation(mmObjectArray){
		startPage();

		var laneGroupArray = [];
		var lanes = ['Top','Jungle','Mid','Bot Carry','Bot Support'];
		var laneSummonerIndex = {'Top':[],'Mid':[],'Jungle':[],'Bot Carry':[],'Bot Support':[]};

		for(var i=0;i<mmObjectArray.length;i++){
			laneGroupArray.push(matchesModule.groupLaneRoleChampion(mmObjectArray[i].matches.matches,mmObjectArray[i].mastery));
		}

		//now I have the needed information in laneGroupArray
		for(var i=0; i<lanes.length; i++){
			for(var k=0; k<laneGroupArray.length; k++){
				if(laneGroupArray[k]==null || ( !(laneGroupArray[k].hasOwnProperty(lanes[i])) ) ){	
					laneSummonerIndex[lanes[i]].push({'summonerIndex':k,'points':0,'lane':lanes[i]} );
				}else{
					laneSummonerIndex[lanes[i]].push({'summonerIndex':k,'points':laneGroupArray[k][lanes[i]].totalPoints,'lane':lanes[i]} );
				}
			}
			laneSummonerIndex[lanes[i]].sort(function(a,b){return b.points-a.points});
		}

		var laneBySummoner = {'Top':-1,'Mid':-1,'Jungle':-1,'Bot Carry':-1,'Bot Support':-1};

		for(var i=0; i<5; i++){
			var currentColumn = [];
			for(var k=0;k<lanes.length;k++){
				currentColumn.push(laneSummonerIndex[lanes[k]][0]);
			}
			currentColumn.sort(function(a,b){return b.points-a.points});
			//this way i know who has the best to offer to some lane
			var bestSummoner = currentColumn[0].summonerIndex;
			//he is the best for lane:
			var bestLane = currentColumn[0].lane;
			laneBySummoner[bestLane] = bestSummoner;
			//now remove the summoner and the lane of the considered arrays:
			//delete the lane from lanes array:
			lanes.splice(lanes.indexOf(bestLane),1);

			delete laneSummonerIndex[bestLane];

			laneSummonerIndexProperties = Object.getOwnPropertyNames(laneSummonerIndex);
			for(var k=0; k<laneSummonerIndexProperties.length;k++){
				var currentLane = laneSummonerIndex[laneSummonerIndexProperties[k]];
				var laneWithoutSummoner = [];
				for(var j=0;j<currentLane.length;j++){
					if(currentLane[j].summonerIndex!=bestSummoner){
						laneWithoutSummoner.push(currentLane[j]);
					}
				}
				laneSummonerIndex[laneSummonerIndexProperties[k]] = laneWithoutSummoner;		
			}
		}		

		//now let's show in screen!
		var summonerTop = laneBySummoner['Top'];
		var summonerJungle = laneBySummoner['Jungle'];
		var summonerMid = laneBySummoner['Mid'];
		var summonerCarry = laneBySummoner['Bot Carry'];
		var summonerSup = laneBySummoner['Bot Support'];

		var topLaneChampions = [];
		if(laneGroupArray[summonerTop] != null && (laneGroupArray[summonerTop].hasOwnProperty('Top'))){
			topLaneChampions = laneGroupArray[summonerTop]['Top'];
		}
		var midLaneChampions = [];
		if(laneGroupArray[summonerMid] != null && (laneGroupArray[summonerMid].hasOwnProperty('Mid'))){
			midLaneChampions = laneGroupArray[summonerMid]['Mid'];
		}
		var jungleLaneChampions = [];
		if(laneGroupArray[summonerJungle] != null && (laneGroupArray[summonerJungle].hasOwnProperty('Jungle'))){
			jungleLaneChampions = laneGroupArray[summonerJungle]['Jungle'];
		}
		var carryLaneChampions = [];
		if(laneGroupArray[summonerCarry] != null && (laneGroupArray[summonerCarry].hasOwnProperty('Bot Carry'))){
			carryLaneChampions = laneGroupArray[summonerCarry]['Bot Carry'];
		}
		var supLaneChampions = [];
		if(laneGroupArray[summonerSup] != null && (laneGroupArray[summonerSup].hasOwnProperty('Bot Support'))){
			supLaneChampions = laneGroupArray[summonerSup]['Bot Support'];
		}

		var topLaneChampionsObject = [];
		var jungleLaneChampionsObject = [];
		var midLaneChampionsObject = [];
		var carryLaneChampionsObject = [];
		var supLaneChampionsObject = [];

		
		for(var i=0;i<Object.getOwnPropertyNames(topLaneChampions).length;i++){
			if(Object.getOwnPropertyNames(topLaneChampions)[i]!="totalPoints" && topLaneChampions.length!=0){
				topLaneChampionsObject.push({'championId':Object.getOwnPropertyNames(topLaneChampions)[i],'points':topLaneChampions[Object.getOwnPropertyNames(topLaneChampions)[i]]});	
			}
		}
		topLaneChampionsObject.sort(function(a,b){return b.points-a.points});

		for(var i=0;i<Object.getOwnPropertyNames(jungleLaneChampions).length;i++){
			if(Object.getOwnPropertyNames(jungleLaneChampions)[i]!="totalPoints" && jungleLaneChampions.length!=0){
				jungleLaneChampionsObject.push({'championId':Object.getOwnPropertyNames(jungleLaneChampions)[i],'points':jungleLaneChampions[Object.getOwnPropertyNames(jungleLaneChampions)[i]]});	
			}
		}
		jungleLaneChampionsObject.sort(function(a,b){return b.points-a.points});

		for(var i=0;i<Object.getOwnPropertyNames(midLaneChampions).length;i++){
			if(Object.getOwnPropertyNames(midLaneChampions)[i]!="totalPoints" && midLaneChampions.length!=0){
				midLaneChampionsObject.push({'championId':Object.getOwnPropertyNames(midLaneChampions)[i],'points':midLaneChampions[Object.getOwnPropertyNames(midLaneChampions)[i]]});	
			}
		}
		midLaneChampionsObject.sort(function(a,b){return b.points-a.points});

		for(var i=0;i<Object.getOwnPropertyNames(carryLaneChampions).length;i++){
			if(Object.getOwnPropertyNames(carryLaneChampions)[i]!="totalPoints" && carryLaneChampions.length!=0){
				carryLaneChampionsObject.push({'championId':Object.getOwnPropertyNames(carryLaneChampions)[i],'points':carryLaneChampions[Object.getOwnPropertyNames(carryLaneChampions)[i]]});	
			}
		}
		carryLaneChampionsObject.sort(function(a,b){return b.points-a.points});

		for(var i=0;i<Object.getOwnPropertyNames(supLaneChampions).length;i++){
			if(Object.getOwnPropertyNames(supLaneChampions)[i]!="totalPoints" && supLaneChampions.length!=0){
				supLaneChampionsObject.push({'championId':Object.getOwnPropertyNames(supLaneChampions)[i],'points':supLaneChampions[Object.getOwnPropertyNames(supLaneChampions)[i]]});	
			}
		}
		supLaneChampionsObject.sort(function(a,b){return b.points-a.points});


		var top3Champions = [];
		var jungle3Champions = [];
		var mid3Champions = [];
		var carry3Champions = [];
		var sup3Champions = [];


		var i=0;
		while(i<3 && i<topLaneChampionsObject.length){
			top3Champions.push(topLaneChampionsObject[i]);
			i++;
		}

		var i=0;
		while(i<3 && i<jungleLaneChampionsObject.length){
			jungle3Champions.push(jungleLaneChampionsObject[i]);
			i++;
		}

		var i=0;
		while(i<3 && i<midLaneChampionsObject.length){
			mid3Champions.push(midLaneChampionsObject[i]);
			i++;
		}

		var i=0;
		while(i<3 && i<carryLaneChampionsObject.length){
			carry3Champions.push(carryLaneChampionsObject[i]);
			i++;
		}

		var i=0;
		while(i<3 && i<supLaneChampionsObject.length){
			sup3Champions.push(supLaneChampionsObject[i]);
			i++;
		}

		$("#tbDetailRole"+(laneBySummoner['Top']+1)).text("TOP");
		for(var i=0;i<top3Champions.length;i++){			
			$("#tbDetailChampionsDiv"+(laneBySummoner['Top']+1)).append("<img src='"+championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(top3Champions[i].championId))+"'></img>");
		}
		if(top3Champions.length==0){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Top']+1)).append("<span>No Data</span>");
			$("#tbTopImg").css('opacity',0);
			$("#tbLabelDivId1").css('opacity',0);
		}else{
			$("#tbTopImg").attr("src",championModule.getChampionLoadingImgURL(championModule.getChampionKeyByID(top3Champions[0].championId)));
			$("#tbTopLabel").text($("#summonerName"+ (laneBySummoner['Top']+1)).val());
			$("#tbTopImg").css('opacity',1);
			$("#tbLabelDivId1").css('opacity',1);
		}
		//-----------------------------------------------------------------------------------------------------------------------
		$("#tbDetailRole"+(laneBySummoner['Jungle']+1)).text("JUNGLE");
		for(var i=0;i<jungle3Champions.length;i++){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Jungle']+1)).append("<img src='"+championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(jungle3Champions[i].championId))+"'></img>");
		}
		if(jungle3Champions.length==0){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Jungle']+1)).append("<span>No Data</span>");
			$("#tbJungleImg").css('opacity',0);
			$("#tbLabelDivId2").css('opacity',0);
		}else{
			$("#tbJungleImg").attr("src",championModule.getChampionLoadingImgURL(championModule.getChampionKeyByID(jungle3Champions[0].championId)));
			$("#tbJungleLabel").text($("#summonerName"+ (laneBySummoner['Jungle']+1)).val());
			$("#tbJungleImg").css('opacity',1);
			$("#tbLabelDivId2").css('opacity',1);
		}
		//-----------------------------------------------------------------------------------------------------------------------
		$("#tbDetailRole"+(laneBySummoner['Mid']+1)).text("MID");
		for(var i=0;i<mid3Champions.length;i++){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Mid']+1)).append("<img src='"+championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(mid3Champions[i].championId))+"'></img>");
		}
		if(mid3Champions.length==0){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Mid']+1)).append("<span>No Data</span>");
			$("#tbMidImg").css('opacity',0);
			$("#tbLabelDivId3").css('opacity',0);
		}else{
			$("#tbMidImg").attr("src",championModule.getChampionLoadingImgURL(championModule.getChampionKeyByID(mid3Champions[0].championId)));
			$("#tbMidLabel").text($("#summonerName"+ (laneBySummoner['Mid']+1)).val());
			$("#tbMidImg").css('opacity',1);
			$("#tbLabelDivId3").css('opacity',1);
		}
		//-----------------------------------------------------------------------------------------------------------------------
		$("#tbDetailRole"+(laneBySummoner['Bot Carry']+1)).text("BOT CARRY");
		for(var i=0;i<carry3Champions.length;i++){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Bot Carry']+1)).append("<img src='"+championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(carry3Champions[i].championId))+"'></img>");
		}
		if(carry3Champions.length==0){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Bot Carry']+1)).append("<span>No Data</span>");
			$("#tbBotCarryImg").css('opacity',0);
			$("#tbLabelDivId4").css('opacity',0);
		}else{
			$("#tbBotCarryImg").attr("src",championModule.getChampionLoadingImgURL(championModule.getChampionKeyByID(carry3Champions[0].championId)));
			$("#tbBotCarryLabel").text($("#summonerName"+ (laneBySummoner['Bot Carry']+1)).val());
			$("#tbBotCarryImg").css('opacity',1);
			$("#tbLabelDivId4").css('opacity',1);
		}
		//-----------------------------------------------------------------------------------------------------------------------
		$("#tbDetailRole"+(laneBySummoner['Bot Support']+1)).text("BOT SUPPORT");
		for(var i=0;i<sup3Champions.length;i++){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Bot Support']+1)).append("<img src='"+championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(sup3Champions[i].championId))+"'></img>");
		}
		if(sup3Champions.length==0){
			$("#tbDetailChampionsDiv"+(laneBySummoner['Bot Support']+1)).append("<span>No Data</span>");
			$("#tbBotSupImg").css('opacity',0);
			$("#tbLabelDivId5").css('opacity',0);
		}else{
			$("#tbBotSupImg").attr("src",championModule.getChampionLoadingImgURL(championModule.getChampionKeyByID(sup3Champions[0].championId)));
			$("#tbBotSupLabel").text($("#summonerName"+ (laneBySummoner['Bot Support']+1)).val());
			$("#tbBotSupImg").css('opacity',1);
			$("#tbLabelDivId5").css('opacity',1);
		}


		$(".tbDiv").each(function(){
			$(this).animate({opacity:1},1000);
		});



		//summonerNameSpan1
		removeLoadingAlert();
		$("#tbDetails").show();
		unblockButton();

	};//end function

	function getMasteryAndMatchesInformation(idArray){
		var mmObjectArray = [];
		var region = $("#tbRegionSelect").val();
		serverCommunication.getMasteryAndMatches(idArray[0],region,
		function(mastery,matches){
			mmObjectArray.push({'mastery':mastery,'matches':matches});
			serverCommunication.getMasteryAndMatches(idArray[1],region,
			function(mastery,matches){
				mmObjectArray.push({'mastery':mastery,'matches':matches});
				serverCommunication.getMasteryAndMatches(idArray[2],region,
				function(mastery,matches){
					mmObjectArray.push({'mastery':mastery,'matches':matches});
					serverCommunication.getMasteryAndMatches(idArray[3],region,
					function(mastery,matches){
						mmObjectArray.push({'mastery':mastery,'matches':matches});
						serverCommunication.getMasteryAndMatches(idArray[4],region,
						function(mastery,matches){
							mmObjectArray.push({'mastery':mastery,'matches':matches});
							checkMasteryAndMatchesInformation(mmObjectArray);
						}
						)

					}
					)

				}
				)
			}
			)

		}
		)

	};//end function

	function checkSummonerInfoResponses(infoArray){
		var errorColor= "#FFC4C4";

		for(var i=0;i<infoArray.length;i++){
			if(infoArray[i]=="error"){
				$("#summonerName"+(i+1)).css("background-color",errorColor);
			}
		}
		if(infoArray.indexOf("error")==-1){//if there is no error
			var idArray = [];
			for(var i=0; i<infoArray.length;i++){
				$("#summonerName"+(i+1)).val(infoArray[i][Object.getOwnPropertyNames(infoArray[i])[0]].name);
				idArray.push(infoArray[i][Object.getOwnPropertyNames(infoArray[i])[0]].id);
			}
			getMasteryAndMatchesInformation(idArray);

		}else{//there is error! :(
			unblockButton();
			addErrorAlert();
			unblockButton();
		}

	}

	function getInformation(nameArray){

		var region = $("#tbRegionSelect").val();
		var infoArray = [];
		serverCommunication.getSummonerInfo(nameArray[0],region,
		function(data){
			infoArray.push(data);
			serverCommunication.getSummonerInfo(nameArray[1],region,
			function(data){
				infoArray.push(data);
				serverCommunication.getSummonerInfo(nameArray[2],region,
				function(data){
					infoArray.push(data);
					serverCommunication.getSummonerInfo(nameArray[3],region,
					function(data){
						infoArray.push(data);
						serverCommunication.getSummonerInfo(nameArray[4],region,
						function(data){
							infoArray.push(data);
							checkSummonerInfoResponses(infoArray);
						}
						)

					}
					)

				}
				)
			}			
			)
		
		}	
		);

	};


    function validateFields(){
    	var summonerNames = [];
    	summonerNames.push($("#summonerName1").val().replace(/ /g,''));
    	summonerNames.push($("#summonerName2").val().replace(/ /g,''));
    	summonerNames.push($("#summonerName3").val().replace(/ /g,''));
    	summonerNames.push($("#summonerName4").val().replace(/ /g,''));
    	summonerNames.push($("#summonerName5").val().replace(/ /g,''));

    	for(var i=0;i < summonerNames.length;i++){
    		if(summonerNames[i].length == 0){
    			return false;
    		}
    	}
    	
    	return summonerNames;
    }
	function startPage(){
		$(".tbDiv").each(function(){$(this).css("opacity",0);});
		$("#tbDetailChampionsDiv1").html("Champions:");
		$("#tbDetailChampionsDiv2").html("Champions:");
		$("#tbDetailChampionsDiv3").html("Champions:");
		$("#tbDetailChampionsDiv4").html("Champions:");
		$("#tbDetailChampionsDiv5").html("Champions:");
		$("#tbTopImg").attr("src","");
		$("#tbJungleImg").attr("src","");
		$("#tbMidImg").attr("src","");
		$("#tbBotCarryImg").attr("src","");
		$("#tbBotSupImg").attr("src","");

	}

	function build(){ //this is the first function to get called in the input submit!
		$("#tbDetails").hide();
		cleanTextInputs();
		removeErrorAlert();
		blockButton();
		$(".tbDiv").each(function(){$(this).css("opacity",0);});
		var valid = validateFields();
		//valid can be 'false' or nameArray
		if(!valid){
			unblockButton();
			return;
		}else{
			addLoadingAlert();
			getInformation(valid);
		}
	}

	function addLoadingAlert(){
		$("#tbAlertsDiv").show();
		$("#tbAlertError").hide();
		$("#tbAlertLoading").show();
	}

	function removeLoadingAlert(){
		$("#tbAlertsDiv").hide();
		$("#tbAlertLoading").hide();

	}
	function addErrorAlert(){
		$("#tbAlertsDiv").show();
		$("#tbAlertLoading").hide();
		$("#tbAlertError").show();		
	}
	function removeErrorAlert(){
		$("#tbAlertsDiv").hide();
		$("#tbAlertError").hide();
	}
	function blockButton(){
		$("#tbRegionSelect").attr("disabled",true);
		$("#tbSubmitButton").attr("disabled",true);
		$("#tbSubmitButton").addClass("disabled");
		$(".tbInputText").each(function(){$(this).attr("disabled",true) });

	}
	function unblockButton(){
		$("#tbRegionSelect").attr("disabled",false);
		$("#tbSubmitButton").attr("disabled",false);
		$("#tbSubmitButton").removeClass("disabled");
		$(".tbInputText").each(function(){$(this).attr("disabled",false) });
	}
	function cleanTextInputs(){
		$(".tbInputText").each(function(){$(this).css("background-color","white");});
	}
    
    //public vars/methods:
    return{
    	startPage: startPage,
    	build: build
    };
})();
