// 导入模块
var Crawler = require("crawler");
// 导入文件模块
let fs = require("fs");
// 导入路径模块
let path = require("path");

// 获取数据的逻辑
function getData(url, func) {
  // 实例化爬虫对象
  var c = new Crawler({
    // 最大连接数
    maxConnections: 1,
    rateLimit: 1000,
    // This will be called for each crawled page
    callback: function(error, res, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = res.$;
        func($, url);
      }
      done();
    }
  });

  // 请求地址
  c.queue(url);
}

// 获取图片的逻辑
function getFile(url, func) {
  var c = new Crawler({
    encoding: null,
    jQuery: false, // set false to suppress warning message.
    callback: function(err, res, done) {
      if (err) {
        console.error(err.stack);
      } else {
        // 传入数据
        func(res.body);
      }

      done();
    }
  });
  c.queue(url);
}

// 获取lol的数据 从多玩获取
getData("http://lol.duowan.com/", $ => {
  // 列表数据
  let heroArr = [];
  // 详细数据
  let heroDetails = [];
  // 计数器
  let num = 0;
  $("#champion_list li").each((i, e) => {
    // 获取id
    let id = path.basename(
      $(e)
        .find("a")
        .attr("href"),
      "/"
    );
    // 名字
    let name = $(e)
      .find("em")
      .text();
    // 图片地址
    let iconUrl = $(e)
      .find("img")
      .attr("data-src");
    // 英雄定位
    let tags = $(e).attr('class');
    // 英雄外号
    let title = $(e).find('img').attr('title');
    // 保存数据
    heroArr.push({
      id,
      tags,
      title,
      name,
      iconUrl
    });
  });
  // console.log(heroArr);
  // 获取详细信息
  fs.writeFileSync("./data/lol_duowan.json", JSON.stringify(heroArr));
  // 详细
  // 循环
  heroArr.forEach(v => {
    // 获取详细信息
    getData(`http://lol.duowan.com/${v.id}/`, ($, url) => {
      // 获取id
      let id = path.basename(url, "/");
      // 获取背景图
      let bgs = [];
      $(".ui-slide__panel").each((i, e) => {
        // 背景图
        bgs.push(
          $(e)
            .find("img")
            .attr("src")
        );
      });
      // 获取背景缩略图
      let bgs_thumbnail = [];
      $(".hero-skin__item").each((i, e) => {
        bgs_thumbnail.push(
          $(e)
            .find("img")
            .attr("src")
        );
      });
      // 获取姓名
      let name = $(".hero-name").text();
      // 获取外号
      let title = $(".hero-title").text();
      // 获取定位
      let tags = [];
      $(".hero-tag").each((i, e) => {
        tags.push($(e).text());
      });
      // 获取数值
      let life = $($(".hero-ability").find("i")[0])
        .attr("style")
        .replace("width:", "")
        .replace("%", "");
      let physical = $($(".hero-ability").find("i")[1])
        .attr("style")
        .replace("width:", "")
        .replace("%", "");
      let magic = $($(".hero-ability").find("i")[2])
        .attr("style")
        .replace("width:", "")
        .replace("%", "");
      let difficulty = $($(".hero-ability").find("i")[3])
        .attr("style")
        .replace("width:", "")
        .replace("%", "");
      // 背景故事
      let story = $(".hero-popup__txt").text().replace(/\r\n/g,'').trim();

      // console.log(obj);
      heroDetails.push({
        id,
        title,
        name,
        bgs,
        tags,
        bgs_thumbnail,
        Ability: {
          life,
          physical,
          magic,
          difficulty
        },
        story
      });
      // 判断个数
      num++;
      // 如果全部搞定 打印
      if (num == heroArr.length) {
        // console.log('搞定啦');
        fs.writeFileSync(
          "./data/lol_details_duowan.json",
          JSON.stringify(heroDetails)
        );
      }
    });
  });
});
