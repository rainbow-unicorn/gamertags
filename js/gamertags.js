$(document).ready(function() {
  /**
   * Gaymertag container.
   */
  var Gamertags = [];
  var loginModal = $('[data-remodal-id=login]').remodal();

  loginModal.open();

  $('#gaymertags').DataTable({
    "columns": [{
      "data": "gamer"
    }, {
      "data": "gamertag"
    }]
  });

  /**
   * Initializes Facebook login on modal close.
   */
  $(document).on('closing', '.remodal', function(e) {
    myFacebookLogin();
  });

  /**
   * Calls the Facebook login process.
   */
  function myFacebookLogin() {
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
   * Extracts gamertags into the Gamertags array.
   */
  function extractGamertags(message) {
    var html = $.parseHTML(message);
    $.each(html, function(i, el) {
      if (el.childNodes.length != 'undefined' && el.childNodes.length >= 2) {
        var props = el.textContent.split(/\.+/);
        for (var c = 0; c < props.length; c++) {
          props[c] = props[c].trim();
        }
        var tag = [];
        tag['gamer'] = props[0];
        tag['gamertag'] = props[1];
        Gamertags.push(tag);
      }
    });
  }

  /**
   * Renders the DataTable object.
   */
  function renderList(gamertags) {
    for (var i = 0; i < gamertags.length; i++) {
      $('#gaymertags').DataTable().row.add({
        "gamer": gamertags[i]['gamer'],
        "gamertag": gamertags[i]['gamertag'],
      }).draw();
    }
  }


  function gamertagFactory(gamer, gamertag) {
    return {
      "gamer": gamer,
      "gamertag": gamertag
    };
  }
});
