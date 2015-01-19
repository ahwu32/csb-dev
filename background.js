var bg = {

	csbStatus: 'hide',
	activeTab: null,

	init: function () {
		//event handlers
		bg.eventHandlers();
	},

	csbEventHandlers: function () {
		chrome.runtime.onMessage.addListener(function (request, sender) {

			if (request.isSidebarOpen) {
				activeWindow = sender.tab.windowId;
				sendResponse({
					isSidebarOpen: sidebarOpen[activeWindow]
				});
			} else if (request.sidebarOpened) {
				activeWindow = sender.tab.windowId;
				sidebarOpen[activeWindow] = true;
				console.log('sidebar open for window ' + activeWindow);
			} else if (request.sidebarClosed) {
				activeWindow = sender.tab.windowId;
				sidebarOpen[activeWindow] = false;
				console.log('sidebar closed for window ' + activeWindow);
			} else if (request == "testing") {
				console.log('testing received in background.js')
			}

		});

		chrome.tabs.onActivated.addListener(function (activeInfo) {
			bg.sendMessage(activeInfo.tabId, {csbStatus: csbStatus});
		});
	},

	eventHandlers: function () {
		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			if (request.closeTab) {
				chrome.tabs.remove(request.closeTab);
			}
			if (request.changeActiveTab) {
				chrome.tabs.update(request.changeActiveTab, {
					active: true
				});
			}
			if (request.csbReady) {
				console.log('onMessage csbReady');
				//				sendResponse('hello');
				if (sender.tab.active) {
					console.log(sender.tab.active);
					var windowId = sender.tab.windowId;
					chrome.tabs.query({
						windowId: windowId
					}, function (tabs) {
						chrome.tabs.sendMessage(sender.tab.id, {
							tabData: tabs
						});
					});
				}
			}
			return true;
		});
	},



	sendMessage: function (tabId, msg) {
		chrome.tabs.sendMessage(tabId, msg);
	}
};



bg.init();

//(function tabEventHandlers() {
//	console.log('event handlers fired');
//	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//		if (request.closeTab) {
//			chrome.tabs.remove(request.closeTab);
//		}
//		if (request.changeActiveTab) {
//			//			chrome.tabs.sendMessage(request.changeActiveTab, )
//			chrome.tabs.update(request.changeActiveTab, {
//				active: true
//			});
//		}
//	});
//})();

//// React when a browser action's icon is clicked.
//chrome.browserAction.onClicked.addListener(function(tab) {
////	window.open('main.html');
//	chrome.tabs.create({
//		url: "main.html"
//	});
//	
////	chrome.tabs.executeScript(null, {file: });
//});

var _bbActive = false;
var _bbActive = {};
var _bbScroll = 0;
//var _bbTree = [];
var _bbTree = {};
//control determined in backgorund
//on command send update sidebar to all tabs
//if open keep open/if close open depending on command state here

var sidebarOpen = {};

//(function() {
//	
//	chrome.windows.getAll({populate:true}, function(windows) {
//		
//		for (var i = 0; i < windows.length; i++) {
//			treeAddRoot(windows[i].id);
//			var tabs = windows[i].tabs;
//			
//			
//			for (var j = 0; j < tabs.length; j++) {
//				treeAddTab(tabs[j]);
//			}
//		}
////		console.table(_bbTree);
//	});
//	
//})();


/**
 *
 * Inject script logic
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.isSidebarOpen) {
		activeWindow = sender.tab.windowId;
		sendResponse({
			isSidebarOpen: sidebarOpen[activeWindow]
		});
	} else if (request.sidebarOpened) {
		activeWindow = sender.tab.windowId;
		sidebarOpen[activeWindow] = true;
		console.log('sidebar open for window ' + activeWindow);
	} else if (request.sidebarClosed) {
		activeWindow = sender.tab.windowId;
		sidebarOpen[activeWindow] = false;
		console.log('sidebar closed for window ' + activeWindow);
	} else if (request == "testing") {
		console.log('testing received in background.js')
	}

});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.getTabs) {
		console.log('onMessage: getTabs');
		//		var senderId = sender.tab.id;
		var windowId = sender.tab.windowId;

		chrome.tabs.query({
			windowId: windowId
		}, function (tabs) {
			sendResponse(tabs);
		});
	}
	//	return true;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	//	return true;
});