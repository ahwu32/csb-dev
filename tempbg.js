
chrome.commands.onCommand.addListener(function (command) {

//	console.log('onCommand event received for message: ', command);
	
	//SINGLE WINDOW SIDEBAR OPEN
	//lastFocusedWindow or currentWindow?
	chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
		
		//should only be one active window + tab
		var activeWindow = tabs[0].windowId;
		if (_bbActive[activeWindow]) {

			chrome.tabs.sendMessage(tabs[0].id, {hide: true});
			delete _bbActive[activeWindow];
			
		} else {
			
			chrome.tabs.sendMessage(tabs[0].id, {show: true});
			_bbActive[activeWindow] = true;			
		}
	});
	
	//ALL WINDOW SIDEBAR OPEN *DO NOT DELETE*
//	if (_bbActive) {
//		chrome.tabs.query({
//			active: true
//		}, function (tabs) {
//			for (var i = 0; i < tabs.length; i++) {
//				chrome.tabs.sendMessage(tabs[i].id, {
//					hide: true
//				});
//
//			}
//			_bbActive = false;
//		});
//	} else {
//		chrome.tabs.query({
//			active: true
//		}, function (tabs) {
//			for (var i = 0; i < tabs.length; i++) {
//				chrome.tabs.sendMessage(tabs[i].id, {
//					show: true
//				});
//			}
//			_bbActive = true;
//		});
//	}

});

//TAB NAVIGATION
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.requestTabs) {
		var senderId = sender.tab.id;
		//		chrome.tabs.query({}, function(tabs) {
		//			sendResponse(tabs);
		//		});

		if (request.requestTabs === 'please') {
			chrome.tabs.query({}, function (tabs) {
				sendResponse({
					tabs: tabs,
					self: senderId
				});
			});
		} else if (request.requestTabs === "multiWindow") {
			console.log('requestedMultiWindow');
			chrome.windows.getAll({populate:true}, function(windows) {
				sendResponse({
					windows: windows,
					tree: _bbTree,
					self: sender.tab
				});
//				console.log(windows);
			});	
		} else if (request.requestTabs === "singleWindow") {
			
		}

	} else if (request.gotoTab) {
		chrome.tabs.get(request.gotoTab, function (tab) {
			chrome.windows.update(tab.windowId, {
				focused: true
			}, function () {
				chrome.tabs.update(tab.id, {
					active: true
				});
			});
		});
	} else if (request.closeTab) {
		chrome.tabs.remove(request.closeTab);
		sendResponse(true);
	}

	if (request.updateScroll > -1) {
		_bbScroll = request.updateScroll;
	}

	if (request.isActive) {
		
		activeWindow = sender.tab.windowId;
		sendResponse({
			active: _bbActive[activeWindow]
		});
	}
	
	if (request.getTree) {
		sendResponse({
			tree: _bbTree
		});
	}
	
	if (request.collapseToggle) {
		
		console.log('collapse toggle ' + request.collapseToggle);
		
		var tabId = request.collapseToggle;
		
		var current = _bbTree[tabId].collapsed;
		_bbTree[tabId].collapsed = !current;
	}
	
	
	return true;
});

//SIDEBAR LOGIC
chrome.tabs.onActivated.addListener(function (activeInfo) {
	
//	chrome.tabs.get(activeInfo.tabId, function(tab) {
//		if (_bbActive[activeInfo.windowId]) {
//
//			chrome.tabs.sendMessage(activeInfo.tabId, {
//				onActivated: 1,
//				scroll: _bbScroll
//			});
//		} else {
//			chrome.tabs.sendMessage(activeInfo.tabId, {
//				onActivated: -1
//			});
//		}
//	});	
	
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		if (sidebarOpen[activeInfo.windowId]) {

			chrome.tabs.sendMessage(activeInfo.tabId, {
				onActivated: true,
//				scroll: _bbScroll
			});

		}
	});
	
//	chrome.tabs.query({
//		active: true
//	}, function (tabs) {
//		for (var i = 0; i < tabs.length; i++) {
//			if (_bbActive) {
//				chrome.tabs.sendMessage(tabs[i].id, {
//					onActivated: 1,
//					scroll: _bbScroll
//				});
//			} else {
//				chrome.tabs.sendMessage(tabs[i].id, {
//					onActivated: -1
//				});
//			}
//		}
//	});
});

chrome.windows.onCreated.addListener(function(window) {
	treeAddRoot(window.id);
});

