var championModule=(function(){

	var championsInfo = {}
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
		var html = "<div class='championListItemDiv'><div class='imageList'><img class='championListImage' src='";
		//img src:
		html = html + getChampionSquareImgURL(championKey) + "'></img>";
		//white hover overlay and champion info:
		html = html + "<div class='championListItemOverlay'>"+championModule.championsInfo.data[championKey].name+"<br>"+grade+"</div></div>"
		if(showProgressBar){
			//progression bar
			var progressPercent = parseInt(getMasteryProgressInPercent(summonerMastery.championPointsSinceLastLevel,summonerMastery.championPointsUntilNextLevel)*100);
			html = html + "<div class='progress championMasteryProgress'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='"+progressPercent+"' aria-valuemin='0' aria-valuemax='100' style='width:"+progressPercent+"%'></div></div>";
		}
		//close div:
		html = html + "</div>"
		return html;
	}
	  


    //public vars/methods:
    return{
    	createChampionListItemHTML:createChampionListItemHTML,
    	championsInfo: championsInfo,
    	getChampionSquareImgURL: getChampionSquareImgURL,
    	getChampionKeyByID: getChampionKeyByID
    };
})();
