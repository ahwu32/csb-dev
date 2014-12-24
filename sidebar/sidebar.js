
//$(function() {
//	 
//});



var _bbInit = false;
var _bbModel = [];
var _bbTree = {};
var _sbSelf;

//CLICK HANDLERS
$(document).ready(function () {
	
	initMultiWindow();
//	initAllWindows();
	console.time('checkActive');
	
	//loadState();
	
	//this is checking if sidebar is active in window, need check for if tab is current Active
	chrome.runtime.sendMessage({isActive: true}, function (response) {
		if (response.active) {
//			initMultiWindow();
			console.timeEnd('checkActive');
			//initMultiWindow();
		} else {
		}
	});
	
	//SWITCH TAB
	$('#bb-tab-list').on('click', '.bb-tab-content', function (e) {
		
		$('#bb-tab-list').empty();
		$('#bb-cover').removeClass('bb-cover-off');
		saveState();
		chrome.runtime.sendMessage({
			gotoTab: parseInt(this.parentNode.id),
			updateScroll: getScroll()
		});
		
		
	});

	//CLOSE TAB
	$('#bb-tab-list').on('click', '.bb-tab-close', function (e) {

//		e.stopPropagation();
		var id = this.parentNode.id;
		
		updateTabTreeRemove(id);

		chrome.runtime.sendMessage({
			closeTab: parseInt(id)
		}, function (response) {
			if (response) {
//				var scroll = $('#bb-sidebar').scrollTop() + 24;
				$('#' + id).remove();
//				$('#bb-sidebar').scrollTop(scroll);
			}
		});
	});
	
	//NEST TABS
	$('#bb-tab-list').on('click', '.bb-tree-toggle', function(e) {
		
		e.stopPropagation();
		collapseToggle($(this).parent().parent().attr('id'));
	});
	
	//NAV ON SCROLL EXPERIMENTAL
//	$('#bb-tab-list').bind('mousewheel', function(e){
//        if(e.originalEvent.wheelDelta > 0) {
////            $(this).text('scrolling up !');
//			
//			var navToId = $('#' + _sbSelf).prev().attr('id');
//			if (navToId) {
//				$('#bb-cover').removeClass('bb-cover-off');
//				$('#bb-tab-list').empty();
//				chrome.runtime.sendMessage({
//					gotoTab: parseInt(navToId),
//					updateScroll: getScroll()
//				});
//			}
//        }
//        else{
////            $(this).text('scrolling down !');
//			var navToId = $('#' + _sbSelf).next().attr('id');
//			if (navToId) {
//				$('#bb-cover').removeClass('bb-cover-off');
//				$('#bb-tab-list').empty();
//				chrome.runtime.sendMessage({
//					gotoTab: parseInt(navToId),
//					updateScroll: getScroll()
//				});
//			}
//        }
//    });
	
	
});

//ON MESSAGE LISTENERS
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.onCreated) {
		
		createNewTab(request.onCreated);

	} else if (request.onUpdated) {

		updateTab(request.onUpdated);

	} else if (request.onActivated) {
		console.log('tab activated');

		
		initOnActivated(request.scroll);
//		loadState();

		
	} else if (request.onRemoved) {
		removeTab(request.onRemoved);
	}
	
	if (request.show) {
//		initMultiWindow();
	}
});

//REMOVE TAB
function removeTab(tabId) {
	$('#' + tabId).remove();
	positionAnimate();
}

//CREATE NEW TAB
function createNewTab(tab) {

	var newTab = '<div class="bb-tab-item bb-tab-visible" id="' + tab.id + '"><div class="bb-tab-content"><img class="bb-tab-icon" src="/loader.gif"><div class="bb-tab-title">' + tab.url + '</div></div><div class="bb-tab-close"></div></div>';

//	increaseTabListStyle();
	var index = tab.index + 1;
	$(newTab).insertAfter('.bb-tab-item:nth-child(' + index + ')');
	positionAnimate();
	updateTabTree(tab.id);
}

//UPDATE TAB
function updateTab(tab) {
	var tabItem = $('#' + tab.id);
	if (tab.favIconUrl) {
		tabItem.find('.bb-tab-icon').attr('src', tab.favIconUrl);
	}
	var collapsedTracker = tabItem.find('.bb-tab-count');
	tabItem.find('.bb-tab-title').html(tab.title);
	tabItem.find('.bb-tab-title').prepend(collapsedTracker);
}

