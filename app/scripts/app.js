'use strict';

/**
 * Jquery Sendkeys Extension
 */
(function($){

$.fn.sendkeys = function (x){
  x = x.replace(/([^{])\n/g, '$1{enter}'); // turn line feeds into explicit break insertions, but not if escaped
  return this.each( function(){
    bililiteRange(this).bounds('selection').sendkeys(x).select();
    this.focus();
  });
}; // sendkeys


})(jQuery);


/**
 * Debug Variables
 */
var debo = {},
  root = undefined;

/**
 * @ngdoc overview
 * @name ioEventSyncApp
 * @description
 * # ioEventSyncApp
 *
 * Main module of the application.
 */
angular
  .module('ioEventSyncApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when("/contact", {
        templateUrl: "views/contact.html",
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function ($rootScope) {


    root = $rootScope;
    root.api = "http://localhost:8080";

    debo.socket = root.socket = (function handleSocket () {
      var socket = io.connect(root.api);

      socket.on("connect", function () {
        root.sessionId = socket.io.engine.id;
        console.log("IO Connected", root.sessionId);
      });

      socket.on("command-click", function (clickEvent) {
        console.debug("api asking to click element", clickEvent);
        if (clickEvent.sessionId !== root.sessionId){
          console.debug("sessionID are not equal: ", clickEvent.sessionId, root.sessionId);
          $("[io-click='"+clickEvent.selector+"']").trigger("click", true);
        }
      });

      socket.on("command-keyup", function (keyupEvent) {
        console.debug("api asking to press element", keyupEvent);
        if (keyupEvent.sessionId !== root.sessionId){
          console.debug("sessionID are not equal");
          console.log($("[io-keyup='"+keyupEvent.selector+"']").sendkeys);
          // $("[io-keyup='"+keyupEvent.selector+"']").sendkeys(String.fromCharCode(keyupEvent.which));
          // trigger($.Event("keypress", {which: keyupEvent.which}), true);
        }
      });

      socket.on("command-change", function (changeEvent) {
        console.debug("api asking to change elemtn", changeEvent);
        if (changeEvent.sessionId !== root.sessionId){
          console.debug("sessionId are not equal");
          $("[io-change='" + changeEvent.selector + "']").val(changeEvent.value).trigger('input');
        }
      })

      socket.on("error", function (reason) {
        console.error("Unable to connect to server", reason);
      });

      // $("a").on("click", function(e){
      //   console.debug('emitting clickevent', e);
      //   socket.emit("click", {msg: 'clicking'});
      // });


      return socket;
    }());




  }).directive("ioClick", function($rootScope){
    return {
      link: function(sc, el, at){

        el.on("click", function(e, fromapi){
          console.debug("emitting clickevent", e, at.ioClick);
          if (!fromapi){
            $rootScope.socket.emit("click", {selector: at.ioClick, sessionId: root.sessionId});
          }
        });

      },
    };
  })

  .directive("ioKeyup", function($rootScope){
    return function (sc, el, at) {
      
      el.on("keyup", function (e, fromapi) {
        console.debug('emitting keyup event', e, at.ioKeyup);
        if (!fromapi){
          $rootScope.socket.emit("keyup", {selector: at.ioKeyup, which: e.which, sessionId: root.sessionId});
        }
      });

    }
  })

  .directive("ioChange", function ($rootScope) {
    return function (sc, el, at) {
      el.on("change", function (e, fromapi) {
        console.debug('emitting change event', e, at.ioChange);
        if (!fromapi){
          $rootScope.socket.emit("change", {
            selector: at.ioChange,
            value: el.val(),
            sessionId: root.sessionId,
          });
        }
      });
    };
  })
  ;

