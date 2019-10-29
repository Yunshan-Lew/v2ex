//index.js
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
  onLoad: function () {
    this.getData('getLatestTopic')
		wx.getSetting({
			success: (res) => {
				console.log('是否获取用户信息：' + res.authSetting["scope.userInfo"])
			}
		})
  },
	
  getData: function (request, cb) {
    var that = this
    wx.request({
      url: webapi[request](),
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        var resData = res.data
        that.setData({
          list: resData.map(function(a){
            return {
              avatar_normal: a.member.avatar_large,
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
	
	getNodes: function(request, cb){
		var that = this
    wx.request({
      url: webapi[request](),
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        var resData = res.data
				var nodesList = []
				resData.sort(function(a, b){
					return b.topics - a.topics 
				})
				resData.forEach(function(a, i){
					if( i < 99 ) nodesList[i] = a
				})
        that.setData({
          list: nodesList,
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
	
  switchTab: function (e) {
    var that = this
    var currentTarget = e.currentTarget.id;
    if( currentTarget === 'latest' && this.data.template !== 'latest'){
      this.setData({
        hidden: false
      })
      this.getData('getLatestTopic', function(){
        that.setData({
          template: 'latest'
        })
      })
    }
		else if(currentTarget === 'hot' && this.data.template !== 'hot'){
      this.setData({
        hidden:false
      })
      this.getData('getHotTopic',function(){
        that.setData({
          template:'hot'
        })
      })
    }
		else if( currentTarget === 'nodes' && this.data.template !== 'nodes' ){
			this.setData({
        hidden:false
      })
      this.getNodes('getAllNode', function(){
        that.setData({
          template: 'nodes'
        })
      })
		}
  },
	
	linkTo: function(e){
		var href = e.currentTarget.dataset.href;
		wx.navigateTo({
			url: href
		})
	}
})
