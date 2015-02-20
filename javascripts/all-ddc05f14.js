(function() {
  angular.module('utilsApp', ['ngClipboard']);

}).call(this);
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
/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */


jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                    
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);
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