//TAB CRUD
chrome.tabs.onCreated.addListener(function (tab) {
	
//	if (tab.openerTabId && tab.url != 'chrome://newtab/') {
//		treeAddTab(tab);
//	}
	
	treeAddTab(tab);
	
	//if single window
	chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			onCreated: tab
		});
	});
		
		
	//multi window code
	/*
	chrome.tabs.query({active: true}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, {
				onCreated: tab
			});
		}
	});*/
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	chrome.tabs.query({
		active: true
	}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, {
				onUpdated: tab
			});
		}
	});
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
	
//	treeTabRemoved(tabId);
	
//	if (_bbTree[tabId]) {
//		treeRemoveTab(tabId);
//	}
	
	treeRemoveTab(tabId);
	
	
//	console.log(_bbTree);
	
	chrome.tabs.query({
		active: true
	}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, {
				onRemoved: tabId
			});
//			console.log('trying to remove');
		}
	});
});

chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
	treeSwapTab(addedTabId, removedTabId);
});


//function initTree() {
//	//on create
//	check openerTabId
//	if openerTabId exists in _bbTree
//	put newTabId under openerTabId in _bbTree
//	
//	//on remove
//	check id in _bbTree
//	
//}



function treeTabCreated(tab) {
	
	

	
	
	
	
//	var _bbTree = {
//		
//		1294 : {'parent':-1, 'children':[123,121,122], 'show': true}
//		
//	}
	
	var parentId = tab.openerTabId;
	
	if (_bbTree[parentId]) {
		_bbTree[tab.id] = parentId;
	} else {
		_bbTree[parentId] = -1;
		_bbTree[tab.id] = parentId;
	}
}

function treeTabRemoved(tabId) {
	
	if (_bbTree[tabId]) {
		
		var parentId = _bbTree[tabId];
		
		for (var id in _bbTree) {//find all children
			if (_bbTree[id] == tabId) {
				_bbTree[id] = parentId;
			}
		}
		
		delete _bbTree[tabId];
	}
}


function treeAddRoot(windowId) {
	_bbTree[windowId] = {
		parent: -1,
		children: [],
		collapsed: false
	};
}

function treeAddTab(tab) {
	
	var parentId;
	if (tab.openerTabId && tab.url != 'chrome://newtab/') {
		parentId = tab.openerTabId;
	} else {
		parentId = tab.windowId;
	}
	
	_bbTree[tab.id] = {
		parent: parentId,
		children: [],
		collapsed: false
	};
	
	_bbTree[parentId].children.push(tab.id);
}

function treeRemoveTab(tabId) {
	var self = _bbTree[tabId];
	var children = _bbTree[tabId].children;
	
	//transfer children to parent
	for (var i = 0; i < children.length; i++) {
		_bbTree[self.parent].children.push(children[i]);
		_bbTree[children[i]].parent = self.parent;
	}
	
	//remove self from parent
	var index = _bbTree[self.parent].children.indexOf(tabId);
	if (index > -1) {
		_bbTree[self.parent].children.splice(index, 1);
	}
	
	//remove self from _bbTree
	delete _bbTree[tabId];
}

function treeSwapTab(addedTabId, removedTabId) {
	var removed = _bbTree[removedTabId];
	_bbTree[addedTabId] = removed;
	var index = _bbTree[removed.parent].children.indexOf(removedTabId);
	if (index !== -1) {
		_bbTree[removed.parent].children[index] = addedTabId;
	}
	delete _bbTree[removedTabId];
}



//function treeAddTab(tab) {
//	
//	var parentId = tab.openerTabId;
//	var tabId = tab.id;
//	
//	
//	_bbTree[tabId] = {
//		parent: parentId,
//		children: [],
//		collapsed: false
//	};
//
//	
//	if (_bbTree[parentId]) {
//		_bbTree[parentId].children.push(tabId);
//	} else {
//		_bbTree[parentId] = {
//			parent: -1,
//			children: [tabId],
//			collapsed: false
//		};
//	}
//	
//	console.log(_bbTree);
//	
//}
//
//function treeRemoveTab(tabId) {
//	
//	var self = _bbTree[tabId];
//	console.log(_bbTree[tabId]);
//	var children = _bbTree[tabId].children;
//	
//	//transfer children to parent
//	for (var i = 0; i < children.length; i++) {
//
//		if (self.parent >= 0) {
//			_bbTree[self.parent].children.push(children[i]);
//		}
//		
//		_bbTree[children[i]].parent = self.parent;
//	}
//	
//	//remove self from parent
//	if (self.parent >= 0) {
//		var index = _bbTree[self.parent].children.indexOf(tabId);
//		if (index > -1) {
//			_bbTree[self.parent].children.splice(index, 1);
//		}
//	}
//
//	delete _bbTree[tabId];
//}

