app = angular.module('utilsApp', [])

app.controller 'MakeLinkCtrl', ($scope, $sce, $http)->
  $scope.url = ''
  $scope.anchor = ''
  $scope.fetching = false
  $scope.failed = false

  $scope.description_with_br = ->
    $scope.description?.replace(/\r?\n/g, '<br />') || ''

  $scope.url_without_protocol = ->
    $scope.url?.replace(/^[^:]+?:\/\//, '') || ''

  $scope.code = ->
    $sce.trustAsHtml(
      '<p>\n' +
      "<a href=\"#{$scope.url}\">#{$scope.anchor}</a><br />\n" +
      "#{$scope.description_with_br()}<br />\n" +
      "#{$scope.url_without_protocol()}\n" +
      '</p>\n'
    )

  $scope.Fetch = ->
    $scope.anchor = ''
    $scope.description = ''
    $scope.fetching = true
    $scope.failed = false
    $.ajax
      url: $scope.url
      type: 'GET'
      success: (data)->
        unless data?
          $scope.failed = true
        do (data) ->
          $scope.$apply ->
            $scope.fetching = false
            parser = new DOMParser()
            doc = parser.parseFromString(data.responseText, 'text/html')
            $scope.anchor = doc.title
            for prefix in ['', 'og:', 'twitter:']
              for e in doc.head.getElementsByTagName('meta')
                if e.name == (prefix + 'description') && e.content?
                  $scope.description = e.content
                  break
      error: ->
        $scope.fetching = false
        $scope.failed = true

.filter 'strip_protocol', ->
  (url)->
    url?.replace(/^[^:]+?:\/\//, '')

.filter 'insert_br', ->
  (text)->
    text?.replace(/\r?\n/g, '<br />')
