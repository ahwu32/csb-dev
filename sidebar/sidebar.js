/**
 * Chrome Sidetabs
 *
 * sidebar.js
 * @author ah.wu32@gmail.com
 */

//https://developers.google.com/speed/articles/javascript-dom
//wiki how to avoid social awkwardness
//wikihow how to stop being shy

//initTabs();
//eventHandlers();

var csb = {
	
	init: function () {
		csb.eventHandlers();
		csb.bgEventHandlers();
		chrome.runtime.sendMessage({
			csbReady: true
		});
	},

	eventHandlers: function () {
		var tabContainer = document.getElementById('csb-tab-container');
		tabContainer.addEventListener('click', function (e) {
			if (e.target.classList.contains('csb-tab-action')) {
				chrome.runtime.sendMessage({
					closeTab: +e.target.parentNode.id
				});
				e.target.parentNode.remove();
				e.stopPropagation;
			}
			if (e.target.classList.contains('csb-tab-item')) {
				chrome.runtime.sendMessage({
					changeActiveTab: +e.target.id
				});
			}
		});
	},

	bgEventHandlers: function () {
		chrome.runtime.onMessage.addListener(function (msg) {
			if (msg.tabData) {
				csb.generateTabList(msg.tabData);
			}
		});
	},

	generateTabList: function (tabs) {
		var tabRootList = document.getElementById('csb-tab-root-list');
		emptyElm(tabRootList);
		var fragment = document.createDocumentFragment();
		for (var i = 0; i < tabs.length; i++) {
			var tabGroup = document.createElement('div');
			tabGroup.classList.add('csb-tab-group');
			tabGroup.innerHTML = createTabItem(tabs[i]);
			fragment.appendChild(tabGroup);
		}
		tabRootList.appendChild(fragment);
	},
	
	closeTab: function (tab) {
		var content = tab.getElementsByClassName('csb-tab-content');
		
	},

	changeTab: function (tabId) {

	}

};

csb.init();


function eventHandlers() {

	var tabContainer = document.getElementById('csb-tab-container');

	tabContainer.addEventListener('click', function (e) {

		if (e.target.classList.contains('csb-tab-action')) {
			//			console.log('close tab button clicked for: ' + e.target.parentNode.id);

			//send message close tab
			chrome.runtime.sendMessage({
				closeTab: ~~e.target.parentNode.id
			});
			e.target.parentNode.remove();
			e.stopPropagation;
		} else if (e.target.classList.contains('csb-tab-item')) {

			e.target.classList.add('csb-tab-active');


			//			console.log('change tab button clicked: ' + e.target.id);
			//			chrome.runtime.sendMessage({
			//				changeActiveTab: ~~e.target.id
			//			});


			//send message change tab
		}
	});
}







function updateTabList(data) {

	var tabRootList = document.getElementById('csb-tab-root-list');
	emptyElm(tabRootList);
	var fragment = document.createDocumentFragment();

	tabs = data.tabs;

	for (var i = 0; i < tabs.length; i++) {
		var tabGroup = document.createElement('div');
		tabGroup.classList.add('csb-tab-group');
		tabGroup.innerHTML = createTabItem(tabs[i]);
		fragment.appendChild(tabGroup);
	}
	tabRootList.appendChild(fragment);
}


function initTabs() {
	console.time('getTabs');
	var tabRootList = document.getElementById('csb-tab-root-list');
	emptyElm(tabRootList);
	var fragment = document.createDocumentFragment();
	
	chrome.runtime.sendMessage({
		getTabs: true
	}, function (tabs) {
		console.log(tabs);
		for (var i = 0; i < tabs.length; i++) {

			var tabGroup = document.createElement('div');
			tabGroup.className = "csb-tab-group";
			tabGroup.innerHTML = createTabItem(tabs[i]);

			fragment.appendChild(tabGroup);
		}
		tabRootList.appendChild(fragment);


		console.timeEnd('getTabs');
	});
}



//chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//	if (request.tabData) {
//		updateTabList(request.tabData);
//	}
//});


function createTabItem(tab) {

	return '<div class="csb-tab-item" id="' + tab.id + '"><div class="csb-tab-collapse"></div><img class="csb-tab-icon" src="' + tab.favIconUrl + '"><div class="csb-tab-title">' + tab.title + '</div><div class="csb-tab-action"></div></div></div>';
}

function emptyElm(elm) {

	if (elm) {
		while (elm.firstChild) {
			elm.removeChild(elm.firstChild);
		}
	}
}