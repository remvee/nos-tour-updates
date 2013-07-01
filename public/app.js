var NosTour = {
  light: function(body) {
    return body.match(/<iframe/) ? "" : body;
  },

  full: function(body) {
    var width = $("#comments li").width(),
        iw = body.match(/<iframe[^>]*width="(.*?)"/),
        ih = body.match(/<iframe[^>]*height="(.*?)"/);
    return (iw, ih) ?
      body.replace(/<iframe([^>]*?)(width|height)="[^"]*"([^>]*?)(width|height)="[^"]*"([^>]*?)>/, "<iframe width=\"" + width + "\" height=\"" + Math.round(parseInt(ih[1]) / parseInt(iw[1]) * width) + "\" $1$3$5>") :
      body;
  },

  start: function(pre) {
    $(document).ajaxStart(function(){$("body").addClass("busy");});
    $(document).ajaxComplete(function(){$("body").removeClass("busy");});
    (function(x) {
      return (function(y){return y(y);})(function(y){return x(function(){return y(y)();});});
    })(function(f) {
      return function() {
        setTimeout(f, 15000);
        $.getJSON("/feed?" + new Date().getTime(),
                  function(data) {
                    if (data && data.length > 0) {
                      $("li.busy").remove();
                      $("#date").html(data[0].date_created.substr(0, 11));
                      for (var i = data.length - 1; i >= 0; i--) {
                        var v = data[i];
                        if (! document.getElementById("c_" + v.id)) {
                          var body = pre(v.body);
                          if (body.length) {
                            $("#comments").prepend("<li id='c_" + v.id + "'><strong>" + v.date_created.substr(11,5) + " " + v.title + "</strong><p>" + body + "</p></li>");
                          }
                        }
                      }
                    }
                  });
      };
    })();
  }
};
