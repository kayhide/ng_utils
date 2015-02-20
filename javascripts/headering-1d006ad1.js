(function() {
  angular.module('utilsApp').controller('HeaderingController', function($scope, $sce) {
    var name, _i, _len, _ref;
    $scope.article = "\n\n関連サイト";
    $scope.copied = false;
    $scope.with_br = function(text) {
      return (text != null ? text.replace(/\r?\n/g, '<br />') : void 0) || '';
    };
    $scope.regularize_break_line = function(text) {
      return text != null ? text.replace(/\r?\n/g, '\n') : void 0;
    };
    $scope.process_article = function() {
      var chunk, chunks;
      chunks = (function() {
        var _i, _len, _ref, _results;
        _ref = $scope.regularize_break_line($scope.article).split(/\n\n+/);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          chunk = _ref[_i];
          if (chunk.match(/\n/)) {
            _results.push(chunk.replace(/^(.*)\n([^$]*)/, '<h3>\$1</h3>\n<p>\$2</p>'));
          } else if (chunk.match(/./)) {
            _results.push("<h3>" + chunk + "</h3>");
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      })();
      return chunks.join('\n');
    };
    $scope.code = function() {
      return $sce.trustAsHtml($scope.process_article());
    };
    _ref = ['article'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      $scope.$watch(name, function() {
        return $scope.copied = false;
      });
    }
    return $scope.GetCodeToCopy = function() {
      return $scope.code().$$unwrapTrustedValue();
    };
  });

}).call(this);
