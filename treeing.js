$('.dd').nestable({ /* config options */ });

$('#click-me').click(function () {
	$('#testing-ol').velocity('slideUp');
});

$('#click-me-too').click(function () {
	$('#testing-ol').velocity('slideDown');
});

$('#click-me-three').click(function () {
//	$('.tab-item').each(function (index) {
//		$(this).velocity({
//			top: index * 18
//		}, 300);
//			});
		$('.tab-item').each(function (index) {
			$(this).animate({
				top: index * 18
			});
		});

});

$('#click-me-four').click(function() {
	$('.tab-item').each(function(index) {
		$(this).velocity({
			top: '-=120'	
		});
	});	
});

$('#click-me-five').click(function() {
	var $tabItem = $('<div class="tab-item">Dynamically Created Div</div>');
	
	$('.tab-item').first().after($tabItem);
	$tabItem.velocity('slideDown');
});

//$('#testing-ol').velocity('slideUp');