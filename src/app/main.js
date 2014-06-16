(function (window, document) {

  'use strict';

  var invitee, templateInvitee, templateLanding, templateThanks, attendeeCount, userAttendees;

  var ANIM_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var TRANSITION_END = 'transitionend oTransitionEnd';
  var API_ENDPOINT = 'http://localhost:9000';

  var $ = window.jQuery;
  var Handlebars = window.Handlebars;

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
        url: API_ENDPOINT + '/v1/visitors/' + inviteeId,
        type: 'GET',
        crossDomain: true,
        success: function (response) {
          invitee = response.visitor;
          attendeeCount = response.attendeeCount;
        },
        error: function (xhr, status) {
          console.log('error');
          console.log(status);
        }
      });

    }

    OAuth.initialize('WQa8zzbB5RaB2I82c8eCjDW9yXM');

    window.svb = {
      submitForm: function (attendees) {
        userAttendees = attendees;
        $('#submitBtn').click();
      }
    };

    templateInvitee = Handlebars.compile($("#tmpl-svb-invite").html());
    templateLanding = $("#tmpl-svb-landing").html();
    templateThanks = $("#tmpl-svb-thanks").html();

  }

  initialize();
  

  $(document).ready(function() {


    animate.headerWrapper(fadeInContent);

    function fadeInContent () {

      var $content;

      if (invitee && invitee.id) {
        invitee.firstNameLower = invitee.firstName.toLowerCase();
        $content = $(templateInvitee(invitee));
        // poll attendees every 5 secs
        window.setInterval(refreshAttendeeCount, 5000);
      } else {
        $content = $(templateLanding);
      }

      $content.appendTo($('.svb-content')).addClass('animated fadeIn');
      $('.attendeeCount').html(attendeeCount);
      $('.attendeeCount').html(attendeeCount);
      if (invitee && invitee.email) {
        $('#svb-invite-wrapper #svb-input-email').val(invitee.email);
      }
      $('#attendeeForm').submit(saveAttendees);

      $('#fbButton').click(function (e) {
        e.preventDefault();
        OAuth.popup('facebook', {authorize:{display:'popup'}}, function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          result.get('/me').done(function(res) {
            if (res && res.email) {
              $('#svb-input-email').val(res.email);
            }
          });
        });
      });

    }

    function refreshAttendeeCount () {
      $.ajax({
        url: API_ENDPOINT + '/v1/events/' + invitee.eventId + '/visitors/count',
        type: 'GET',
        crossDomain: true,
        success: function (response) {
          if (attendeeCount === response.sum) return;
          attendeeCount = response.sum;
          $('.attendeeCount')
            .addClass('animated pulse')
            .one(ANIM_END, function () {
              $(this).removeClass('animated pulse');
            }).html(attendeeCount);
        },
        error: function (xhr, status) {
          console.log(status);
        }
      });
    }

    function saveAttendees (e) {
      
      e.preventDefault();

      var email = $('#svb-invite-wrapper #svb-input-email').val();

      // old browser fallback
      if (!email) return alert('Hey Du mit diesem alten Browser. Update den ruhig mal und bitte füll auch das E-Mail Feld aus');

      var data = {
        email: email,
        attending: userAttendees
      };

      $.ajax({
        url: API_ENDPOINT + '/v1/events/' + invitee.eventId + '/visitors/' + invitee.id,
        type: 'PUT',
        data: data,
        crossDomain: true,
        success: function (response) {
          $('#attendeeWrapper').html(templateThanks);
        },
        error: function (xhr, status) {
          alert('Kaputt! Bitte versuch\'s nachher noch mal oder update Deinen Browser.');
        }
      });
    }

    
  });


})(window, document);