var mainController=(function(){
    
	var keyURL = "config/settings.js";
    //First things to do:

    //Load the api key:

	$.getJSON(keyURL,function(data){
        if(data.loadKeyFromFile){
		  RiotAPICommunicationModule.setRiotAPIKey(data.key);
		  notifyKeyLoaded();
        }else{
            if(typeof(Cookies("riot_api_key"))  === "undefined"){
                alert("Please open the Console and type mainController.registerCookieKey(<your key>)");
            }else{
                RiotAPICommunicationModule.setRiotAPIKey(Cookies("riot_api_key"));
                notifyKeyLoaded();
           }           
        }
	});

    function registerCookieKey(key){
        Cookies("riot_api_key",key);        
        RiotAPICommunicationModule.setRiotAPIKey(key);
        notifyKeyLoaded();
    }

	function notifyKeyLoaded(){
        dynamicStyleModule.changeButtonSearchSummoner();//set random text in search button :D
   		dynamicStyleModule.loadNewBackground();//load a random skin splash as background
        var ls = LocationSearcher.load()
        if(ls['error']=="summonerNotFound"){
            $(".alert").css("display","inherit");
        }

        //keep doind things, do not wait till loads
        if(page=='summoner'){ //page is a var declared in each html
            summonerModule.startPage();
        }
    }

    //Checking if summoner name field is empty:
    $("#buttonSearchSummoner").on("click",function(){
        if(!($("#summonerInputText").val().length == 0)){
            $("#seachSummonerForm").submit();
        }else{
            $("#summonerInputText").focus();
            return false;
        }
    });
    //public vars/methods:
    return{
        registerCookieKey: registerCookieKey    
    };
})();
