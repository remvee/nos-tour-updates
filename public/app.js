var updater = function() {
  $.getJSON("/feed",
            function(data) {
              setTimeout(updater, 15000)

              $("#date").html(data.report[0].published_at.substr(0, 11))
              var html = ''
              $.each(data.report, function() {
                html += '<li><strong>' + this.published_at.substr(11,5) + ' ' + this.title + '</strong><p>' + this.comment + '</p></li>'
              })
              $("#comments").html(html)
            })
}
updater()
