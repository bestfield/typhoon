<template>
    <div class="chartStyle">
        <Row>
            <Col class="colCenter" span="8">
                <p>台风强度占比图</p>
                <div id="typhoonLevelPie" :style="{width: '300px', height: '300px'}"></div>
            </Col>
            <Col class="colCenter" span="8">
                <p>历年台风数量图</p>
                <div id="typhoonnNumBar" :style="{width: '300px', height: '300px'}"></div>
            </Col> 
            <Col class="colCenter" span="8">
                <p>线路抗风风险图 {{ typhoonName }} </p>
                <div id="typhoonnWindLine" :style="{width: '300px', height: '300px'}"></div>
            </Col>     
        </Row>
    </div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图、饼图、折线图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/dataZoomInside')
// 引入图表主题
require('echarts/theme/shine.js')
export default {
    props: {
        // 表格当前高亮行数据
        rowData: {
            type: Object,
            required: true
        },
        // 表格中的台风原始数据
        typhoonInfosData: {
            type: Array,
            required: true
        },
        // 台风原始表格数据
        tableOrgData: {
            type: Array,
            required: true
        },
        //  条件筛选后台风表格数据
        tableFilterData: {
            type: Array,
            required: true
        }
    },
    watch: {
        tableOrgData(newVal, oldVal) {
            this.tableOriginData = newVal
            this.levelPie()
            this.typhoonNumLine()
            this.drawCharts()
        },
        rowData(newVal ,oldVal) {
            this.currentRowData = newVal
            this.typhoonOriginData = this.typhoonInfosData
            this.windLine()
            this.drawCharts()
           
        },
        tableFilterData(newVal, oldVal) {
            if(oldVal != null) {
                this.lineChart.clear()
            }
        }
    },
    data() {
        return {
            tableOriginData: [],  //台风表格数据
            currentRowData: {},  //表格高亮行数据
            typhoonOriginData: {},  //台风原始数据
            pieChart: '',  //台风强度占比图
            barChart: '',  //历年台风数量图
            lineChart: '',  //线路抗风风险图
            pieOption: {},  //台风强度占比图配置
            barOption: {},  //历年台风数量图配置
            lineOption: {}  //线路抗风风险图配置
        }
    },
    methods: {
        //台风强度占比图绘制(饼图)
        levelPie() {
            // 数据初始化
            var data = [
                        {value: 0, name:'热带低压'},
                        {value: 0, name:'热带风暴'},
                        {value: 0, name:'强热带风暴'},
                        {value: 0, name:'台风'},
                        {value: 0, name:'强台风'},
                        {value: 0, name:'超强台风'}
                    ]
            // 遍历表格数据对应台风等级计数
            this.tableOriginData.forEach(item => {
                switch(item.maxWindLevel) {
                    case 7: data[0].value++;break;
                    case 8: case 9: data[1].value++;break;
                    case 10: case 11: data[2].value++;break;
                    case 12: case 13: data[3].value++;break;
                    case 14: case 15: data[4].value++;break;
                    case 16: data[5].value++;break;
                }
                if(item.maxWindLevel > 5 && item.maxWindLevel < 7) {
                    data[0].value++
                } else if(item.maxWindLevel > 16) {
                    data[5].value++
                }
            })
            // 过滤出现次数为0的台风
            data = data.filter(item => {
                return item.value > 0
            })
            // 配置饼图
            this.pieOption = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}次 ({d}%)"
                },
                series : [
                    {
                        name: '台风等级',
                        type: 'pie',
                        radius : '70%',
                        center: ['50%', '50%'],
                        data: data,
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            length: 2,
                            length2: 4
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        },
        //历年台风数量图绘制(柱状图)
        typhoonNumLine() {
            // 数据初始化
            var dataAxis = []  //柱形图X轴刻度名
            var dataAxisData = []  //柱形图X轴数据
            var data = []
            // 遍历搜索结果对每年台风计数
            this.tableOriginData.forEach(item => {
                var typhoonTotalNum = { year: 0, count: 0 }
                typhoonTotalNum.year = item.typhoonId.toString().substring(0, 4)
                var index = dataAxis.indexOf(typhoonTotalNum.year)
                if(index == -1) {
                    typhoonTotalNum.count = 1
                    dataAxis.push(typhoonTotalNum.year)
                    data.push(typhoonTotalNum)
                } else {
                    data[index].count++
                }
            })
            // 柱状图x、y轴数据按时间升序排序
            dataAxis.sort(function(a, b) {
                return a - b
            })
            data.sort(function(a, b) {
                return a.year - b.year
            })
            // 将排好序之后的数据放入dataAxisData
            data.forEach(item => {
                dataAxisData.push(item.count)
            })

            // 配置柱状图
            this.barOption = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b}年 : {c}次"
                },
                grid: {
                    top: '10%',
                    left: '20%',
                },
                xAxis: {
                    data: dataAxis,                    
                },
                yAxis:  {
                    type : 'value',
                    minInterval: 1
                },
                 dataZoom: [{
                    type: 'inside',
                        start: 0,
                        end: 80
                    }, 
                    {
                        start: 0,
                        end: 80,
                }],
                series: [
                    {
                        type: 'bar',
                        center: ['46%', '50%'],
                        itemStyle: {
                            normal: {color: 'rgba(0,0,0,0.05)'}
                        },
                        barGap:'-100%',
                        barCategoryGap:'40%',
                        animation: false
                    },
                    {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#83bff6'},
                                        {offset: 0.5, color: '#188df0'},
                                        {offset: 1, color: '#188df0'}
                                    ]
                                )
                            },
                            emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data: dataAxisData
                    }
                ]
            };

            // 柱形图左右滑动，鼠标滚动缩放
            var zoomSize = 6;
            var that = this
            this.barChart.on('click', function (params) {
                // console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
                that.barChart.dispatchAction({
                    type: 'dataZoom',
                    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                    endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                });
            });
        },
        //线路抗风风险图绘制(折线图)
        windLine() {
            // 数据初始化
            var currentTyphoon = {}
            this.typhoonOriginData.some(singleTyphoonData => {
                if(singleTyphoonData.typhoonId == this.currentRowData.typhoonId) {
                    currentTyphoon = singleTyphoonData
                    return true
                }
            })
            // console.log(currentTyphoon)
            //  配置X轴数据
            var xAxisData = []
            var length = currentTyphoon.points.length
             // 配置Y轴数据(台风的风级数据)
            var trueData = []  //  真实路径数据
            var chinaForecast = []  //中国预测路径数据
            var japanForecast = []  //日本预测路径数据
            var taiwanForecast = []  //中国台湾预测路径数据
            var koreaForecast = []  //韩国预测路径数据
            var europeForecast = []  //欧洲预测路径数据
            var hongkongForecast = []  //中国香港预测路径数据
            var americaForecast = []  //美国预测路径数据
            var lineDefault = 6  //线路抗风等级(测试数据)
            
            currentTyphoon.points.forEach(point => {
                // 存放真实路径的预报时间
                var time = this.formatDate(new Date(point.time.replace(/T/g, " ")))
                xAxisData.push(time)

                // 存放真实路径台风风级与抗风差值
                var levelMin = point.power - lineDefault
                trueData.push([time, levelMin])
            })
            
            // 台风尚未结束则继续存放预测路径(各个预测机构预测时间不同，默认直接存放未来七天)
            if(currentTyphoon.points[length - 1].forecast != null && currentTyphoon.points[length - 1].forecast != '') {
                var lastTime = new Date(currentTyphoon.points[length - 1].time.replace(/T/g, " "))
                var nextHourTime = new Date(lastTime)
                var timeLength = 7 * 24  //七天
                // X轴默认显示未来七天坐标
                for(var i = 0;i < timeLength; i++) {
                   nextHourTime = new Date(nextHourTime.getTime() + 1 * 60 * 60 *1000 )
                   var nextHourTimeStr = this.formatDate(nextHourTime)
                   xAxisData.push(nextHourTimeStr)
                }
                
                //存放预测路径台风风级与抗风差值
                currentTyphoon.points[length - 1].forecast.forEach(item => {
                    var levelMin = ''
                    if(item.sets == "中央") {
                        item.points.forEach(forecastPoint => {
                            levelMin = forecastPoint.power - lineDefault
                            forecastPoint.time = this.formatDate(new Date(forecastPoint.time.replace(/T/g, " ")))
                            chinaForecast.push([forecastPoint.time, levelMin])
                        }) 
                    } else if(item.sets == "日本") {
                        item.points.forEach(forecastPoint => {
                            levelMin = forecastPoint.power - lineDefault
                            forecastPoint.time = this.formatDate(new Date(forecastPoint.time.replace(/T/g, " ")))
                            japanForecast.push([forecastPoint.time, levelMin])
                        }) 
                    } else if(item.sets == "中国台湾") {
                        item.points.forEach(forecastPoint => {
                            levelMin = forecastPoint.power - lineDefault
                            forecastPoint.time = this.formatDate(new Date(forecastPoint.time.replace(/T/g, " ")))
                            taiwanForecast.push([forecastPoint.time, levelMin])
                        }) 
                    } else if(item.sets == "韩国") {
                        item.points.forEach(forecastPoint => {
                            levelMin = forecastPoint.power - lineDefault
                            forecastPoint.time = this.formatDate(new Date(forecastPoint.time.replace(/T/g, " ")))
                            koreaForecast.push([forecastPoint.time, levelMin])
                        }) 
                    } else if(item.sets == "中国香港") {
                        item.points.forEach(forecastPoint => {
                            levelMin = forecastPoint.power - lineDefault
                            forecastPoint.time = this.formatDate(new Date(forecastPoint.time.replace(/T/g, " ")))
                            hongkongForecast.push([forecastPoint.time, levelMin])
                        }) 
                    } else if(item.sets == "美国") {
                        item.points.forEach(forecastPoint => {
                            levelMin = forecastPoint.power - lineDefault
                            forecastPoint.time = this.formatDate(new Date(forecastPoint.time.replace(/T/g, " ")))
                            americaForecast.push([forecastPoint.time, levelMin])
                        }) 
                    } else if(item.sets == "欧洲") {
                        item.points.forEach(forecastPoint => {
                            levelMin = forecastPoint.power - lineDefault
                            forecastPoint.time = this.formatDate(new Date(forecastPoint.time.replace(/T/g, " ")))
                            europeForecast.push([forecastPoint.time, levelMin])
                        }) 
                    }
                })
                
                //预测路径数组连接实际路径的最后一个点
                var lastTruePoint = trueData[trueData.length - 1]
                chinaForecast = [lastTruePoint].concat(chinaForecast)
                japanForecast = [lastTruePoint].concat(japanForecast)
                taiwanForecast = [lastTruePoint].concat(taiwanForecast)
                koreaForecast = [lastTruePoint].concat(koreaForecast)
                hongkongForecast = [lastTruePoint].concat(hongkongForecast)
                americaForecast = [lastTruePoint].concat(americaForecast)
                europeForecast = [lastTruePoint].concat(europeForecast)
            }
            // console.log(japanForecast)

            // 配置折线图
            this.lineOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    type: 'scroll',
                    top: 20,
                    left: '7%',
                    data:['中央', '日本', '中国台湾', '韩国', '欧洲' , '中国香港', '美国']
                },
                grid: {
                    top: '24%',
                    left: '12%',
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisData
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    axisLabel: {
                        formatter: '{value}级'
                    }
                },
                dataZoom: [{
                    type: 'inside',
                        start: 0,
                        end: 100,
                    },
                    {
                        type: 'slider',
                        bottom: -2,
                        start: 0,
                        end: 100,
                    }
                ],
                // visualMap: {
                //     top: 0,
                //     left: '8%',
                //     orient: 'horizontal',
                //     pieces: [{
                //         lte: 0,
                //         color: '#096'
                //     }, {
                //         gt: 0,
                //         lte: 5,
                //         color: '#ff9933'
                //     }, {
                //         gt: 5,
                //         lte: 10,
                //         color: '#ff5533'
                //     }, {
                //         gt: 10,
                //         lte: 15,
                //         color: '#cc0033'
                //     }],
                //     outOfRange: {
                //         color: '#999'
                //     }
                // },
                series: [
                    {
                        name: '实际路径',
                        type: 'line',
                        data: trueData,
                    },
                    {
                        name: '中央',
                        type: 'line',
                        color:['red'],
                        data: chinaForecast,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:2,
                                    type:'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        },     
                    },
                    {
                        name: '日本',
                        type: 'line',
                        color:['yellow'],
                        data: japanForecast,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:2,
                                    type:'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        },    
                    },
                    {
                        name: '中国台湾',
                        type: 'line',
                        color:['green'],
                        data: taiwanForecast,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:2,
                                    type:'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        },    
                    },
                    {
                        name: '中国香港',
                        type: 'line',
                        color:['pink'],
                        data: hongkongForecast,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:2,
                                    type:'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        },    
                    },
                    {
                        name: '韩国',
                        type: 'line',
                        color:['#2d8cf0'],
                        data: koreaForecast,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:2,
                                    type:'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        },    
                    },
                    {
                        name: '美国',
                        type: 'line',
                        color:['purple'],
                        data: americaForecast,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:2,
                                    type:'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        },    
                    },
                    {
                        name: '欧洲',
                        type: 'line',
                        color:['black'],
                        data: europeForecast,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:2,
                                    type:'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        },    
                    },
                ]
            }

        },
        // 绘制图表
        drawCharts() {
            // 基于准备好的dom，初始化echarts实例
            this.pieChart = echarts.init(document.getElementById('typhoonLevelPie'), 'shine');
            this.barChart = echarts.init(document.getElementById('typhoonnNumBar'), 'shine');
            this.lineChart = echarts.init(document.getElementById('typhoonnWindLine'), 'shine');
            // 绘制图表
            this.pieChart.setOption(this.pieOption);
            this.barChart.setOption(this.barOption);
            this.lineChart.setOption(this.lineOption);
            
            // window.addEventListener('resize',() => {
            //     this.pieChart.resize();
            //     this.barChart.resize();
            //     this.lineChart.resize();
            // });

            // window.dispatchEvent(new Event('resize'));  
            
        }
    },
    computed: {
        typhoonName() {
            if(typeof(this.currentRowData.name) == 'undefined') {
                return ''
            } else {
                return '(' + this.currentRowData.name + ')'
            }
        }
    },
    mounted() {  
        this.drawCharts()
    },
}
</script>
<style scoped>
.colCenter p{
    text-align: center;
    padding: 4px 0;
    background: #f8f8f9;
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec;
}
.chartStyle {
    background: #fff;
    padding: 0 5px;
}
</style>

