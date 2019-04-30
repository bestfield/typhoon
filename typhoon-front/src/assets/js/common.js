export default {
    install(Vue, options) {
        // 日期格式转换(标准日期转换为)
        Vue.prototype.formatDate = function (date) { 
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? ('0' + m) : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
            var h = date.getHours();  
            var minute = date.getMinutes();  
            minute = minute < 10 ? ('0' + minute) : minute; 
            var second= date.getSeconds();  
            second = minute < 10 ? ('0' + second) : second;
            return m + '-' + d+' \n '+h+':'+minute+':'+ second;
            // return y + '-' + m + '-' + d+' '+h+':'+minute+':'+ second;
        }
   
    }
}