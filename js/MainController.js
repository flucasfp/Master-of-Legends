var mainController=(function(){

    //First things to do:

    //Load the api key:


    function registerCookieKey(key){
        Cookies("riot_api_key",key);        
        RiotAPICommunicationModule.setRiotAPIKey(key);
        notifyKeyLoaded();
    }

	function loadPage(){
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

    loadPage();

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
    };
})();
