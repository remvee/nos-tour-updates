$(function() {
  $(document).ajaxStart(function(){$("body").addClass("busy")});
  $(document).ajaxComplete(function(){$("body").removeClass("busy")});

  (function(x) {
    return (function(y){return y(y)})(function(y){return x(function(){return y(y)()})});
  })(function(f) {
    return function() {
      setTimeout(f, 15000);
      $.getJSON("/feed?" + new Date().getTime(),
                function(data) {
                  if (data.report.length > 0) {
                    $("#date").html(data.report[0].published_at.substr(0, 11));
                    $("#comments").html($.map(data.report, function(v) {
                      return "<li><strong>" + v.published_at.substr(11,5) + " " + v.title + "</strong><p>" + v.comment + "</p></li>";
                    }).join(""));
                  }
                });
    }
  })();
});
