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
  function addTips($container, $template, results) {
    $container.empty();
    $.each(results.tip, function(i, t) {
      var $p = $template.clone();
      $('.fish', $p).text(t.fish).addClass('tip_' + t.recommendaton);
      $('.recommendation', $p).text(t.recommendaton);
      $container.append($p);
    });
  }

  function onRegionClick(region_id) {
    var yql = sfw.yql({
      q : 'select * from seafoodwatch.tip where region_id =' + region_id + ';'
    });
    yql.retrieve(function(r) {
      addTips($('#tips ul'), $('#tip_template li'), r);
    });
  }

  function addRegions($container, $template, results) {
    $container.empty();
    $.each(results.region, function(i, r) {
      var $p = $template.clone();
      $('a', $p).text(r.name).attr('id', r.id).click(function() {
        onRegionClick(this.id);
      });
      $container.append($p);
    });
  }

  function init(spec) {
    var yql = sfw.yql({
      q : 'select * from seafoodwatch.region;'
    });
    yql.retrieve(function(r) {
      addRegions(spec.container, spec.template, r);
    });
  }

  return init;
}(jQuery));