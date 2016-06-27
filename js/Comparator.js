var comparator=(function(){
	var summonerNames = [];
	var summonerMasterySet = [];
	var summonersRegion;
	var nameInputDivID = "#comparationInputsDiv"
	var chartDivID = "#comparationChart";
	var plusClass = "fa fa-plus fa-2x";
	var timesClass = "fa fa-times fa-2x";
	var currentID = 0;

	function createSharedSet(){
		var sharedSet = {};
		countObject = {};
		for(var i=0; i<summonerMasterySet.length; i++){
			for(var k=0;k<summonerMasterySet[i].length;k++){
				if(countObject.hasOwnProperty(summonerMasterySet[i][k].championId) ){
					countObject[summonerMasterySet[i][k].championId] = countObject[summonerMasterySet[i][k].championId] + 1;
				}else{
					countObject[summonerMasterySet[i][k].championId] = 1;
				}
			}
		}

		var championList = Object.getOwnPropertyNames(countObject);
		for(var i=0; i<championList.length; i++){
			if(countObject[championList[i]] == summonerMasterySet.length){
				var championPointsList = [];
				for(var k=0; k<summonerMasterySet.length ; k++){
					for(var j=0; j<summonerMasterySet[k].length; j++){
						if( summonerMasterySet[k][j].championId == +championList[i] ){
							championPointsList.push(summonerMasterySet[k][j].championPoints);
						}						
					}
				}
				sharedSet[championList[i]] = championPointsList;
			}
		};
		return sharedSet;
	}

	function getMasteryResponse(masteryData){
		if(masteryData=="error"){
			summonerMasterySet.push([]);
			return;
		}
		summonerMasterySet.push(masteryData);
		removeLoadingAlert();
		addSummonerNameInput();

		updateChart();
	};

	function checkSummonerNameResponse(queryData){
		//check if name is valid
		if(queryData=="error"){
			//if it is not valid:
			addErrorAlert();
		}else{
			summonerNames.push(queryData[Object.getOwnPropertyNames(queryData)[0]].name);
			serverCommunication.getSummonerMastery(queryData[Object.getOwnPropertyNames(queryData)[0]].id,summonersRegion,getMasteryResponse);
		}
	};

	function addSummoner(){
		//get the name typed in the last text input box:
		var summonerName = $(".comparationTextInput").last().val().replace(/ /g,'');
		if(summonerName.length==0){
			return;
		}
		addLoadingAlert();
		//send request to server
		serverCommunication.getSummonerInfo(summonerName,summonersRegion,checkSummonerNameResponse);

		

	};

	function initSummonerNameInputs(initialName,region,masteryData){
		summonersRegion = region;
		summonerNames.push(initialName);
		summonerMasterySet.push(masteryData);
		addSummonerNameInput();
		$("#summonerNameInput0").val(initialName);
		addSummonerNameInput();

		updateChart();
	};

	function addSummonerNameInput(){
		var htmlString = "<form id='summonerNameInputControl"+currentID+"' class='form-group summonerInput' onsubmit='comparator.addSummoner(); return false;'>";
		htmlString = htmlString + "<input id='summonerNameInput"+currentID+"' class='form-control comparationTextInput' type='text'></input>";		
		htmlString = htmlString + "<i type='submit' id='faButton"+currentID+"' class='comparationButton' aria-hidden='true'></i>";				
		htmlString = htmlString + "</form>";
		
		//first of all: disable all texts
		$(".comparationTextInput").each(function(){
									$(this).attr("disabled",true);
		});

		//now, for every button, change '+' to 'x' and
		//for click evento, bind the remove function, except in the button 0
		$(".comparationButton").each(function(){
								if(($(this)[0]).id != "faButton0"){
									$(this).off('click');
									$(this).removeClass("fa-plus");
									$(this).addClass("fa-times");
									$(this).on('click',function(){
										removeSummonerNameInput(this.id);
									});
								}
		});

		//insert the element
		$(nameInputDivID).append(htmlString);

		//if the element is the first:
		if(currentID==0){
			$("#faButton"+currentID).addClass(timesClass);
			$("#summonerNameInput"+currentID).attr("disabled",true);
		}else{
			//if the element is not the first:
			$("#faButton"+currentID).addClass(plusClass).addClass("active");	
			$("#faButton"+currentID).on('click',function(){
				addSummoner();
			})
			$("#summonerNameInput"+currentID).focus();
		}

		currentID++;
	};



	function removeSummonerNameInput(id){
		var numericId = id.split('faButton')[1];

		var name = $('#summonerNameInput'+numericId).val();
		var summonerIndex = summonerNames.indexOf(name);

		$('#summonerNameInputControl'+numericId).remove();


		summonerNames.splice(summonerIndex,1);
		summonerMasterySet.splice(summonerIndex,1);

		currentID--;
		updateChart();
	};


	function updateChart(){
		var barHeight = 50;
		var barPadding = 30;
		var data = createSharedSet();
		var dataChampions = Object.getOwnPropertyNames(data);
		var dataLength = dataChampions.length;

		//series: [{name:'Teste', data: [] }, {name:'Summoner1', data: }]
		var seriesData = [];
		for(var i=0; i<summonerNames.length; i++){
			var serieItemObject = {name:summonerNames[i], data:[]};
			for(var k=0; k<dataLength; k++){
				serieItemObject.data.push(data[dataChampions[k]][i]);
			}
			seriesData.push(serieItemObject);
		}

		$(chartDivID).highcharts({
	        chart: {
	        	height: (( (dataLength+1) * (barHeight+barPadding))+55),
	            type: 'bar',
	            marginTop:75,
	            marginLeft: 80,
	            marginBottom: 90,
	            backgroundColor: 'transparent',
	            style:{
	            	color:'white'
	            }
	        },
	        colors: ['#7cb5ec', '#90ed7d', '#f7a35c', '#8085e9','#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1', '#434348']
	        ,
	        tooltip:{
	        	followPointer: true,
	        	useHTML: true
	        },
	        title:{
	        	text:'Champions Mastered by Summoners',
	        	style:{
	        		color:'white'
	        	}
	        },
	        legend: { 
		        borderRadius: 5,
		        borderWidth: 1,
				backgroundColor: 'white',
				align:'center',
				verticalAlign:'top',
				y: 35
		    },
	        xAxis: {
	        	//champion names: ['Cait','Karthus',...]
	            categories: (function(){ 
	            				var championLabelArray = [];
	            				for(var i=0;i<dataLength;i++){
	            					championLabelArray.push("<div class='comparatorXLabel'><img class='comparatorImg' src='"+championModule.getChampionSquareImgURL(championModule.getChampionKeyByID(+dataChampions[i]))+"'></img> <br><span class='comparatorSpan'>"+championModule.getChampionNameByID(+dataChampions[i]))+"</span></div>";
	            				}
	            				return championLabelArray;
	            			})(),
	            labels:{
	            	useHTML: true,
	            	style:{
	            		color:'white'
	            	}
	            }
	        },
	        yAxis:{
	        	gridLineColor:'transparent',
	            labels:{
	            	enabled:false
	            },
	            title: false
	        },
	        plotOptions: {
	        	bar:{
	        		groupPadding:barPadding,
	        		pointWidth: barHeight
	        	},
	            series: {
	                stacking: 'percent'
	            }
	        },

	        series: seriesData 	        
    	});

	};


	function addLoadingAlert(){
		$("#inputAlert").remove();
		var icon = "<i class='fa fa-spinner fa-pulse fa-fw margin-bottom'></i>";
		$(nameInputDivID).append("<div id='inputAlert' class='alert alert-info comparator'>"+icon+"<strong>Loading!</strong><br></div>");
	};

	function removeLoadingAlert(){
		$("#inputAlert").remove();
	};

	function addErrorAlert(empty){
		$("#inputAlert").remove();
		$(nameInputDivID).append("<div id='inputAlert' class='alert alert-danger comparator'><strong>Error!</strong><br>We can't find the summoner. A ward would be nice now.<br></div>");


	};
	function removerLoadingAlert(){
		$("#inputAlert").remove();

	};

    //public vars/methods:
    return{
		addSummoner:addSummoner,
		initSummonerNameInputs:initSummonerNameInputs
    };
})();