//ON ACTIVATED
function onActivated(scroll) {
	
	if (_bbInit) {
		$('#bb-tab-list').scrollTop(scroll);
	} else {
		initMultiWindow();
		$('#bb-tab-list').scrollTop(scroll);
		_bbInit = true;
	}
}

//BECAME ACTIVE ON TAB SWTICH OR TAB CLOSE
function initOnActivated(scroll) {
	
//	console.log('initOnActivated(' + scroll + ')');
	console.time('initOnActivated');
	$('#bb-cover').addClass('bb-cover-off');
	$('#bb-tab-list').empty();
	chrome.runtime.sendMessage({requestTabs: "multiWindow"}, function (response) {

		var windows = response.windows;
		var self = response.self;
		var tree = response.tree;
		

		//find current window
		var current;
		for (var i = 0; i < windows.length; i++) {
			if (windows[i].id == self.windowId) {
				current = i;
				break;
			}
		}

		current = windows[current];
		windows.splice(current, 1);

		var tabList = "";
		var tabs = current.tabs;
		var selfId = self.id;
		_sbSelf = selfId;

		for (var j = 0; j < tabs.length; j++) {
			tabList += createTabItem(tabs[j], selfId);
		}

//		createTabListStyles(tabs.length + 1);		
		$('#bb-tab-list').html(createWindowTabNew({window:current, active:true}) + tabList);
		
		initTabTree(tree);
		positionSet();
		
		
		$('#bb-tab-list').scrollTop(scroll);
		
		$('#' + selfId).find('.bb-tab-content').velocity({
			backgroundColorAlpha: 0.4,
			color: '#ffffff'
		}, 250);
		
//		saveHtml();
		console.timeEnd('initOnActivated');
		
	});
	
}

function initAllWindows() {
	chrome.runtime.sendMessage({requestTabs: "multiWindow"}, function (response) {
		var windows = response.windows;
		var self = response.self;
		var tree = response.tree;
		
		//find current window
		var current;
		for (var i = 0; i < windows.length; i++) {
			if (windows[i].id == self.windowId) {
				current = i;
				break;
			}
		}

		var currentWindow = windows[current];
		windows.splice(current, 1);
		
		var tabItems = "";
		tabItems += createWindowedTabList(currentWindow, true);
		
		for (var j = 0; j < windows.length; j++) {
			tabItems += createWindowedTabList(windows[j], false);
		}
		
		createTabListStyles(100);
		$('#bb-tab-list').html(tabItems);
		initTabTree(tree);
		
		//style self if necessary
		
	});
}


function createWindowedTabList(window, active) {
	
	var tabs = window.tabs;
	var tabList = "";
	
	if (active) {
		tabList += createWindowTab(tabs.length, true);
		tabList += createTabList(tabs, true);
	
		return tabList;
	} else {
		
		tabList += createWindowTab(tabs.length, false);
		tabList += createTabList(tabs, false);
	
		return tabList;
	}
	

}

function createTabList(tabList, active) {
	var tabHtml = "";
	
	if (active) {
		for (var i = 0; i < tabList.length; i++) {
			tabHtml += createTabItem(tabList[i], true);
		}
		
	} else {
		for (var j = 0; j < tabList.length; j++) {
			tabHtml += createTabItem(tabList[j], false);
		}
	}

	return tabHtml;
}

function createWindowTab(numTabs, active) {
	if (active) {
		return'<div class="bb-tab-item bb-tab-visible bb-window-tab" id=""><div class="bb-tab-content"><img class="bb-tab-icon" src=""><div class="bb-tab-title">Window (' + numTabs + ' TABS)</div></div><div class="bb-tab-close"></div></div>';
	} else {
		return'<div class="bb-tab-item bb-tab-visible bb-window-tab bb-not-active" id=""><div class="bb-tab-content"><img class="bb-tab-icon" src=""><div class="bb-tab-title">Window (' + numTabs + ' TABS)</div></div><div class="bb-tab-close"></div></div>';
		
	}
}

function createWindowTabNew(options) {
	
	var window = options.window;
	
	if (options.active) {
		return'<div class="bb-tab-item bb-tab-visible bb-window-tab" id="' + window.id + '"><div class="bb-tab-content"><img class="bb-tab-icon" src=""><div class="bb-tab-title">Window (' + window.tabs.length + ' TABS)</div></div><div class="bb-tab-close"></div></div>';
	} else {
		return'<div class="bb-tab-item bb-tab-visible bb-window-tab bb-not-active" id="' + window.id + '"><div class="bb-tab-content"><img class="bb-tab-icon" src=""><div class="bb-tab-title">Window (' + window.tabs.length + ' TABS)</div></div><div class="bb-tab-close"></div></div>';
		
	}
	
}

