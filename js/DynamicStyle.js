var dynamicStyleModule=(function(){

	function loadedSplashURLCallback(splashUrl){
		$("#bgImage").attr("src",splashUrl);	
	}

	function loadNewBackground(){
		RiotAPICommunicationModule.getRandomSplashURL(dynamicStyleModule.loadedSplashURLCallback);
	}

	function changeButtonSearchSummoner(){
		var buttonTexts = ["Let Teemo Search!","Let Ezreal Explore!"]
		$("#buttonSearchSummoner").text(buttonTexts[Math.floor(Math.random() * (buttonTexts.length))]);
	}

    //public vars/methods:
    return{
		loadNewBackground: loadNewBackground,
		loadedSplashURLCallback: loadedSplashURLCallback,
		changeButtonSearchSummoner: changeButtonSearchSummoner
    };
})();
