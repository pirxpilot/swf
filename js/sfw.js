var sfw = sfw || {};

sfw.yql = (function($) {

  function init(spec) {
    var self = {}, memo = {
      url : 'http://query.yahooapis.com/v1/public/yql',
      env : 'http://www.stom-k.com/yql/seafoodwatch.env'
    };

    $.extend(memo, spec);

    function retrieve(fn) {
      var url = memo.url;
      url += '?q=' + encodeURIComponent(memo.q);
      url += '&env=' + encodeURIComponent(memo.env);
      url += '&format=json&callback=?';

      $.getJSON(url, function(r) {
        fn(r.query.results);
      });
    }

    self.retrieve = retrieve;
    return self;
  }

  return init;
}(jQuery));

sfw.main = (function($) {
  function addRegions($container, $pattern, results) {
    $.each(results.region, function(i, r) {
      var $p = $pattern.clone();
      $('a', $p).text(r.name).attr('id', r.id);
      $container.append($p);
    });
  }

  function init(spec) {
    var yql = sfw.yql({
      q : 'select * from seafoodwatch.region;'
    });
    yql.retrieve(function(r) {
      addRegions(spec.container, spec.pattern, r);
    });
  }

  return init;
}(jQuery));