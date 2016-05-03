var dynamicStyleModule=(function(){

	function loadedSplashURLCallback(splashUrl){
		$("#bgImage").attr("src",splashUrl);	
	}

	function loadNewBackground(){
		serverCommunication.getRandomSplashURL(dynamicStyleModule.loadedSplashURLCallback);
	}

	function changeButtonSearchSummoner(){
		var buttonTexts = ["Let Teemo Search!","Let Ezreal Explore!"]
		$("#buttonSearchSummoner").text(buttonTexts[Math.floor(Math.random() * (buttonTexts.length))]);
	}

	//panel heading initial color:
	$(".panel-heading").css("background-color","#313743");
	//change panels color when click:
	$(".collapse").on('hidden.bs.collapse',function(){
		$(".panel-heading").css("background-color","#313743");
	});
	$(".collapse").on('show.bs.collapse',function(){
    	$(".panel-heading").css("background-color","#337AB7");
	});

	//fixing Highcharts width bug!
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		$('#allChampionsChartContainer').highcharts().reflow();
	});

    //public vars/methods:
    return{
		loadNewBackground: loadNewBackground,
		loadedSplashURLCallback: loadedSplashURLCallback,
		changeButtonSearchSummoner: changeButtonSearchSummoner
    };
})();
