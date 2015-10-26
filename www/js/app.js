// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.utils', 'starter.controllers'])

  .run(function ($ionicPlatform, $http, $window, $areaInit) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }


    });

    $areaInit.initArea($http, $window);
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.areas', {
        url: '/areas',
        views: {
          'menuContent': {
            templateUrl: 'templates/areas.html',
            controller: 'AreaListsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/areas/:area',
        views: {
          'menuContent': {
            templateUrl: 'templates/area.html',
            controller: 'AreaListCtrl'
          }
        }
      })
      .state('app.topos', {
        url: '/topo/:topo',
        views: {
          'menuContent': {
            templateUrl: 'templates/topo.html',
            controller: 'TopoCtrl'
          }
        }
      })
      .state('app.route', {
        url: '/route/:route',
        views: {
          'menuContent': {
            templateUrl: 'templates/route.html',
            controller: 'RouteCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/areas');
  })
  .directive("linearChart", function ($window) {
    return {
      restrict: "EA",
      template: "<svg width='850' height='200'></svg>",
      link: function (scope, elem, attrs) {

        var salesDataToPlot = scope[attrs.chartData];
        var padding = 20;
        var pathClass = "path";
        var xScale, yScale, xAxisGen, yAxisGen, lineFun;

        var d3 = $window.d3;
        var rawSvg = elem.find("svg")[0];
        var svg = d3.select(rawSvg);

        function setChartParameters() {
          xScale = d3.scale.linear()
            .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length - 1].hour])
            .range([padding + 5, rawSvg.clientWidth - padding]);

          yScale = d3.scale.linear()
            .domain([0, d3.max(salesDataToPlot, function (d) {
              return d.sales;
            })])
            .range([rawSvg.clientHeight - padding, 0]);

          xAxisGen = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(salesDataToPlot.length - 1);

          yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

          lineFun = d3.svg.line()
            .x(function (d) {
              return xScale(d.hour);
            })
            .y(function (d) {
              return yScale(d.sales);
            })
            .interpolate("basis");
        }

        function drawLineChart() {

          setChartParameters();

          svg.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,180)")
            .call(xAxisGen);

          svg.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(20,0)")
            .call(yAxisGen);

          svg.append("svg:path")
            .attr({
              d: lineFun(salesDataToPlot),
              "stroke": "blue",
              "stroke-width": 2,
              "fill": "none",
              "class": pathClass
            });
        }

        drawLineChart();
      }
    };
  })

  .factory('d3Service', ['$document', '$q', '$rootScope',
    function ($document, $q, $rootScope) {
      var d = $q.defer();

      function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function () {
          d.resolve(window.d3);
        });
      }

      // Create a script tag with d3 as the source
      // and call our onScriptLoad callback when it
      // has been loaded
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = 'http://d3js.org/d3.v3.min.js';
      scriptTag.onreadystatechange = function () {
        if (this.readyState == 'complete') onScriptLoad();
      }
      scriptTag.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      return {
        d3: function () {
          console.log("d3 loaded");
          return d.promise;
        }
      };
    }])

  .directive("svgRoute", ['d3Service', function (d3Service) {

    return {
      restrict: "EA",
      template: "<div id='canvas-container' style='position: absolute; top: 0;'></div>",
      link: function (scope, elem, attrs) {
        d3Service.d3().then(function (d3) {
          console.log("svgRoute called");
          var line = scope[attrs.linesData];
          console.log(JSON.stringify(line));
          //var target = angular.element('#route-img');
          var image = d3.select('#route-img');


          while (!image) {
            setTimeout(function () {
              image = d3.select('#route-img');
            }, 500);

          }

          //todo:

          //// Browser onresize event
          //window.onresize = function() {
          //  var imgWidth = image.node().width;
          //  var imgHeight = image.node().height;
          //  drawLine(null, line, imgWidth, imgWidth);
          //};

          console.log("image[" + image + "]");
          image.node().onload = function () {
            console.log('image loaded');
            var imgWidth = image.node().width;
            var imgHeight = image.node().height;
            drawLine(null, line, imgWidth, imgWidth);
          };


          function drawLine(containerId, lineObject, imageWidth, imageHeight) {
            var plotWindth = lineObject.plotWindth;
            var plotHeight = lineObject.plotHeight;
            var points = lineObject.points;

            var ratio = getRatio(imageWidth, plotWindth);

            if (ratio !== 1) {
              for (var i = 0; i < points.length; i++) {
                points[i].x = points[i].x * ratio;
                points[i].y = points[i].y * ratio;
              }
            }

            var canvasContainer = d3.select("#canvas-container");

            var canvas = canvasContainer.append("svg:svg")
              .attr("width", imageWidth)
              .attr("height", imageHeight);


            var d3line2 = d3.svg.line()
              .x(function (d) {
                return d.x;
              })
              .y(function (d) {
                return d.y;
              })
//            .interpolate("linear");
              .interpolate("basis");


            canvas.append("svg:path")
              .attr("d", d3line2(points))
              .style("stroke-width", 2)
              .style("stroke", "#ff0000")
              .style("fill", "none");


          }

          function getRatio(imageWidth, plotWindth) {
            if (imageWidth !== plotWindth) {
              return imageWidth / plotWindth;
            }
            return 1;
          }
        });
      }
    }

  }]);
