(defproject nos-tour-comments "1.0.0-SNAPSHOT"
  :main nos-tour-comments.core
  :description "Simple NOS Tour de France comments only site."
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [ring/ring-core "1.3.0"]
                 [ring/ring-jetty-adapter "1.3.0"]
                 [amalloy/ring-gzip-middleware "0.1.3"]])