function createTabItem(tab, active) {
	
	var favIcon = tab.favIconUrl;
	var title = tab.title;
	var tabId = tab.id;
	
	if (active) {
		return '<div draggable="true" class="bb-tab-item bb-tab-visible" id="' + tabId + '"><div class="bb-tab-content"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div></div><div class="bb-tab-close"></div></div>';
	} else {
		return '<div class="bb-tab-item bb-tab-visible bb-not-active" id="' + tabId + '"><div class="bb-tab-content"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div></div><div class="bb-tab-close"></div></div>';
	}
}


//function createTabItem(tab, self) {
//	var favIcon = tab.favIconUrl;
//	var title = tab.title;
//	var tabId = tab.id;
//
//	if (tabId == self) {
////		return '<div class="bb-tab-item bb-tab-self" id="' + tabId + '"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div><div class="bb-tab-close"></div></div>';
//		return '<div class="bb-tab-item bb-tab-self" id="' + tabId + '"><div class="bb-tab-content"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div></div><div class="bb-tab-close"></div></div>';
//	} else {
////		return '<div class="bb-tab-item" id="' + tabId + '"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div><div class="bb-tab-close"></div></div>';
//		
//		return '<div class="bb-tab-item" id="' + tabId + '"><div class="bb-tab-content"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div></div><div class="bb-tab-close"></div></div>';
//	}
//}


function initMultiWindow() {

	//global variable for settings -> variable in request tabs -> if statement on that end? lots of ifs
	//just different methods for each type of all window/1window

	//ask for current tabs, return array of windows with arrays of tabs

	console.time('initMultiWindow');

	chrome.runtime.sendMessage({
		requestTabs: "multiWindow"
	}, function (response) {

		var windows = response.windows;
		var self = response.self;
		var tree = response.tree;

		//find current window
		var current;
		for (var i = 0; i < windows.length; i++) {
			if (windows[i].id == self.windowId) {
				current = i;
				break;
			}
		}

		current = windows[current];
		windows.splice(current, 1);

		var tabList = "";
		var tabs = current.tabs;
		console.log("tabs: " + tabs);
		var selfId = self.id;
		_sbSelf = selfId;

		for (var j = 0; j < tabs.length; j++) {
//			tabList += createTreeTabItem(tabs[j], selfId);
			tabList += createTabItem(tabs[j], selfId);
		}

//		createTabListStyles(tabs.length + 1);
		
		
		
		

//		console.time('append')
//		$('#bb-tab-list').append(createWindowTab(tabs.length));
//		$('#bb-tab-list').append(tabList);
//		console.timeEnd('append');
		

		
		$('#bb-tab-list').html(createWindowTabNew({window:current,active:true}) + tabList);
		
//		positionAnimate();
		
		
		initTabTree(tree);
		positionSet();
//		_bbTree = tree;
		
		$('#' + selfId).find('.bb-tab-content').velocity({
			backgroundColorAlpha: 0.4,
			color: '#ffffff'
		}, 250);
		
		$('#bb-cover').addClass('bb-cover-off');
		
		console.timeEnd('initMultiWindow');
		
//		$('#' + selfId).find('.bb-tab-content').velocity({
//			opacity: 0.4,
//			color: 'white'
//		}, 500);

	});
}



function getScroll() {
	return $('#bb-tab-list').scrollTop();
}

function createTabListStyles(numItems) {
	var rules = [];
	for (var i = 0; i < numItems; i++) {
		var nthChild = '.bb-tab-item:nth-child(' + (i + 1) + ')';
		var transform = '{ -webkit-transform: translate3d(0,' + (i * 100) + '%, 0);}';
		rules.push(nthChild + transform);
	}
	
	$('#bb-style').html(rules);
	console.log('created styles');
//	var headElem = document.getElementsByTagName("head")[0],
//		styleElem = $("<style>").attr("type", "text/css").appendTo(headElem)[0];
//
//	if (styleElem.styleSheet) {
//		styleElem.styleSheet.cssText = rules.join("\n");
//		console.log('test1');
//	} else {
//		styleElem.textContent = rules.join("\n");
//		console.log('test2');
//	}
}

