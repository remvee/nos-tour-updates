(ns nos-tour-comments.core
  (:use hiccup.core
        ring.middleware.file
        ring.middleware.file-info
        ring.adapter.jetty))

(def *url* "http://nos.nl/data/livestream/report/comments_0.js")
(def *interval* 5000)
(defn fetch [] (try (slurp *url*) (catch Exception _)))
(def data (agent (fetch)))
(defn updater [_]
  (Thread/sleep *interval*)
  (send-off data updater)
  (fetch))
(send-off data updater)

(defn handler [req]
  (case (:uri req)
        "/feed" {:status 200
                 :headers {"Content-Type" "application/javascript"}
                 :body @data}
        "/" {:status 301
             :headers {"Location" "/app.html"}}
        nil))

(def app (-> handler (wrap-file "public") (wrap-file-info)))

(defn -main []
  (let [port (Integer/parseInt (get (System/getenv) "PORT" "8080"))]
    (run-jetty #'app {:port port})))
