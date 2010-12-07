/*!
 * Seafood Watch Mobile
 *
 * Copyright 2010, Damian Krzeminski
 * Licensed under GPL Version 2 license.
 */

/*global localStorage, jQuery */

var sfw = sfw || {};

sfw.yql = (function ($) {

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

      $.getJSON(url, function (r) {
        fn(r.query.results);
      });
    }

    self.retrieve = retrieve;
    return self;
  }

  return init;
}(jQuery));

sfw.main = (function ($) {
  function addTips($container, $template, results, $selector) {
    $.each(results.tip, function (i, t) {
      var $p = $template.clone();
      $('.fish', $p).text(t.fish).addClass('tip_' + t.recommendaton);
      $('.recommendation', $p).text(t.recommendaton);
      $container.append($p);
    });
    $.mobile.pageLoading(true);
    $container.listview('refresh');
    if ($selector) {
      $selector.addClass('ui-btn-active');
    }
    $.fixedToolbars.show(true);
  }

  function onRegionClick(region_id, recommendation, $selector) {
    var $container = $('#tips ul.fish_list'),
      yql = sfw.yql({
        q : 'select * from seafoodwatch.tip where region_id =' + region_id +
          ' and recommendation=\"' + recommendation + '\";'
      });
    localStorage.current_region_id = region_id;
    localStorage.current_recommendation = recommendation;
    $.fixedToolbars.hide(true);
    $container.empty();
    $.mobile.pageLoading();
    yql.retrieve(function (r) {
      addTips($container, $('#tip_template li'), r, $selector);
    });
  }

  function addRegions($container, $template, results) {
    $container.empty();
    $.each(results.region, function (i, r) {
      var $p = $template.clone();
      $('a', $p).text(r.name).attr('id', r.id).click(function () {
        $('#tips h1').text(this.innerText);
        onRegionClick(this.id, localStorage.current_recommendation);
      });
      $container.append($p);
    });
    $.mobile.pageLoading(true);
    $container.listview('refresh');
  }

  function addClicks() {
    $('#tip_selector a').click(function () {
      var recommendation = this.id.slice(7);
      onRegionClick(localStorage.current_region_id, recommendation, $(this));
    });
  }

  function init(spec) {
    localStorage.current_recommendation = 'best';
    addClicks();
    var yql = sfw.yql({
      q : 'select * from seafoodwatch.region;'
    });
    $.mobile.pageLoading();
    yql.retrieve(function (r) {
      addRegions(spec.container, spec.template, r);
    });
  }

  return init;
}(jQuery));

jQuery(function ($) {
  sfw.main({
    container: $('#home ul'),
    template: $('#region_template li')
  });
});