function increaseTabListStyle() {
	var newStyleIndex = $('.bb-tab-item').length;
	var nthChild = '.bb-tab-item:nth-child(' + (newStyleIndex + 1) + ')';
	var transform = '{ -webkit-transform: translate3d(0,' + (newStyleIndex * 100) + '%, 0);}';

	var headElem = document.getElementsByTagName("head")[0],
		styleElem = $("<style>").attr("type", "text/css").appendTo(headElem)[0];

	if (styleElem.styleSheet) {
		styleElem.styleSheet.cssText = nthChild + transform;
		console.log('test1');
	} else {
		styleElem.textContent = nthChild + transform;
		console.log('test2');
	}
}

//function createTabItem(tab, self) {
//	var favIcon = tab.favIconUrl;
//	var title = tab.title;
//	var tabId = tab.id;
//
//	if (tabId == self) {
////		return '<div class="bb-tab-item bb-tab-self" id="' + tabId + '"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div><div class="bb-tab-close"></div></div>';
//		return '<div class="bb-tab-item bb-tab-self" id="' + tabId + '"><div class="bb-tab-content"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div></div><div class="bb-tab-close"></div></div>';
//	} else {
////		return '<div class="bb-tab-item" id="' + tabId + '"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div><div class="bb-tab-close"></div></div>';
//		
//		return '<div class="bb-tab-item" id="' + tabId + '"><div class="bb-tab-content"><img class="bb-tab-icon" src="' + favIcon + '"><div class="bb-tab-title">' + title + '</div></div><div class="bb-tab-close"></div></div>';
//	}
//}



function updateTabTree(tabId) {
	chrome.runtime.sendMessage({getTree: true}, function (response) {

		var tree = response.tree;
		
		var index = 0;
		var parent = tree[tabId].parent;
		
		if (parent !== -1) {
			attachTreeToggle(parent);
		}
		
		while (parent !== -1) {
			parent = tree[parent].parent;
			index++;
		}
		
		$('#' + tabId).velocity({'paddingLeft': index * 8}, 250, 'easeOutCirc');

//		for (var id in tree) {
//
//			if (tree[id] == -1) { //you are a root
//				//do nothing
//			} else {
//				var parentId = tree[id];
//				var index = 1;
//				while (tree[parentId] != -1) {
//					parentId = tree[parentId];
//					index++;
//				}
//				$('#' + id).velocity({
//					'paddingLeft': index * 15
//				}, 250);
//			}
//
//		}
	});
}

function updateTabTreeRemove(tabId) {
	chrome.runtime.sendMessage({getTree: true}, function (response) {
		var tree = response.tree;
		var children = tree[tabId].children;
		var grandChildren = [];
		
		while (children.length > 0) {
			grandChildren = [];
			for (var i = 0; i < children.length; i++) {
				$('#' + children[i]).velocity({'paddingLeft': '-=8px'}, 250, 'easeOutCirc');
				if (tree[children[i]].children.length > 0) {
					grandChildren.push.apply(grandChildren, tree[children[i]].children);
				}
			}
			children = grandChildren;			
		}
	});
}

function attachTreeToggle(tabId) {
	$('#' + tabId).find('.bb-tab-content').prepend('<div class="bb-tree-toggle"><i class="fa fa-caret-down"></i></i></div>');
}

function setTabTree() {
	chrome.runtime.sendMessage({getTree: true}, function (response) {

		var tree = response.tree;
		console.log(tree);

		for (var id in tree) {

			if (tree[id] == -1) { //you are a root
				//do nothing
			} else {
				var parentId = tree[id];
				var index = 1;
				while (tree[parentId] != -1) {
					parentId = tree[parentId];
					index++;
				}
				$('#' + id).css('left', index*15 + 'px');
			}

		}
	});
}


function positionAnimate() {
	$('.bb-tab-visible').each(function(index) {
		$(this).velocity({
			top: index * 28
		}, 0, 'easeOutCirc');
	});
}

function positionSet() {
	$('.bb-tab-visible').each(function(index) {
		$(this).css('top', index * 28 + 'px');
	});
}

