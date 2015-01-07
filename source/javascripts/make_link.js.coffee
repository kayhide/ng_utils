app = angular.module('utilsApp', [])

app.controller 'MakeLinkCtrl', ($scope, $sce)->
  $scope.url = ''
  $scope.anchor = ''

  $scope.description_with_br = ->
    $scope.description?.replace(/\r?\n/g, '<br />') || ''

  $scope.url_without_protocol = ->
    $scope.url?.replace(/^[^:]+?:\/\//, '') || ''

  $scope.code_ = ->
    '3'
  $scope.code = ->
    $sce.trustAsHtml(
      '<p>\n' +
      "<a href=\"#{$scope.url}\">#{$scope.anchor}</a><br />\n" +
      "#{$scope.description_with_br()}<br />\n" +
      "#{$scope.url_without_protocol()}\n" +
      '</p>\n'
    )

.filter 'strip_protocol', ->
  (url)->
    url?.replace(/^[^:]+?:\/\//, '')

.filter 'insert_br', ->
  (text)->
    text?.replace(/\r?\n/g, '<br />')
