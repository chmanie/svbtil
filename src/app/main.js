(function (window, document) {

  'use strict';

  var invitee;

  var ANIM_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var TRANSITION_END = 'transitionend oTransitionEnd webkitTransitionEnd';

  var $ = window.jQuery;

  var t = new window.Trianglify();
  var backgroundCanvas = $('.svb-background-canvas');
  var pattern = t.generate(backgroundCanvas.width(), backgroundCanvas.height());
  backgroundCanvas.css('background-image', pattern.dataUrl);

  var animate = {
    headerWrapper: function (cb) {
      var headerWrapper = $('#svb-header-wrapper');
      headerWrapper.addClass('animated fadeIn')
        .one('click', function moveHeader () {
          headerWrapper.css('height', '0');
          $(this).find('h1').addClass('final-position')
            .one(TRANSITION_END, cb);
        });
    }
  };

  function initialize () {
    if (window.location.hash) {

      var inviteeId = window.location.hash.substr(1);

      $.ajax({
        url: 'http://localhost:9000/v1/visitors/' + inviteeId,
        type: 'GET',
        crossDomain: true,
        success: function (response) {
          invitee = response;
        },
        error: function (xhr, status) {
          console.log('error');
          console.log(status);
        }
      });

    } else {



    }
  }

  

  $(document).ready(function() {

    initialize();

    animate.headerWrapper(function fadeInContent () {
      $('#svb-landing-wrapper').addClass('animated fadeIn');
    });
    
  });


})(window, document);