/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */
;(function($, window, document, undefined) {

    // Defaults
    var pluginName = "gamertags",
        defaults = {
            propertyName: "value",
            loginModal: $('[data-remodal-id=login]').remodal()
        };

    // Constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;
        this.Gamertags = [];

        this.init();
    }

    Plugin.prototype = {

        /**
         * Initialize the plugin.
         */
        init: function() {
          this.options.loginModal.open();
          $('#gamertags').DataTable({
            "columns": [{
              "data": "gamer"
            }, {
              "data": "gamertag"
            }]
          });
          this.facebookInit();
          this.facebookBindings();
        },

        /**
         * Asynchonously loads Facebook SDK.
         */
        facebookInit: function() {
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
        },

        /**
         * Binds login button to Facebook login.
         */
        facebookBindings: function() {
          $(document).on('closing', '.remodal', this.facebookLogin);
        },

        /**
         * Calls the Facebook login process.
         *
         * Serves as a wrapper around the gamertag methods.
         */
        facebookLogin: function() {
          FB.login(function(response) {
            if (response.authResponse) {

              /**
               * Gamertags container
               */
              var Gamertags = [];

              /**
               * "Hold on to your butts" - https://youtu.be/-W6as8oVcuM
               */
              function _init() {
                getFriendCodes();
              }
              _init();

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
                  $('#gamertags').DataTable().row.add({
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
              // ----------------------------------------------
            } else {
              console.log('Authorization failed.');
            }
          }, {
            scope: 'public_profile'
          });
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
$(document).gamertags();
