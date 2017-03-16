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
			}
      else {
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
      var container = $('#navigationbar');
      if (!container.is(e.target) && container.has(e.target).length === 0 && container.hasClass('in')) {
        $('#mobile_button').click();
      }
    });
	};

	// Scrolling Animations
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

	// FIX NAVBAR SIZE WHEN SCROLL-DOWN
	var initNavBar = function() {
		$('#mainNav').affix({
		  offset: {
		    top: 100
		  }
		})
	}

  // DISABLE SUPERFISH ON MOBILE VIEWPORT
	var fixClassSuperfish = function() {
		var viewportWidth = $(window).width();
		if (viewportWidth <= 768) {
				$("#fh5co-primary-menu").removeClass("sf-menu");
		} else {
				$("#fh5co-primary-menu").addClass("sf-menu");
		}
	}

	var fixSuperfish = function() {
		fixClassSuperfish();

		$(window).resize(function() {
		  fixClassSuperfish();
		});

     var navMain = $("#mainNav");
     navMain.on("click", "a", null, function () {
         navMain.collapse('hide');
     });
	}

	// FORM VALIDATOR
	var formValidator = function() {
		$('#contact-form').validator();

    $('#contact-form').on('submit', function (e) {
        if (!e.isDefaultPrevented()) {
            var url = "contact.php";

            $.ajax({
                type: "POST",
                url: url,
                data: $(this).serialize(),
                success: function (data)
                {
										//console.log(data);

                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                    if (messageAlert && messageText) {
                        $('#contact-form').find('.messages').html(alertBox);
                    }

										if(data.type == "success"){
											$('#contact-form')[0].reset();
										}

										grecaptcha.reset();
                }
            });
            return false;
        }
    })
	}

	// ADD SMOOTH SCROLLING ON NAVBAR LINKS
	var scrollSpy = function() {
		$('content').scrollspy();

		$('#mainNav a').bind('click', function(event) {
      var $anchor = $(this);
      var hash = this.hash;
      if($($anchor.attr('href')).offset() !== undefined) {
        event.preventDefault();
        if(hash != '') {
          if($(window).width() < 769)
            $("#navigationbar").collapse('hide');

          $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
          }, 1500, 'easeInOutExpo', function(){
            window.location.hash = hash;
          });
        }
      }
		});
	}

	var pub = function() {
		$('#myModal').modal();
	};

	// Document on load.
	$(function(){
		//mainMenu();
		parallax();
		offcanvas();
		mobileMenuOutsideClick();
		contentWayPoint();
		//stickyBanner();

		// Added by Mysteriosis
		//initNavBar(); // FIX NAVBAR SIZE WHEN SCROLL-DOWN
		//fixSuperfish(); // DISABLE SUPERFISH ON MOBILE VIEWPORT
		formValidator(); // FORM VALIDATOR
		scrollSpy(); // ADD SMOOTH SCROLLING ON NAVBAR LINKS
		//pub();
	});

}());
