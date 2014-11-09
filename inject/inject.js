(function() {
	
	var frameId = 'cbb-sidebar-frame';
	var frameHtml = "";
	
	$('html').append(
		'<iframe id="' + frameId + '" src="' + chrome.extension.getURL("sidebar/placeholder.html") + '" scrolling="no" frameborder="0" allowtransparency="false" ' + '</iframe>'
	);
	
//	window.innerWidth = 400;
	
//	$('html').append('<div id="bb-push-push-buffer"></div><div id="bb-push-push"></div>');
	
	
	var activateHtml = '<div id="cbb-activate-wrapper"><div id="cbb-activate-buffer"></div><div id="cbb-activate"></div></div>';
	
	var activateHtml = '<div id="cbb-activate-test"><div id="cbb-activate-test-inner"></div></div>';
	
	
	$('html').append(activateHtml);
		
	$('#' + frameId).hover(function () {
		$("body").css("overflow", "hidden");
	}, function () {
		$("body").css("overflow", "auto");
	});
	
	$('#cbb-activate-buffer').hover(function() {
		console.log('test');
		$('#cbb-activate').velocity({
			opacity: 0.5
		}, 250);
	}, function() {
		$('#cbb-activate').velocity({
			opacity: 1.0
		}, 250);
	});
	
	$('#cbb-activate-buffer').mouseenter(function() {
		
	});
	
})();

//CHECK IF SIDEBAR OPEN OR CLOSED ON PAGE LOAD
//chrome.runtime.sendMessage({isActive: true}, function (response) {
//	if (response.active) {
//		$('html').velocity({"padding-left":250}, 0);
//		$('#bb-sidebar-frame').velocity({left:0}, 0);
//	} else {
//		$('html').velocity({"padding-left":0}, 0);
//		$('#bb-sidebar-frame').velocity({left:-250}, 0);
//	}
//});
//
//chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//	
//	if (request.requestTabs) {
//		var senderId = sender.tab.id;
////		chrome.tabs.query({}, function(tabs) {
////			sendResponse(tabs);
////		});
//		chrome.tabs.query({}, function(tabs) {
//			sendResponse({
//				tabs: tabs,
//				self: senderId
//			});
//		});
//	} else if (request.gotoTab) {
//		chrome.tabs.get(request.gotoTab, function(tab) {
//			chrome.windows.update(tab.windowId, {focused:true}, function() {
//				chrome.tabs.update(tab.id, {active:true});
//			});
//		});
//	} else if (request.closeTab) {
//		chrome.tabs.remove(request.closeTab);
//		console.log('close code executed');
//		sendResponse(true);
//	} else if (request.show) {
////		$('body').addClass('bb-body-open');
////		$('#bb-sidebar-frame').addClass('bb-sidebar-open');
//		
//		$('html').velocity({"padding-left":250}, 250);
//		$('#bb-sidebar-frame').velocity({left:0}, 250);
//		console.log('showing' + Date.now());
//		
//	} else if (request.hide) {
////		$('body').removeClass('bb-body-open');
////		$('#bb-sidebar-frame').removeClass('bb-sidebar-open');
//		
//		
//		$('html').velocity({"padding-left":0}, 250);
//		$('#bb-sidebar-frame').velocity({left:-250}, 250);
//		
//		console.log('hiding' + Date.now());
//	} else if (request.onActivated) {
//		
//		console.log('inject activate detected');
//		
//		console.log(request.onActivated);
//		
//		if (request.onActivated > 0) {
//			$('html').velocity({"padding-left":250}, 0);
//			$('#bb-sidebar-frame').velocity({left:0}, 0);
//		} else {
//			$('html').velocity({"padding-left":0}, 0);
//			$('#bb-sidebar-frame').velocity({left:-250}, 0);
//		}
//	}
//	return true;
//});
