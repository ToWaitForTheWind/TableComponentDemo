module.exports = {
  devServer: {
    proxy: {
      '/resource': {
        target: 'https://exam.inspc.org.cn',
        ws: false,
        changeOrigin: true
      }
    }
  }
}