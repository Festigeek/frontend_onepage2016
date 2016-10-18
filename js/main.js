;(function () {

	'use strict';



	// iPad and iPod detection
	var isiPad = function(){
		return (navigator.platform.indexOf("iPad") != -1);
	};

	var isiPhone = function(){
	    return (
			(navigator.platform.indexOf("iPhone") != -1) ||
			(navigator.platform.indexOf("iPod") != -1)
	    );
	};

	// Main Menu Superfish
	var mainMenu = function() {

		$('#fh5co-primary-menu').superfish({
			delay: 0,
			animation: {
				opacity: 'show'
			},
			speed: 'fast',
			cssArrows: true,
			disableHI: true
		});

	};

	// Parallax
	var parallax = function() {
		$(window).stellar();
	};


	// Offcanvas and cloning of the main menu
	var offcanvas = function() {

		var $clone = $('#fh5co-menu-wrap').clone();
		$clone.attr({
			'id' : 'offcanvas-menu'
		});
		$clone.find('> ul').attr({
			'class' : '',
			'id' : ''
		});

		$('#fh5co-page').prepend($clone);

		// click the burger
		$('.js-fh5co-nav-toggle').on('click', function(){

			if ( $('body').hasClass('fh5co-offcanvas') ) {
				$('body').removeClass('fh5co-offcanvas');
			} else {
				$('body').addClass('fh5co-offcanvas');
			}


		});

		$('#offcanvas-menu').css('height', $(window).height());

		$(window).resize(function(){
			var w = $(window);


			$('#offcanvas-menu').css('height', w.height());

			if ( w.width() > 769 ) {
				if ( $('body').hasClass('fh5co-offcanvas') ) {
					$('body').removeClass('fh5co-offcanvas');
				}
			}

		});

	}



	// Click outside of the Mobile Menu
	var mobileMenuOutsideClick = function() {
		$(document).click(function (e) {
	    var container = $("#offcanvas-menu, .js-fh5co-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('fh5co-offcanvas') ) {
				$('body').removeClass('fh5co-offcanvas');
			}
	    }
		});
	};


	// Animations

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							el.addClass('fadeInUp animated');
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});

				}, 100);

			}

		} , { offset: '85%' } );
	};

	var stickyBanner = function() {
		var $stickyElement = $('.sticky-banner');
		var sticky;
		if ($stickyElement.length) {
		  sticky = new Waypoint.Sticky({
		      element: $stickyElement[0],
		      offset: 0
		  })
		}
	};

	// Menu minimizer
	var menuMinimizer = function() {
		var navStatesInPixelHeight = [40,100];

		var changeNavState = function(nav, newStateIndex) {
			nav.data('state', newStateIndex).stop().animate({
				height : navStatesInPixelHeight[newStateIndex] + 'px'
			}, 600);
		};

		var boolToStateIndex = function(bool) {
			return bool * 1;
		};

		var maybeChangeNavState = function(nav, condState) {
			var navState = nav.data('state');
			if (navState === condState) {
				changeNavState(nav, boolToStateIndex(!navState));
			}
		};

		$('#header_nav').data('state', 1);

		$(window).scroll(function(){
			var $nav = $('#header_nav');

			if ($(document).scrollTop() > 0) {
				maybeChangeNavState($nav, 1);
			} else {
				maybeChangeNavState($nav, 0);
			}
		});
	}

	var menuMinimizer2 = function() {
		$(window).scroll(function() {
		  if ($(document).scrollTop() > 50) {
		    $('#fh5co-logo').addClass('wrap-logo');
				$('#fh5co-menu-wrap').addClass('wrap-menu');
				$('#fh5co-header-section').addClass('wrap');
		  } else {
		    $('#fh5co-logo').removeClass('wrap-logo');
				$('#fh5co-menu-wrap').removeClass('wrap-menu');
				$('#fh5co-header-section').removeClass('wrap');
		  }
		});
	}

	// Document on load.
	$(function(){
		mainMenu();
		parallax();
		offcanvas();
		mobileMenuOutsideClick();
		contentWayPoint();
		//stickyBanner();
		//menuMinimizer();
		menuMinimizer2();
	});


}());
