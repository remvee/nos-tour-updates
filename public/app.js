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
                  if (data.length > 0) {
                    $("#date").html(data[0].date_created.substr(0, 11));
                    $("#comments").html($.map(data, function(v) {
                      if (v.body.match(/<iframe/)) {
                        return "";
                      } else {
                        return "<li><strong>" + v.date_created.substr(11,5) + " " + v.title + "</strong><p>" + v.body + "</p></li>";
                      }
                    }).join(""));
                  }
                });
    };
  })();
});
