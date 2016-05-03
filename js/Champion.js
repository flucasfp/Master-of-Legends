var championModule=(function(){

	var championsInfo = {};
	var championRoles = ['Assassin','Fighter','Mage','Support','Tank','Marksman'];
	var championLanes = [['MID', 'MIDDLE'], ['TOP'], ['JUNGLE'], ['BOT', 'BOTTOM']];
	var championLanesLabels = ['Mid','Top','Jungle','Bot Carry','Bot Support'];

	function getChampionSquareImgURL(championKey){
		return "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/"+championKey+".png"
	}

	function getChampionKeyByID(championID){
		for(var i=0;i<Object.keys(championModule.championsInfo.data).length;i++){
			if(championModule.championsInfo.data[Object.keys(championModule.championsInfo.data)[i]].id == championID){
				return Object.keys(championModule.championsInfo.data)[i];
			}
		}
		return "";
	}

	function getChampionNameByID(championID){
		for(var i=0;i<Object.keys(championModule.championsInfo.data).length;i++){
			if(championModule.championsInfo.data[Object.keys(championModule.championsInfo.data)[i]].id == championID){
				return championModule.championsInfo.data[Object.keys(championModule.championsInfo.data)[i]].name;
			}
		}
		return "";
	}

	function getChampionRoleByID(championID){
		for(var i=0;i<Object.keys(championModule.championsInfo.data).length;i++){
			if(championModule.championsInfo.data[Object.keys(championModule.championsInfo.data)[i]].id == championID){
				return championModule.championsInfo.data[Object.keys(championModule.championsInfo.data)[i]].tags[0];
			}
		}
		return "";
	}

	function getMasteryProgressInPercent(championPointsSinceLastLevel, championPointsUntilNextLevel){
		//output is an float
		if(championPointsSinceLastLevel==0){
			return 1;
		}
		return (championPointsSinceLastLevel/(championPointsSinceLastLevel+championPointsUntilNextLevel));

	}

	function createChampionListItemHTML(summonerMastery,grade,showProgressBar){
		var championID = summonerMastery.championId;
		var championKey = getChampionKeyByID(championID);
		var html = "<div class='championListItemDiv "+getChampionRoleByID(championID)+"'><div class='imageList'><img class='championListImage' src='";
		//img src:
		html = html + getChampionSquareImgURL(championKey) + "'></img>";
		//white hover overlay and champion info:
		html = html + "<div class='championListItemOverlay'>"+championModule.championsInfo.data[championKey].name+"<br>"+grade+"</div></div>"
		if(showProgressBar){
			//progression bar
			var progressPercent = parseInt(getMasteryProgressInPercent(summonerMastery.championPointsSinceLastLevel,summonerMastery.championPointsUntilNextLevel)*100);
			html = html + "<div class='progress championMasteryProgress' data-toggle='tooltip' data-placement='right' title='"+(function(){if(summonerMastery.championLevel==5){return "Full Mastery!";}; return String(summonerMastery.championPointsSinceLastLevel)+"/"+String(summonerMastery.championPointsSinceLastLevel+summonerMastery.championPointsUntilNextLevel)+" Champion Points!"})()+"'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='"+progressPercent+"' aria-valuemin='0' aria-valuemax='100' style='width:"+progressPercent+"%'></div></div>";
		}
		//close div:
		html = html + "</div>"
		return html;
	}

	//filter champ by role in the CHampion Mastery Overview:
	$("#championRoleFilter").change(function(){
		$(".championLevelGroup").hide();
		var listItems = $(".championLevelGroup .championListItemDiv");

		for( var i = 0 ;i < listItems.length; i++){
			if( $(listItems[i]).hasClass( $(this).val() ) || $(this).val()=='All'){
				$(listItems[i]).parent().show();
				$(listItems[i]).show();
			}else{
				$(listItems[i]).hide();
			}
		}
		$("#sumMasteryPointsDisplayDiv").text(summonerModule.getSumMasteryPointsByRole($(this).val()));
	});


	 


    //public vars/methods:
    return{
    	createChampionListItemHTML: createChampionListItemHTML,
    	championsInfo: championsInfo,
    	getChampionSquareImgURL: getChampionSquareImgURL,
    	getChampionKeyByID: getChampionKeyByID,
    	championRoles: championRoles,
    	championLanes: championLanes,
    	championLanesLabels: championLanesLabels,
    	getChampionRoleByID: getChampionRoleByID,
		getChampionNameByID: getChampionNameByID
    };
})();
