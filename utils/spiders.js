// 导入tools
const tools = require('./tools')
// 导入文件模块
let fs = require('fs')
// 导入路径模块
let path = require('path')
// 导入querystring模块
const qs = require('querystring')

// 获取lol的数据 从多玩获取

module.exports = {
  // 获取lol的数据
  getLolData() {
    console.log('开始获取')
    tools.getData('http://lol.duowan.com/', $ => {
      // 列表数据
      let heroArr = []
      // 详细数据
      let heroDetails = []
      // 计数器
      let num = 0
      $('#champion_list li').each((i, e) => {
        // 获取id
        let id = path.basename(
          $(e)
            .find('a')
            .attr('href'),
          '/'
        )
        // 名字
        let name = $(e)
          .find('em')
          .text()
        // 图片地址
        let iconUrl = $(e)
          .find('img')
          .attr('data-src')
        // 英雄定位
        let tags = $(e).attr('class')
        // 英雄外号
        let title = $(e)
          .find('img')
          .attr('title')
        // 保存数据
        heroArr.push({
          id,
          tags,
          title,
          name,
          iconUrl
        })
      })
      console.log('列表数据获取完毕')
      // 获取详细信息
      fs.writeFileSync('./data/lol_duowan.json', JSON.stringify(heroArr))
      // 详细
      // 循环
      heroArr.forEach(v => {
        // 获取详细信息
        tools.getData(`http://lol.duowan.com/${v.id}/`, ($, url) => {
          // 获取id
          let id = path.basename(url, '/')
          // 获取背景图
          let bgs = []
          $('.ui-slide__panel').each((i, e) => {
            // 背景图
            bgs.push(
              $(e)
                .find('img')
                .attr('src')
            )
          })
          // 获取背景缩略图
          let bgs_thumbnail = []
          $('.hero-skin__item').each((i, e) => {
            bgs_thumbnail.push(
              $(e)
                .find('img')
                .attr('src')
            )
          })
          // 获取姓名
          let name = $('.hero-name').text()
          // 获取外号
          let title = $('.hero-title').text()
          // 获取定位
          let tags = []
          $('.hero-tag').each((i, e) => {
            tags.push($(e).text())
          })
          // 获取数值
          let life = $($('.hero-ability').find('i')[0])
            .attr('style')
            .replace('width:', '')
            .replace('%', '')
          let physical = $($('.hero-ability').find('i')[1])
            .attr('style')
            .replace('width:', '')
            .replace('%', '')
          let magic = $($('.hero-ability').find('i')[2])
            .attr('style')
            .replace('width:', '')
            .replace('%', '')
          let difficulty = $($('.hero-ability').find('i')[3])
            .attr('style')
            .replace('width:', '')
            .replace('%', '')
          // 背景故事
          let story = $('.hero-popup__txt')
            .text()
            .replace(/\r\n/g, '')
            .trim()

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
          })
          // 判断个数
          num++
          // 如果全部搞定 打印
          if (num == heroArr.length) {
            console.log('详情数据获取完毕')
            fs.writeFileSync(
              './data/lol_details_duowan.json',
              JSON.stringify(heroDetails)
            )
          }
        })
      })
    })
  },
  // 获取笑话的数据
  getJokes() {
    // 定义空数组
    let jokeArr = []
    let num = 1
    for (let index = 1; index <= 50; index++) {
      tools.getData(`https://www.pengfue.com/xiaohua_${index}.html`, $ => {
        // console.log($(".content-img").length);
        $('.content-img').each((i, e) => {
          // console.log($(e).text().replace(/\n|\t/g, ""));
          jokeArr.push(
            $(e)
              .text()
              .replace(/\r|\n|\t/g, '')
              .trim()
          )
        })
        num++
        if (num == 50) {
          // console.log(path.join(__dirname,'../data','jokes.json'));
          // console.log(jokeArr);
          fs.writeFile(
            path.join(__dirname, '../data', 'jokes.json'),
            JSON.stringify(jokeArr),
            () => {
              console.log('finish')
            }
          )
          // console.log(jokeArr.length)
        }
      })
    }
  },

  // 获取克鲁赛德战记的英雄数据
  async getCq() {
    // 数据
    let cqData = []
    function formatData($,type) {
      $('#hero_list')
        .find('tr')
        .each((i, e) => {
          if ($(e).find('td').length == 0) return
          // 名字
          const heroName = $(e)
            .find('td>a')
            .attr('title')
          if (heroName == '战斗机器人 特-6') return
          // 头像
          const heroIcon = $(e)
            .find('td>.hero-icon>a>img')
            .attr('src')
          // console.log(heroIcon);
          // 技能
          const skillName = $(e)
            .find('.joymewiki-tooltips>a>img')
            .attr('alt')
            .split('.')[0]
          // console.log(skillName);
          // 技能图标
          const skillIcon = $(e)
            .find('.joymewiki-tooltips>a>img')
            .attr('src')
          // 装备名
          const weaponName = $(e)
            .find('.weapon_icon>a>img')
            .attr('alt')
            .split('.')[0]
          // console.log(weaponName);
          const weaponIcon = $(e)
            .find('.weapon_icon>a>img')
            .attr('src')
          // console.log(weaponIcon)
          cqData.push({
            heroName,
            heroIcon,
            skillName,
            skillIcon,
            weaponName,
            weaponIcon,
            type
          })
        })
    }
    let $ = await tools.getDataP('http://wiki.joyme.com/cq/%E5%89%91%E5%A3%AB')
    formatData($,'剑士')
    let $1 = await tools.getDataP('http://wiki.joyme.com/cq/%E9%AA%91%E5%A3%AB')
    formatData($1,'骑士')
    let $2 = await tools.getDataP('http://wiki.joyme.com/cq/%E5%BC%93%E6%89%8B')
    formatData($2,'弓手')
    let $3 = await tools.getDataP('http://wiki.joyme.com/cq/%E7%8C%8E%E4%BA%BA')
    formatData($3,'猎人')
    let $4 = await tools.getDataP('http://wiki.joyme.com/cq/%E6%B3%95%E5%B8%88')
    formatData($4,'法师')
    let $5 = await tools.getDataP('http://wiki.joyme.com/cq/%E7%A5%AD%E5%8F%B8')
    formatData($5,'祭司')

    // console.log(cqData)
    fs.writeFile(
      path.join(__dirname, '../data/cqList.json'),
      JSON.stringify(cqData),
      err => {
        if (err) console.log('err')
        console.log('success')
      }
    )
  },
  // 获取gif图
  getGif() {
    // tools.getDataP('http://wiki.joyme.com/cq/%E6%95%91%E4%B8%96%E7%9A%84%E5%9C%A3%E6%AF%8D%E7%8E%9B%E5%88%A9%E4%BA%9A').then($=>{
    //   console.log($('.sbw-gif').find('img').attr('src'))
    // })
    // 个数
    let i = 1
    fs.readFile(
      path.join(__dirname, '../data/cqList.json'),
      'utf-8',
      (err, data) => {
        let list = JSON.parse(data)
        // console.log(list);
        list.forEach(v => {
          // console.log(qs.escape(`${v.heroName}`))
          tools
            .getDataP(`http://wiki.joyme.com/cq/${qs.escape(`${v.heroName}`)}`)
            .then($ => {
              // console.log(
              //   $('.sbw-gif')
              //     .find('img')
              //     .attr('src')
              // )
              v.skillGif = $('.sbw-gif')
                .find('img')
                .attr('src')
              i++
              if (i == list.length) {
                // console.log('finish');
                // console.log(list);
                fs.writeFile(path.join(__dirname,'../data/cqList.json'),JSON.stringify(list),(err)=>{
                  console.log('finish');
                })
              }
            })
        })
      }
    )
  }
}
