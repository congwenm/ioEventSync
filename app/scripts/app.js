'use strict';

/**
 * @ngdoc overview
 * @name ioEventSyncApp
 * @description
 * # ioEventSyncApp
 *
 * Main module of the application.
 */
var debo = {},
  root = undefined;
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

      socket.on("clickElement", function (data) {
        console.debug("api asking to click element", data);
      });

      socket.on("error", function (reason) {
        console.error("Unable to connect to server", reason);
      });

      $("a").on("click", function(e){
        console.debug('emitting clickevent', e);
        socket.emit("click", {msg: 'clicking'});
      });


      return socket;
    }());




  });

