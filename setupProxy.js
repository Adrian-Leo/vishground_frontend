const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    // Specify the path that triggers the proxy
    createProxyMiddleware({
      target: 'http://localhost:3333', // Replace with your backend server URL
      changeOrigin: true
    })
  )
}
