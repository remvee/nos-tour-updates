(ns nos-tour-comments.core
  (:use hiccup.core
        ring.middleware.file
        ring.middleware.file-info
        ring.middleware.gzip
        ring.adapter.jetty))

(def *interval* 15000)

(defn items-url []
  (let [data (slurp "http://nos.nl/dossier/515430-tour-de-france-2013/tab/730/live/")]
    (if-let [id (last (re-find #"liveblogSettings.*\bid:\s+(\d+).*}" data))]
      (str "http://nos.nl/data/liveblog/report/items_" id ".json"))))

(defn fetch-items []
  (try (if-let [url (items-url)] (slurp url)) (catch Exception _)))

(def data (agent {:status "stale"
                  :items "[]"}))

(defn updater [old]
  (Thread/sleep *interval*)
  (send-off data updater)
  (let [items (fetch-items)]
    (assoc old
      :status (if items "live" "stale")
      :items (or items (:items old)))))

(when-not *compile-files*
  (send-off data updater))

(defn handler [req]
  (case (:uri req)
        "/feed" {:status 200
                 :headers {"Content-Type" "application/javascript"
                           "Cache-Control" "public, max-age=5"}
                 :body (str "{\"status\":\"" (:status @data) "\","
                            "\"items\":" (:items @data) "}")}
        nil))

(def app (-> handler (wrap-file "public") (wrap-file-info) wrap-gzip))

(defn -main []
  (let [host (get (System/getenv) "HOST")
        port (Integer/parseInt (get (System/getenv) "PORT" "8080"))]
    (run-jetty #'app {:host host :port port})))
