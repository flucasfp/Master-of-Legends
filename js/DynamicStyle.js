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

	var clicks = 1;
	//LEAGUE OF DRAVEN
	$("#summonerIcon").click(function(){
		if(clicks==3){
				$('img').each(function(){
					$(this).attr('src','http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/Draven.png');
				});
				$('image').each(function(){
					$(this).attr('href','http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/Draven.png');
				});
				$("li a").each(function(){$(this).text("More DRAVEN")})
				$('.navbar-brand').text('LEAGUE OF DRAVEN');
				$("#summonerName").text("DRAVEN");
				$("#summonerRegion").text("NOXUS");
				$("#summonerLevel").text("DRAVEEEEEEEEEEEEEEEN");
				$("#masteryInfoLabel").text("DRAVEN Visualization")
					.css("margin-top","20px")
					.css("margin-bottom","10px")
					.css("font-size","30px");
				$(".comparatorSpan").each(function(){$(this).text("Draven");})			
		};
			clicks++;
		}
	);



    //public vars/methods:
    return{
		loadNewBackground: loadNewBackground,
		loadedSplashURLCallback: loadedSplashURLCallback,
		changeButtonSearchSummoner: changeButtonSearchSummoner
    };
})();