function collapseToggle(tabId) {
	
	console.time('collapse');
	chrome.runtime.sendMessage({getTree: true}, function (response) {
		
		var tree = response.tree;
		var children = tree[tabId].children;
		var grandChildren;
		var childId;

		if (tree[tabId].collapsed) {
			
			chrome.runtime.sendMessage({collapseToggle:tabId});
			
			$('#' + tabId).find('.bb-tree-toggle').velocity({rotateZ:"0deg"}, 250, 'easeOutCirc');
			
			while (children.length > 0) {
				
				grandChildren = [];
				
				for (var i = 0; i < children.length; i++) {
					
					childId = children[i];
					$('#' + childId).addClass('bb-tab-visible');
					
					if (tree[childId].children.length > 0 && !tree[childId].collapsed) {
						grandChildren.push.apply(grandChildren, tree[childId].children);
					}
				}
				children = grandChildren;
				
			}
			
			$('#' + tabId).find('.bb-tab-count').remove();
			
		} else {
			
			chrome.runtime.sendMessage({collapseToggle:tabId});
			
			$('#' + tabId).find('.bb-tree-toggle').velocity({rotateZ:"-90deg"}, 250, 'easeOutCirc');
			var childCounter = 0;
			
			while (children.length > 0) {
				
				grandChildren = [];
				childCounter += children.length;
				
				for (var j = 0; j < children.length; j++) {
					
					childId = children[j];
					$('#' + childId).removeClass('bb-tab-visible');
					
//					if (tree[childId].children.length > 0 && !tree[childId].collapsed) {
					if (tree[childId].children.length > 0) {
						grandChildren.push.apply(grandChildren, tree[childId].children);
					}			
				}
				children = grandChildren;
			}
			
			$('#' + tabId).find('.bb-tab-title').prepend('<span class="bb-tab-count">[' + childCounter + '] </span>');
			console.log('childCounter: ' + childCounter);
		}
		
		positionAnimate();
		console.timeEnd('collapse');
	});
}


function initTabTree(tree) {
	console.time('initTabTree');
	
	for (var id in tree) {
		
		if (tree[id].parent === -1) {

			
			if (tree[id].children.length > 0) {
				$('#' + id).find('.bb-tab-content').prepend('<div class="bb-tree-toggle"><i class="fa fa-caret-down"></i></i></div>');
			}
			
			var index = 1;
			var children = [];
			var hiddenChildren = [];
			var grandChildren = [];
			var grandHiddenChildren = [];			
			
			if (tree[id].collapsed) {
				hiddenChildren = tree[id].children;
			} else {
				children = tree[id].children;
			}
						
			while (children.length > 0 || hiddenChildren.length > 0) {
				
				grandChildren = [];
				grandHiddenChildren = [];
				
				for (var i = 0; i < children.length; i++) {
					
					currentId = children[i];
					$('#' + currentId).css('padding-left', index * 8 + 'px');
					
					if (tree[currentId].children.length > 0) {
						$('#' + currentId).find('.bb-tab-content').prepend('<div class="bb-tree-toggle"><i class="fa fa-caret-down"></i></i></div>');
						if (tree[currentId].collapsed) {
							$('#' + currentId).find('.bb-tree-toggle').velocity({'rotateZ':-90},0);
							grandHiddenChildren.push.apply(grandHiddenChildren, tree[currentId].children);
						} else {
							grandChildren.push.apply(grandChildren, tree[currentId].children);
						}
					}
						
				}
				
				for (var j = 0; j < hiddenChildren.length; j++) {
					
					currentId = hiddenChildren[j];
					$('#' + currentId).css('padding-left', index * 8 + 'px');
					$('#' + currentId).removeClass('bb-tab-visible');
					
					if (tree[currentId].children.length > 0) {
						$('#' + currentId).find('.bb-tab-content').prepend('<div class="bb-tree-toggle"><i class="fa fa-caret-down"></i></i></div>');
						if (tree[currentId].collapsed) {
							$('#' + currentId).find('.bb-tree-toggle').velocity({'rotateZ':-90},0);
						}
						grandHiddenChildren.push.apply(grandHiddenChildren, tree[currentId].children);
					}
					
				}
				
				children = grandChildren;
				hiddenChildren = grandHiddenChildren;
				index++;
			}
				
		}
		
	}
	
	for (var id in tree) {
		if (tree[id].collapsed) {
			
			var children = tree[id].children;
			var grandChildren;
			var childId;
			
			var childCounter = 0;
			
			while (children.length > 0) {
				
				grandChildren = [];
				childCounter += children.length;
				
				for (var j = 0; j < children.length; j++) {
					childId = children[j];
					if (tree[childId].children.length > 0) {
						grandChildren.push.apply(grandChildren, tree[childId].children);
					}			
				}
				children = grandChildren;
			}
			
			$('#' + id).find('.bb-tab-title').prepend('<span class="bb-tab-count">[' + childCounter + '] </span>');
			console.log('childCounter: ' + childCounter + ' inittabtree');
		}
	}
	console.timeEnd('initTabTree');
	
	
//	for (var id in tree) {
//		if (tree[id].collapsed) {
//			//change button position
//			//make sure all children hidden
//			var child = tree[id].children;
//			for (var i = 0; i < child.length; i++) {
//				$('#' + child[i]).removeClass('bb-tab-visible');
//			}
//		}
//		
//		if (tree[id].parent === -1) {
//						
//			var index = 2;
//			var children = tree[id].children;
//			var nextChildren = [];
//			
//			if (children.length > 0) {
//				$('#' + id).find('.bb-tab-content').prepend('<div class="bb-tree-toggle"><i class="fa fa-caret-down"></i></i></div>');
//			}
//			
//			while(children.length > 0) {
//				
//				nextChildren = [];
//				
//				for (var i = 0; i < children.length; i++) {
//					
//					
//					
//					childId = children[i];
//					$('#' + childId).css('padding-left', index * 8 + 'px');
//					
//					if (tree[childId].children.length > 0) {
//						$('#' + childId).find('.bb-tab-content').prepend('<div class="bb-tree-toggle"><i class="fa fa-caret-down"></i></i></div>');
//						nextChildren.push.apply(nextChildren, tree[childId].children);
//					}
//				}
//				
//				children = nextChildren;
//				index++;
//			}
//		}
//	}
}

