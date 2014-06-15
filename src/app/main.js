(function (window, document) {

  'use strict';

  var ANIM_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

  var $ = window.jQuery;

  var t = new window.Trianglify();
  var backgroundCanvas = $('.svb-background-canvas');
  var pattern = t.generate(backgroundCanvas.width(), backgroundCanvas.height());
  backgroundCanvas.css('background-image', pattern.dataUrl);

  var animate = {
    headerWrapper: function () {
      var headerWrapper = $('#svb-header-wrapper');
      headerWrapper.addClass('animated fadeIn');
      headerWrapper
        .one(ANIM_END, function move () {
          $(this).addClass('final-position');
      });
    }
  };

  $(document).ready(function() {

    animate.headerWrapper();

    $('#DateCountdown').TimeCircles({
      'animation': 'smooth',
      'bg_width': 0.2,
      'fg_width': 0.016666666666666666,
      'circle_bg_color': 'transparent',
      'count_past_zero': false,
      'time': {
          'Days': {
              'text': 'Tage',
              'color': '#1C0968',
              'show': true
          },
          'Hours': {
              'text': 'Stunden',
              'color': '#1C0968',
              'show': true
          },
          'Minutes': {
              'text': 'Minuten',
              'color': '#1C0968',
              'show': true
          },
          'Seconds': {
              'text': 'Sekunden',
              'color': '#1C0968',
              'show': true
          }
      }
  });
    
  });

  $(window).resize(function() {
    $('#DateCountdown').TimeCircles().rebuild();
  });

})(window, document);