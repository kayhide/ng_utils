(function() {
  var app;

  app = angular.module('utilsApp', []);

  app.controller('MakeLinkCtrl', function($scope, $sce) {
    $scope.url = '';
    $scope.anchor = '';
    $scope.description_with_br = function() {
      var _ref;
      return ((_ref = $scope.description) != null ? _ref.replace(/\r?\n/g, '<br />') : void 0) || '';
    };
    $scope.url_without_protocol = function() {
      var _ref;
      return ((_ref = $scope.url) != null ? _ref.replace(/^[^:]+?:\/\//, '') : void 0) || '';
    };
    $scope.code_ = function() {
      return '3';
    };
    return $scope.code = function() {
      return $sce.trustAsHtml('<p>\n' + ("<a href=\"" + $scope.url + "\">" + $scope.anchor + "</a><br />\n") + ("" + ($scope.description_with_br()) + "<br />\n") + ("" + ($scope.url_without_protocol()) + "\n") + '</p>\n');
    };
  }).filter('strip_protocol', function() {
    return function(url) {
      return url != null ? url.replace(/^[^:]+?:\/\//, '') : void 0;
    };
  }).filter('insert_br', function() {
    return function(text) {
      return text != null ? text.replace(/\r?\n/g, '<br />') : void 0;
    };
  });

}).call(this);
