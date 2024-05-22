(function() {
	// 'use strict';
	console.log("Loading data lib");
	
	// This function will contain all our code
	function VocDataLibrary(){
		var _vocDataObject = {};
		
		_vocDataObject.log = function(msg) {
			console.log("VocData: " + msg);
		}
		
		_vocDataObject.saveData = function(data) {
			_vocDataObject.log("Saving data: ");
			_vocDataObject.log(data);
			document.domain = "vocareum.com";
			parent.iframeWindow = window;
			
			parent.vocSaveFormData(data)
			.then(data => {
				_vocDataObject.log(data);
			})
			.catch(error => {
				_vocDataObject.log("ERROR");
				_vocDataObject.log(error)
			})
		}
		
		_vocDataObject.vocOnBlur = function(event) {
			_vocDataObject.log("Saving selection...");
			
			if ((event == null) || (event.target == null)) {
				_vocDataObject.saveAllData();
				return;
			}
			
			var data = {};
			
			item = event.target;
			data[item.id] = item.value;
			
			_vocDataObject.saveData(data);
		}
		
		_vocDataObject.saveAllData = function() {
			_vocDataObject.log("Saving all selections...");
			document.domain = "vocareum.com";
			parent.iframeWindow = window;
			
			var data = {};
			
			var items = document.getElementsByClassName("voc_textarea");
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				data[item.id] = item.value;
			}
			
			var items = document.getElementsByClassName("voc_selector");
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				data[item.id] = item.value;
			}
			
			var items = document.getElementsByClassName("voc_radio");
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				data[item.id] = item.checked;
			}
			
			var items = document.getElementsByClassName("voc_checkbox");
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				data[item.id] = item.checked;
			}
			
			// save tab colors
			var items = document.getElementsByClassName("nav-item");
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var colors = [item.style.backgroundColor, item.style.color];
				data[item.id] = colors;
			}
			
			_vocDataObject.saveData(data);
		}
		
		_vocDataObject.retrieveData = function() {
			_vocDataObject.log("Retrieving selections...");
			
			document.domain = "vocareum.com";
			parent.iframeWindow = window;
			parent.vocRetrieveFormData()
			.then(data => {
				// _vocDataObject.log("THEN");
				// _vocDataObject.log(data);
				try {
					var result = JSON.parse(data);
					// console.log(result);
					for (r in result) {
						item = document.getElementById(r);
						if (item) {
							if (item.type === 'radio' || item.type === 'checkbox') {
								item.checked = result[r];
								// for backwards compatibility with pre-bookmark assessments
								if (result[r] == true) {
									var page = item.name.substring(4, item.name.length);
									var tab = document.querySelector("a[href='#grp-" + page + "']");
									if (tab) {
										tab.style.color = "white";
										tab.style.backgroundColor = "green";
									}
								}
							} else if (item.id.substring(0, 4) == "tab-") { // restore tab colors
								item.style.backgroundColor = result[r][0];
								item.style.color = result[r][1];
							} else {
								item.value = result[r];
							}
						}
					} 
				} catch(err) {
					// probably empty json
				}
			})
			.catch(error => {
				_vocDataObject.log("ERROR");
				_vocDataObject.log(error)
			})
		}
		return _vocDataObject;
	}
	
	if (typeof(window.VocData) === 'undefined'){
		window.VocData = VocDataLibrary();
	}
})();
