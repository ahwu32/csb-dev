/**
 * Chrome Sidetabs
 *
 * inject.js
 * @author ah.wu32@gmail.com
 */

console.log('inject testing');
console.time('inject');

inject();

function inject() {
	
	var sidebarOpen;
	
	var htmlEl = document.documentElement;
	var bodyEl = document.body;
	var childEl = document.createElement('div');
	childEl.id = "csb-wrapper";
	
	var frameId = 'csb-sidebar-frame';
	var toggleHtml = '<div id="csb-toggle-btn"><div id="csb-toggle-icon"></div></div><div id="csb-overlay"></div>';
	var iframeHtml = '<iframe id="' + frameId + '" src="' + chrome.extension.getURL("sidebar/sidebar.html") + '"</iframe>';
	
	childEl.innerHTML = toggleHtml + iframeHtml;
	htmlEl.appendChild(childEl);
	
	//hide show functions
	var toggleEl = document.getElementById('csb-toggle-btn');
	var sidebarEl = document.getElementById(frameId);
	var overlayEl = document.getElementById('csb-overlay');
	
	
	toggleEl.addEventListener('click', function(e) {
		
		if (e) {
			e.stopPropagation();
		}
		
//		sidebarEl.style.left = "0px";
		sidebarEl.className = "show-sidebar";
		fadeIn(overlayEl);
		
		chrome.runtime.sendMessage({sidebarOpened: true});
		sidebarOpen = true;
		
		//Working velocity animations
//		Velocity(sidebarEl, {left: 0}, {duration: 300});
//		Velocity(overlayEl, {opacity: 0.7}, {duration: 300, queue: false, display: 'block'});
		
	}, false);
	
	
	document.onclick = function() {
//		alert('body clicked');
//		sidebarEl.style.left = "-250px";
//		sidebarEl.style.display = "none";
//		sidebarEl.className = 'hidden';
		
//		sidebarEl.style.left = "-250px";
		
		if (sidebarOpen) {
			sidebarEl.className = "";
			fadeOut(overlayEl);

			chrome.runtime.sendMessage({
				sidebarClosed: true
			});
			
			sidebarOpen = false;
		}

		
		//Workign velocity animations
//		Velocity(sidebarEl, {left: -250}, {duration: 300});
//		Velocity(overlayEl, {opacity: 0}, {duration: 300, display: 'none'});
	}
	
	function fadeIn(overlayEl) {
		overlayEl.style.visibility = "visible";
		overlayEl.style.opacity = 0.4;
	}
	
	function fadeOut(overlayEl) {
		overlayEl.style.opacity = 0;
	}
	
	overlayEl.addEventListener("transitionend", function() {
		if (overlayEl.style.opacity === '0') {
			overlayEl.style.visibility = "hidden";
		}
	}, true);
		
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.onActivated) {
			sidebarEl.className = "show-sidebar-instant"
			overlayEl.style.visibility = "visible";
			sidebarOpen = true;
		}
	});
	
	console.timeEnd('inject');
	console.timeEnd('injectTotal');
}

function openSidebar() {
	
}

//
//function injectJquery() {
//	var frameId = 'cbb-sidebar-frame';
//	var frameHtml = "";
//	
//	var activateHtml = '<div id="csb-toggle-btn"><div id="csb-toggle-icon"></div></div><div id="csb-overlay"></div>';
//	
//	$('html').append(
//		'<iframe id="' + frameId + '" src="' + chrome.extension.getURL("sidebar/sidebar.html") + '"  ' + '</iframe>'
//	);
//	
//	$('html').append(activateHtml);
//	
//	console.timeEnd('inject');
//	console.timeEnd('injectTotal');
//}