function saveHtml() {
	console.time('saveHtml');
	var test = document.getElementById("bb-tab-list").innerHTML;
	chrome.storage.local.set({'windowId': test}, function() {
		console.log('html saved');
		console.timeEnd('saveHtml');
	});
	
}

function saveState() {
	console.time('saveState');
	var test = document.getElementById("bb-tab-list").innerHTML;
	chrome.storage.local.set({'windowId': test}, function() {
		console.timeEnd('saveState');
	});
}

function getTabState() {
	console.time('getTabState');
	chrome.storage.local.get('windowId', function(items) {
//		$('#bb-tab-list').html(items.windowId);
		console.timeEnd('getTabState');
	});
}

function loadState() {
	console.time('loadState');
	chrome.storage.local.get('windowId', function(items) {
		$('#bb-tab-list').html(items.windowId);
		console.timeEnd('loadState');
	});
}


function collapseToggleSlide(tabId) {
	
	console.time('collapseSlide');
	chrome.runtime.sendMessage({getTree: true}, function (response) {
		
		var tree = response.tree;
		var children = tree[tabId].children;
		var grandChildren;
		var childId;

		if (tree[tabId].collapsed) {
			
			chrome.runtime.sendMessage({collapseToggle:tabId});
			
			$('#' + tabId).find('.bb-tree-toggle').velocity({rotateZ:"0deg"}, 250, 'easeOutCirc');
			
			while (children.length > 0) {
				
				grandChildren = [];
				
				for (var i = 0; i < children.length; i++) {
					
					childId = children[i];
					$('#' + childId).addClass('bb-tab-visible');
					
					if (tree[childId].children.length > 0 && !tree[childId].collapsed) {
						grandChildren.push.apply(grandChildren, tree[childId].children);
					}
				}
				children = grandChildren;
				
			}
			
			$('#' + tabId).find('.bb-tab-count').remove();
			
		} else {
			
			chrome.runtime.sendMessage({collapseToggle:tabId});
			
			$('#' + tabId).find('.bb-tree-toggle').velocity({rotateZ:"-90deg"}, 250, 'easeOutCirc');
			var childCounter = 0;
			
			while (children.length > 0) {
				
				grandChildren = [];
				childCounter += children.length;
				
				for (var j = 0; j < children.length; j++) {
					
					childId = children[j];
					$('#' + childId).removeClass('bb-tab-visible');
					
//					if (tree[childId].children.length > 0 && !tree[childId].collapsed) {
					if (tree[childId].children.length > 0) {
						grandChildren.push.apply(grandChildren, tree[childId].children);
					}			
				}
				children = grandChildren;
			}
			
			$('#' + tabId).find('.bb-tab-title').prepend('<span class="bb-tab-count">[' + childCounter + '] </span>');
			console.log('childCounter: ' + childCounter);
		}
		
		positionAnimate();
		console.timeEnd('collapse');
	});
}