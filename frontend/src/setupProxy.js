const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/atcoder/resources/problems.json", {
      target: "https://kenkoooo.com",
      changeOrigin: true,

    })
  );
  app.use(
    proxy("/atcoder/atcoder-api/", {
      target: "https://kenkoooo.com",
      changeOrigin: true,
    })
  );
  app.use(
    proxy("/internal-api", {
      target: "https://kenkoooo.com",
      changeOrigin: true,
      pathRewrite: {
        "^/internal-api": "/atcoder/internal-api"
      }
    })
  );
  app.use(
    proxy("/api", {
      target: process.env.BACKEND_API_URL,
      changeOrigin: true,
    })
  );
};
