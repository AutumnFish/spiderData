// 导入模块
var Crawler = require('crawler')
// 获取数据的逻辑

// 获取图片的逻辑

module.exports = {
  getData(url, func) {
    // 实例化爬虫对象
    var c = new Crawler({
      // 最大连接数
      maxConnections: 1,
      rateLimit: 1000,
      // This will be called for each crawled page
      callback: function(error, res, done) {
        if (error) {
          console.log(error)
        } else {
          var $ = res.$
          func($, url)
        }
        done()
      }
    })
    // 请求地址
    c.queue(url)
  },
  getDataP(url) {
    return new Promise((resolve, reject) => {
      // 实例化爬虫对象
      var c = new Crawler({
        // 最大连接数
        maxConnections: 1,
        rateLimit: 1000,
        // This will be called for each crawled page
        callback: function(error, res, done) {
          if (error) {
            console.log(error)
          } else {
            var $ = res.$
            // func($, url)
            resolve($)
          }
          done()
        }
      })
      // 请求地址
      c.queue(url)
    })
  },
  getFileP(url) {
    return new Promise((resolve, reject) => {
      // 实例化爬虫对象
      var c = new Crawler({
        jQuery: false,
        // 最大连接数
        // maxConnections: 1,
        // rateLimit: 1000,
        // This will be called for each crawled page
        callback: function(error, res, done) {
          if (error) {
            console.log(error)
          } else {
            // var $ = res.$
            // func($, url)
            resolve(res.body)
          }
          done()
        }
      })
      // 请求地址
      c.queue(url)
    })
  },
  getFile(url, func) {
    var c = new Crawler({
      encoding: null,
      jQuery: false, // set false to suppress warning message.
      callback: function(err, res, done) {
        if (err) {
          console.error(err.stack)
        } else {
          // 传入数据
          func(res.body)
        }

        done()
      }
    })
    c.queue(url)
  },
  // 去除多余的换行和缩进
  replaceSpace(str) {
    return str.replace(/\r\n/g, '')
  }
}
