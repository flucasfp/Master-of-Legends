var serverCommunication=(function(){
    var squareChampionImageUrl = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion";
    var squareChampionImageType =".png";
    var serverURL = "http://masteroflegends.pythonanywhere.com/?";

    function getRandomSplashURL(callbackFunction){
        var randomSplashUrl = "";

        $.ajax(serverURL+"getChampionsSkinsInfo=true").done(function(data){
            data = JSON.parse(data);
            var randomChampNumber = Math.floor(Math.random() * Object.keys(data.data).length);
            var randomChampKey = Object.keys(data.data)[randomChampNumber];
            randomSplashUrl = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
            randomSplashUrl = randomSplashUrl + randomChampKey+"_"+data.data[randomChampKey].skins[Math.floor(Math.random()*data.data[randomChampKey].skins.length)].num +".jpg"; //get a random skin
            callbackFunction(randomSplashUrl);
        });
    }

    function getSummonerInfo(summonerName, summonerRegion, callbackFunction){
        
        $.ajax(serverURL+"getSummonerInfo=true&summonerName="+summonerName+"&summonerRegion="+summonerRegion).done(function(data){
            data = JSON.parse(data);
            data['region'] = summonerRegion.toUpperCase();
            callbackFunction(data);
        }).error(function(data){callbackFunction("error");});
    };

    function getSummonerLeague(summonerID, summonerRegion, callbackFunction){

        $.ajax(serverURL+"getSummonerLeague=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion).done(function(data){
            data = JSON.parse(data);
            callbackFunction(data);
        }).error(function(data){callbackFunction("error");});
        
    };

    function getMasteryAndMatches(summonerID, summonerRegion, callbackFunction1, callbackFunction2){
        //This gets Champions info too!
        $.when(
            $.ajax(serverURL+"getSummonerMastery=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion),
            $.ajax(serverURL+"getSummonerMatches=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion),
            $.ajax(serverURL+"getChampionsTagsInfo=true&summonerRegion="+summonerRegion)
        ).then(
            function(data1,data2,data3){
                console.log(JSON.parse(data1[0]));
                console.log(JSON.parse(data2[0]));
                console.log(JSON.parse(data3[0]));

            },
            function(data1,data2,data3){
                console.log('Fail to load resources! :(');               
            }
        )

    }

    //public vars/methods:
    return{
        getRandomSplashURL: getRandomSplashURL,
        getSummonerInfo: getSummonerInfo,
        getSummonerLeague: getSummonerLeague,
        getMasteryAndMatches: getMasteryAndMatches
    };
})();
