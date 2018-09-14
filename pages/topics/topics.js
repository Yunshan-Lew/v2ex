//topics.js
//获取应用实例
var app = getApp()
var webapi = require('../../utils/web_api.js')
var utils = require('../../utils/util.js')

Page({
  data: {
    list:[],
    hidden: false,
    errorCount: 0,
    template: 'latest'
  },
  onLoad: function (query) {
    this.getData('getTopic', query.node_id)
  },
	
  getData: function (request, id, cb) {
    var that = this
    wx.request({
      url: webapi[request]({ node_id: id }),
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        var resData = res.data
        that.setData({
          list: resData.map(function(a){
            return {
              avatar_normal: a.member.avatar_normal,
              username: a.member.username,
              node_title: a.node.title,
              last_modified: utils.kindTime(a.last_modified),
              replies: a.replies,
              title: a.title,
              topicid: a.id
            }
          }),
          hidden: true,
          errorCount: 0
        })
        if(cb && typeof cb === 'function'){
          cb()
        }
      },
      fail: function (err){
        console.error('接口出错，请稍后再试。');
      }
    })
  },
	
	linkTo: function(e){
		var href = e.currentTarget.dataset.href;
		wx.navigateTo({
			url: href
		})
	}
})