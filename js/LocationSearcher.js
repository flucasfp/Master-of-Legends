var LocationSearcher=(function(){
	//this class is an utility class
	//it gets the location.search and create an object
	function loadLocationSearch(){
		var ls = {};
		var stringLS = String(location.search);
		if(stringLS.length==0){return ls;};
		stringLSArray = stringLS.split("?")[1].split("&");
		for(var i=0;i<stringLSArray.length;i++){
			ls[stringLSArray[i].split("=")[0]] = stringLSArray[i].split("=")[1];
		}
		return ls;
	}

    //public vars/methods:
    return{
    	load: loadLocationSearch
    };
})();
