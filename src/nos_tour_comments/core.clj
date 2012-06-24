(ns nos-tour-comments.core
  (:use hiccup.core
        ring.middleware.file
        ring.middleware.file-info
        ring.middleware.gzip
        ring.adapter.jetty))

(def *url* "http://nos.nl/data/livestream/report/comments_0.js")
(def *interval* 15000)
(defn fetch [] (try (slurp *url*) (catch Exception _)))
(def data (agent nil))
(defn updater [_]
  (Thread/sleep *interval*)
  (send-off data updater)
  (fetch))
(when-not *compile-files*
  (send-off data updater))

(defn handler [req]
  (case (:uri req)
        "/feed" {:status 200
                 :headers {"Content-Type" "application/javascript"
                           "Cache-Control" "public, max-age=5"}
                 :body @data}
        nil))

(def app (-> handler (wrap-file "public") (wrap-file-info) wrap-gzip))

(defn -main []
  (let [host (get (System/getenv) "HOST")
        port (Integer/parseInt (get (System/getenv) "PORT" "8080"))]
    (run-jetty #'app {:host host :port port})))
