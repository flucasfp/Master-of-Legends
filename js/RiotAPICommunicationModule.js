var RiotAPICommunicationModule=(function(){
    var riotAPIKey = "";
    var defaultRegion = "na";

    function setRiotAPIKey(key){
        this.riotAPIKey = key;
    };

    function getRandomSplashURL(callbackFunction){
        var randomSplashUrl = "";
        var getChampionsInfoURL = "https://global.api.pvp.net/api/lol/static-data/"+defaultRegion+"/v1.2/champion?champData=skins&api_key="+this.riotAPIKey;
        $.getJSON(getChampionsInfoURL,function(data){ 
            var randomChampNumber = Math.floor(Math.random() * Object.keys(data.data).length);
            var randomChampKey = Object.keys(data.data)[randomChampNumber];
            randomSplashUrl = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
            randomSplashUrl = randomSplashUrl + randomChampKey+"_"+data.data[randomChampKey].skins[Math.floor(Math.random()*data.data[randomChampKey].skins.length)].num +".jpg"; //get a random skin
			
			callbackFunction(randomSplashUrl);
        });        
    }

    function getSummonerInfo(summonerName, summonerRegion, callbackFunction){
        var url = "https://"+summonerRegion+".api.pvp.net/api/lol/"+summonerRegion+"/v1.4/summoner/by-name/"+summonerName+"?api_key="+this.riotAPIKey;
        $.getJSON(url,function(data){
            data['region'] = summonerRegion.toUpperCase();
            callbackFunction(data);
            }).fail(function(data){
                callbackFunction("error");
            });        
    };

    function getSummonerLeague(summonerID, summonerRegion, callbackFunction){
        var url = "https://"+summonerRegion.toLowerCase()+".api.pvp.net/api/lol/"+summonerRegion.toLowerCase()+"/v2.5/league/by-summoner/"+summonerID+"/entry?api_key="+this.riotAPIKey;
        $.getJSON(url,function(data){
            callbackFunction(data);
            }).fail(function(data){
                callbackFunction("error");
            });
        };

    //public vars/methods:
    return{
        setRiotAPIKey : setRiotAPIKey,
        getRandomSplashURL: getRandomSplashURL,
        getSummonerInfo: getSummonerInfo,
        getSummonerLeague: getSummonerLeague
    };
})();
