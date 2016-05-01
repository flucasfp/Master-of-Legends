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

	function createChampionListItemHTML(summonerMastery,grade){
		var championID = summonerMastery.championId;
		var championKey = getChampionKeyByID(championID);
		var html = "<div class='championListItemDiv'><div class='imageList'><img class='championListImage' src='";
		html = html + getChampionSquareImgURL(championKey) + "'></img>";
		html = html + "<div class='championListItemOverlay'>"+championModule.championsInfo.data[championKey].name+"<br>"+grade+"</div></div></div>";
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
