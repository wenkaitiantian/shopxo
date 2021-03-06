const app = getApp();
Page({
  data: {
    indicator_dots: false,
    indicator_color: 'rgba(0, 0, 0, .3)',
    indicator_active_color: '#e31c55',
    autoplay: true,
    circular: true,
    data_list_loding_status: 1,
    data_bottom_line_status: false,
    data_list: [],
    common_shop_notice: null,
    common_app_is_enable_search: 1,
    common_app_is_enable_answer: 1,
    load_status: 0,
  },
  
  onShow() {
    this.init();
  },

  // 获取数据列表
  init() {
    var self = this;

    // 加载loding
    this.setData({
      data_list_loding_status: 1,
    });

    // 加载loding
    my.httpRequest({
      url: app.get_request_url("index", "index"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.stopPullDownRefresh();
        self.setData({load_status: 1});

        if (res.data.code == 0) {
          var data = res.data.data;
          self.setData({
            data_list: data.data_list,
            indicator_dots: (data.data_list.length > 1),
            autoplay: (data.data_list.length > 1),
            common_shop_notice: data.common_shop_notice || null,
            common_app_is_enable_search: data.common_app_is_enable_search,
            common_app_is_enable_answer: data.common_app_is_enable_answer,
            data_list_loding_status: data.data_list.length == 0 ? 0 : 3,
            data_bottom_line_status: true,
          });
        } else {
          self.setData({
            data_list_loding_status: 0,
            data_bottom_line_status: true,
          });

          my.showToast({
            type: "fail",
            content: res.data.msg
          });
        }
      },
      fail: () => {
        my.stopPullDownRefresh();
        self.setData({
          data_list_loding_status: 2,
          data_bottom_line_status: true,
          load_status: 1,
        });

        my.showToast({
          type: "fail",
          content: "服务器请求出错"
        });
      }
    });
  },

  // 搜索事件
  search_input_event(e) {
    var keywords = e.detail.value || null;
    if (keywords == null) {
      my.showToast({content: '请输入搜索关键字'});
      return false;
    }

    // 进入搜索页面
    my.navigateTo({
      url: '/pages/goods-search/goods-search?keywords='+keywords
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  // 自定义分享
  onShareAppMessage() {
    return {
      title: app.data.application_title,
      desc: app.data.application_describe,
      path: '/pages/index/index?share=index'
    };
  },

});
