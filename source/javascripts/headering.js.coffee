angular.module('utilsApp')

.controller 'HeaderingController', ($scope, $sce)->
  $scope.article = "\n\n関連サイト"
  $scope.copied = false

  $scope.with_br = (text)->
    text?.replace(/\r?\n/g, '<br />') || ''

  $scope.regularize_break_line = (text)->
    text?.replace(/\r?\n/g, '\n')

  $scope.process_article = ->
    chunks = for chunk in $scope.regularize_break_line($scope.article).split(/\n\n+/)
      if chunk.match(/\n/)
        chunk.replace(/^(.*)\n([^$]*)/, '<h3>\$1</h3>\n<p>\$2</p>')
      else if chunk.match(/./)
        "<h3>#{chunk}</h3>"
    chunks.join('\n')

  $scope.code = ->
    $sce.trustAsHtml($scope.process_article())

  for name in ['article']
    $scope.$watch name, ->
      $scope.copied = false

  $scope.GetCodeToCopy = ->
    $scope.code().$$unwrapTrustedValue()