////original
//console.log('inject goooo');
//console.time('inject');
//(function () {
//	
//	var htmlEl = document.documentElement;
//
//	var frameId = 'cbb-sidebar-frame';
//	var frameHtml = "";
//	
//	var activateHtml = '<div id="csb-toggle-btn"><div id="csb-toggle-icon"></div></div><div id="csb-overlay"></div>';
//
//
//	
//
////	$('html').append(
////		'<iframe id="' + frameId + '" src="' + chrome.extension.getURL("sidebar/sidebar.html") + '" scrolling="no" frameborder="0" allowtransparency="false" ' + '</iframe>'
////	);
//	
//	$('html').append(
//		'<iframe id="' + frameId + '" src="' + chrome.extension.getURL("sidebar/sidebar.html") + '"  ' + '</iframe>'
//	);
//	
//	$('html').append(activateHtml);
//	
//
//	$('#' + frameId).hover(function () {
//		$("body").css("overflow", "hidden");
//	}, function () {
//		$("body").css("overflow", "auto");
//	});
//
//	$('#cbb-activate-wrapper').hover(function () {
//		console.log('test');
//		$('#cbb-activate').css('opacity', 0.4);
//	}, function () {
//		$('#cbb-activate').css('opacity', 0.2);
//	});
//
//	// FIXME -- what the fuck variable names?
//	$('#csb-toggle-btn').click(function () {
//		$('#cbb-sidebar-frame').velocity({
//			left: 0
//		}, 300, "easeInQuad");
//		
//		$('#csb-toggle-btn').velocity({
//			left: 244
//		}, 300);
//		
//		$('#csb-overlay').fadeIn();
//		
////		$('body').addClass('show-menu');
//	});
//	
//	
//
//	//	$('#cbb-activate-test').mouseenter(function() {
//	//		$('#cbb-sidebar-frame').velocity({
//	//			left: 0
//	//		}, 250, 'easeIn');
//	////		alert('activated');
//	//	});
//
//	$(document).on('click', function (event) {
//		if (!$(event.target).closest('#csb-toggle-btn').length) {
//			$('#cbb-sidebar-frame').velocity({
//				left: -250
//			}, 250, "easeOut");
//			
//			$('#csb-toggle-btn').velocity({
//				left: 0
//			}, 250);
//			
//			$('#csb-overlay').fadeOut();
//			
////			$('body').removeClass('show-menu');
//		}
//	});
//
//
//	//	$('#cbb-sidebar-frame').mouseleave(function () {
//	//		$('#cbb-sidebar-frame').velocity({
//	//			left: -250
//	//		}, 250, "easeOut");
//	//	});
//	console.timeEnd('inject');
//	console.timeEnd('injectTotal');
//})();
//
////CHECK IF SIDEBAR OPEN OR CLOSED ON PAGE LOAD
////chrome.runtime.sendMessage({isActive: true}, function (response) {
////	if (response.active) {
////		$('html').velocity({"padding-left":250}, 0);
////		$('#bb-sidebar-frame').velocity({left:0}, 0);
////	} else {
////		$('html').velocity({"padding-left":0}, 0);
////		$('#bb-sidebar-frame').velocity({left:-250}, 0);
////	}
////});
////
////chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
////	
////	if (request.requestTabs) {
////		var senderId = sender.tab.id;
//////		chrome.tabs.query({}, function(tabs) {
//////			sendResponse(tabs);
//////		});
////		chrome.tabs.query({}, function(tabs) {
////			sendResponse({
////				tabs: tabs,
////				self: senderId
////			});
////		});
////	} else if (request.gotoTab) {
////		chrome.tabs.get(request.gotoTab, function(tab) {
////			chrome.windows.update(tab.windowId, {focused:true}, function() {
////				chrome.tabs.update(tab.id, {active:true});
////			});
////		});
////	} else if (request.closeTab) {
////		chrome.tabs.remove(request.closeTab);
////		console.log('close code executed');
////		sendResponse(true);
////	} else if (request.show) {
//////		$('body').addClass('bb-body-open');
//////		$('#bb-sidebar-frame').addClass('bb-sidebar-open');
////		
////		$('html').velocity({"padding-left":250}, 250);
////		$('#bb-sidebar-frame').velocity({left:0}, 250);
////		console.log('showing' + Date.now());
////		
////	} else if (request.hide) {
//////		$('body').removeClass('bb-body-open');
//////		$('#bb-sidebar-frame').removeClass('bb-sidebar-open');
////		
////		
////		$('html').velocity({"padding-left":0}, 250);
////		$('#bb-sidebar-frame').velocity({left:-250}, 250);
////		
////		console.log('hiding' + Date.now());
////	} else if (request.onActivated) {
////		
////		console.log('inject activate detected');
////		
////		console.log(request.onActivated);
////		
////		if (request.onActivated > 0) {
////			$('html').velocity({"padding-left":250}, 0);
////			$('#bb-sidebar-frame').velocity({left:0}, 0);
////		} else {
////			$('html').velocity({"padding-left":0}, 0);
////			$('#bb-sidebar-frame').velocity({left:-250}, 0);
////		}
////	}
////	return true;
////});