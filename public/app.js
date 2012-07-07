$(document).ajaxStart(function() { $("body").addClass("busy") })
$(document).ajaxComplete(function() { $("body").removeClass("busy") })

var updater = function() {
  setTimeout(updater, 15000)
  $.getJSON("/feed?" + new Date().getTime(),
            function(data) {
              var html = ''
              if (data.report.length > 0) {
                $("#date").html(data.report[0].published_at.substr(0, 11))
                $.each(data.report, function() {
                  html += '<li><strong>' + this.published_at.substr(11,5) + ' ' + this.title + '</strong><p>' + this.comment + '</p></li>'
                })
                $("#comments").html(html)
              }
            })
}

$(updater)
