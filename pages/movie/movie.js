//index.js
//获取应用实例
const app = getApp()
var page={
  url: 'https://api.douban.com/v2/movie/in_theaters',
  start: 0,
  count: 10,
  search:'',
  total:0,
}
Page({
  data: {
    movies: [],
    searchKey:'',
    active:'hot',
  },
  getDataAgain(){
    page.start = 0;
    page.count = 10;
    var that = this;
    that.setData({
      movies: []
    }, function () {
      that.getData();
    });
  },
  search:function(){
    if (this.data.searchKey != '') {
      page.search = this.data.searchKey;
      page.url = 'https://api.douban.com/v2/movie/search';
      
    }else{
      page.url = 'https://api.douban.com/v2/movie/in_theaters';  
    }
    this.setData({
      active: 'hot',
    });
    this.getDataAgain();
  },
  getHot:function(){
    this.setData({
      active: 'hot',
    });
    page.url='https://api.douban.com/v2/movie/in_theaters';
    this.getDataAgain();
  },
  getNow: function () {
    this.setData({
      active: 'now',
    });
    page.url= 'https://api.douban.com/v2/movie/coming_soon';
    this.getDataAgain();
  },
  getTop: function () {
    this.setData({
      active: 'top',
    });
    page.url='https://api.douban.com/v2/movie/top250';
    this.getDataAgain();
  },
  bindKeyInput: function (e) {
    this.setData({
      searchKey: e.detail.value
    });
  },
  getData:function(){
    var that = this;
    var data = {
      start: page.satrt,
      count: page.count
    };
    if(page.search!=''){
      data.q = page.search;
    }
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    wx.request({
      url: page.url,
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        page.total = res.data.total;
        if (page.search == '') {
          that.setData({
          movies: that.data.movies.concat(res.data.subjects)
          },function(){
            wx.hideLoading();
          });
        }else{
          that.setData({
            movies: res.data.subjects
          },function(){
            wx.hideLoading();
          });
        }
      
      },
      fail: function (err) {
        console.log(err);
        wx.hideLoading()
      },
    });
  },
  getMoreData(){
    if(page.start+page.count<page.total){
      page.start+=page.count;
      this.getData();
    }else{
      wx.showToast({
        title: '已加载全部信息',
        icon: 'success',
        duration: 2000
      })
    }
  },
  onLoad: function () {
    this.getData();
  }
})