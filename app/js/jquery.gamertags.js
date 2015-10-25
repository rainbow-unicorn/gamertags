$(document).ready(function() {
  /**
   * Gaymertag container.
   */
  var Gamertags = [],
      loginModal = $('[data-remodal-id=login]').remodal(),
      status = '';

  loginModal.open();

  $('#gaymertags').DataTable({
    "columns": [{
      "data": "gamer"
    }, {
      "data": "gamertag"
    }]
  });

  function _init() {
    facebookInit();
    facebookBindings();
  }
  _init();

  /**
   * Asynchronously initializes Facebook SDK.
   */
  function facebookInit() {
    $.ajaxSetup({
      cache: true
    });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function() {
      FB.init({
        appId     : '399385496935911',
        version   : 'v2.4',
        xfbml     : true
      });
    });
  }

  /**
   * Binds login button to Facebook login.
   */
  function facebookBindings() {
    $(document).on('closing', '.remodal', facebookLogin);
  }

  /**
   * Calls the Facebook login process.
   */
  function facebookLogin() {
    FB.login(function(response) {
      if (response.authResponse) {
        getFriendCodes();
      } else {
        console.log('Authorization failed.');
      }
    }, {
      scope: 'public_profile'
    });
  }

  /**
   * Retrieves the gamertags document.
   */
  function getFriendCodes() {
    FB.api(
      '/561961807201477', // 3DS friendcodes
    function(response) {
      if (!response || response.error) {
        alert('Something went wrong.')
      } else {
        extractGamertags(response.message);
        renderList(Gamertags);
      }
    });
  }

  /**
   * Extracts gamertags from document.
   *
   * @var {object}
   */
  function extractGamertags(message) {
    var html = $.parseHTML(message);
    $.each(html, function(i, el) {
      if (el.childNodes.length != 'undefined' && el.childNodes.length >= 2) {
        var props = el.textContent.split(/[.]+/);
        var tag = [];
        for (var c = 0; c < props.length; c++) {
          if (props[c].match(/\d{4}-\d{4}-\d{4}/)) {
            tag['gamertag'] = props[c];
          } else if (props[c].match(/[\w()]+/)) {
            tag['gamer'] = props[c];
          } else {
            return false;
          }
        }
        Gamertags.push(tag);
      }
    });
  }

  /**
   * Renders the DataTable object.
   *
   * @var {array}
   */
  function renderList(gamertags) {
    for (var i = 0; i < gamertags.length; i++) {
      $('#gaymertags').DataTable().row.add({
        "gamer": gamertags[i]['gamer'],
        "gamertag": gamertags[i]['gamertag'],
      }).draw();
    }
  }

  /**
   * Builds gamertag objects.
   *
   * @var {string}
   * @var {string}
   * @returns {object}
   */
  function gamertagFactory(gamer, gamertag) {
    return {
      "gamer": gamer,
      "gamertag": gamertag
    };
  }
});
