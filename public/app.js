var NosTour = {
  light: function(body) {
    return body.match(/<iframe/) ? "" : body;
  },

  full: function(body) {
    var width = $("#comments li").width(),
        iw = body.match(/<iframe[^>]*width="(.*?)"/),
        ih = body.match(/<iframe[^>]*height="(.*?)"/);
    return (iw, ih) ?
      body.replace(/<iframe([^>]*?)(width|height)="[^"]*"([^>]*?)(width|height)="[^"]*"([^>]*?)>/,
                   "<iframe width=\"" + width + "\" height=\"" + Math.round(parseInt(ih[1]) /
                                                                            parseInt(iw[1]) * width) + "\" $1$3$5>") :
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
                    $("li.loading").remove();

                    if (data && data.items && data.items.length > 0) {
                      $("#date").html(data.items[0].date_created.substr(0, 11));

                      $("li.item").addClass("stale");
                      for (var i = data.items.length - 1; i >= 0; i--) {
                        var item = data.items[i];
                        var el = document.getElementById("c_" + item.id);
                        if (el) {
                          $(el).removeClass("stale");
                        } else {
                          var body = pre(item.body), 
                              title = item.date_created.substr(11,5) + " " + item.title;
                          if (body.length) {
                            $("#comments").prepend("<li class='item' id='c_" + item.id + "'>" +
                                                   "<strong>" + title + "</strong>" +
                                                   "<p>" + body + "</p></li>");
                          }
                        }
                      }
                      $("li.item.stale").remove();
                    }

                    $(document.body).toggleClass("live", data && data.status == "live");
                    $(document.body).toggleClass("stale", !(data && data.status == "live"));
                  });
      };
    })();
  }
};
