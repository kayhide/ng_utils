(function() {
  angular.module('utilsApp').controller('MakeLinkController', function($scope, $sce, $http) {
    var name, _i, _len, _ref;
    $scope.url = '';
    $scope.anchor = '';
    $scope.fetching = false;
    $scope.failed = false;
    $scope.copied = false;
    $scope.description_with_br = function() {
      var _ref;
      return ((_ref = $scope.description) != null ? _ref.replace(/\r?\n/g, '<br />') : void 0) || '';
    };
    $scope.url_without_protocol = function() {
      var _ref;
      return ((_ref = $scope.url) != null ? _ref.replace(/^[^:]+?:\/\//, '') : void 0) || '';
    };
    $scope.code = function() {
      return $sce.trustAsHtml('<p>\n' + ("<a href=\"" + $scope.url + "\">" + $scope.anchor + "</a><br />\n") + ("" + ($scope.description_with_br()) + "<br />\n") + ("" + ($scope.url_without_protocol()) + "\n") + '</p>\n');
    };
    _ref = ['url', 'anchor', 'description'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      $scope.$watch(name, function() {
        return $scope.copied = false;
      });
    }
    $scope.GetCodeToCopy = function() {
      return $scope.code().$$unwrapTrustedValue();
    };
    return $scope.Fetch = function() {
      $scope.anchor = '';
      $scope.description = '';
      $scope.fetching = true;
      $scope.failed = false;
      return $.ajax({
        url: $scope.url,
        type: 'GET',
        success: function(data) {
          if (data == null) {
            $scope.failed = true;
          }
          return (function(data) {
            return $scope.$apply(function() {
              var doc, e, parser, prefix, _j, _k, _len1, _len2, _ref1, _ref2, _results;
              $scope.fetching = false;
              parser = new DOMParser();
              doc = parser.parseFromString(data.responseText, 'text/html');
              $scope.anchor = doc.title;
              _ref1 = ['', 'og:', 'twitter:'];
              _results = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                prefix = _ref1[_j];
                _ref2 = doc.head.getElementsByTagName('meta');
                for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                  e = _ref2[_k];
                  if (e.name === (prefix + 'description') && e.content.length > 0) {
                    $scope.description = e.content;
                    break;
                  }
                }
                if ($scope.description.length > 0) {
                  break;
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            });
          })(data);
        },
        error: function() {
          $scope.fetching = false;
          return $scope.failed = true;
        }
      });
    };
  });

}).call(this);
