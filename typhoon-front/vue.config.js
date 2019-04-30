module.exports = {
  baseUrl: "./",
  lintOnSave: false,
  // devServer:{
  //   proxy:{
  //     'api':{
  //       target:'http://localhost:8080',
  //       changeOrigin:true,
  //       pathRewrite:{
  //         '^api':'mock'
  //       }
  //     }
  //   }
  // }
  
  devServer: {
    proxy: 'http://localhost:8083'
  }
  
};
