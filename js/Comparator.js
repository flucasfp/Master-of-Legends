var comparator=(function(){
	var summonerNames = [];
	var summonerMasterySet = [];
	var nameInputDivID = "#comparationInputsDiv"
	var chartDivID = "#comparationChartDiv";
	var plusClass = "fa fa-plus fa-2x";
	var timesClass = "fa fa-times fa-2x";
	var currentID = 0;

	function updateChart(){

	}

	function addSummoner(summonerName){
		//check if name is valid

		//name is valid:
		addSummonerNameInput();

	}

	function initSummonerNameInputs(initialName){
		addSummonerNameInput();
		$("#summonerNameInput0").val(initialName);
		addSummonerNameInput();
	}

	function addSummonerNameInput(){
		var htmlString = "<div id='summonerNameInputControl"+currentID+"' >";
		htmlString = htmlString + "<input id='summonerNameInput"+currentID+"' class='form-control comparationTextInput' type='text'></input>";		
		htmlString = htmlString + "<i id='faButton"+currentID+"' class='comparationButton' aria-hidden='true'></i>";				
		htmlString = htmlString + "</div>";
		
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
				console.log("adionou evento de add para: "+"faButton"+currentID);
				addSummoner();
			})
		}



		currentID++;

		updateChart();
	}



	function removeSummonerNameInput(id){
		var numericId = id.split('faButton')[1];
		$('#summonerNameInputControl'+numericId).remove();

	}


    //public vars/methods:
    return{
		addSummoner:addSummoner,
		initSummonerNameInputs:initSummonerNameInputs
    };
})();