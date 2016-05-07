var serverCommunication=(function(){
    var squareChampionImageUrl = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion";
    var squareChampionImageType =".png";
    //var serverURL = "http://localhost:5000/?";
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
            if(data.hasOwnProperty('status')){
                callbackFunction("error");
            }else{
                data['region'] = summonerRegion.toUpperCase();
                callbackFunction(data);                
            }
        }).error(function(data){callbackFunction("error");});
    };

    function getSummonerLeague(summonerID, summonerRegion, callbackFunction){

        $.ajax(serverURL+"getSummonerLeague=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion).done(function(data){
            data = JSON.parse(data);
            if(data.hasOwnProperty('status')){
                callbackFunction("error");
            }else{
                callbackFunction(data);
            }
        }).error(function(data){callbackFunction("error");});
        
    };

    function getSummonerMastery(summonerID,summonerRegion,callbackFunction){
        $.ajax(serverURL+"getSummonerMastery=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion).done(function(data){
            data = JSON.parse(data);
            callbackFunction(data);
        }).error(function(data){callbackFunction("error");});
    }   

    function getMasteryAndMatches(summonerID, summonerRegion, callbackFunction){
        //This gets Champions info too!
        $.when(
            $.ajax(serverURL+"getSummonerMastery=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion),
            $.ajax(serverURL+"getSummonerMatches=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion),
            $.ajax(serverURL+"getChampionsTagsInfo=true&summonerRegion="+summonerRegion)
        ).then(
            function(data1,data2,data3){
                championModule.championsInfo = JSON.parse(data3[0]);
                var matches = JSON.parse(data2[0]);
                if(matches.hasOwnProperty('status')){
                    matches = [];
                }
                callbackFunction(JSON.parse(data1[0]),matches);
            },
            function(data1,data2,data3){
                console.log('Failed to load resources! :(');             
            }
        )
    }

    function getSummonerRankedStats(summonerID, summonerRegion, callbackFunction){
        var seasons = ['SEASON2015','SEASON2016'];
        var rankedInfo1 = {'champions':[]};
        var rankedInfo2 = {'champions':[]};
        var returnData = {'champions':[]};
        var url1 = serverURL+"getSummonerRankedStats=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion+"&season="+seasons[0];
        var url2 = serverURL+"getSummonerRankedStats=true&summonerID="+summonerID+"&summonerRegion="+summonerRegion+"&season="+seasons[1];
        
        $.ajax(url1)
        .done(function(data){
            var serverResponse = JSON.parse(data);
            if(serverResponse.hasOwnProperty('status')){
                console.log("No ranked stats from "+seasons[0]);
            }else{
                rankedInfo1 = serverResponse;
            }
        }).error(function(data){
                console.log("Failed to load resources :(");
        }).complete(function(data){
                        $.ajax(url2)
                            .done(function(data){
                                var serverResponse = JSON.parse(data);
                                if(serverResponse.hasOwnProperty('status')){                                    
                                    console.log("No ranked stats from "+seasons[1]);
                                }else{
                                    rankedInfo2 = serverResponse;
                                }
                            }).error(function(data){
                                console.log("Failed to load resources :(");
                            }).complete(function(data){
                                for(var i=0;i<rankedInfo1.champions.length;i++){
                                    if(rankedInfo1.champions[i].id!=0){
                                        returnData.champions.push(rankedInfo1.champions[i]);
                                    }
                                }
                                for(var i=0;i<rankedInfo2.champions.length;i++){
                                    if(rankedInfo2.champions[i].id!=0){
                                        returnData.champions.push(rankedInfo2.champions[i]);    
                                    }
                                }
                                callbackFunction(returnData);
                            })
        })
    }
    //public vars/methods:
    return{
        getRandomSplashURL: getRandomSplashURL,
        getSummonerInfo: getSummonerInfo,
        getSummonerLeague: getSummonerLeague,
        getMasteryAndMatches: getMasteryAndMatches,
        getSummonerRankedStats: getSummonerRankedStats,
        getSummonerMastery:getSummonerMastery
    };
})();
