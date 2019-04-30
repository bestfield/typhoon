<template>
<div>
    <transition name="fadeAni">
    <!-- 面板 -->
    <div v-show="show" id="panel"> 
        <div class="statistics">
            <Row class="rowStyle">
                <Col span="2" offset="1" >
                  <span>
                    起止时间<Icon class="colorGray" type="ios-arrow-forward" />
                  </span>
                </Col>
                <!-- 日期过滤 -->
                <Col span="3">
                    <DatePicker size="small" v-model="startYear" class="timeSelect" :clearable="false" transfer type="year" placeholder="起始日期"></DatePicker>
                </Col>
                <Col span="1" class="colCenter">
                  <div >
                    至
                  </div>
                </Col>
                <Col span="3">
                    <DatePicker size="small" v-model="endYear"  class="timeSelect" :clearable="false" transfer type="year" placement="bottom-start" placeholder="结束日期"></DatePicker>
                </Col>

                <!-- 功能按钮 -->
                <Col span="4" class="colRight">
                  <Button @click="searchTyphoon()" size="small" type="info">查询</Button>
                </Col>
                <Col span="4" class="colRight">
                  <Button class="exportBut" size="small" type="info" @click="exportForeExcel()">预报路径导出</Button>
                </Col>
                <Col span="4" class="colRight">
                  <Button class="exportBut" size="small" type="info" @click="exportActualExcel()">实况路径导出</Button>
                </Col>
            </Row>
            <!-- 要素查询 -->
            <Row class="rowStyle">
                <Col span="2" offset="1" >
                  线路名称<Icon class="colorGray" type="ios-arrow-forward" />
                </Col>
                <Col span="7">
                  <Input size="small"  v-model="wireInput"  @on-enter="searchWire" search id="searchInput" class="searchInput" clearable  placeholder="请输入线路名称"/>
                  <ul id="searchInputUL">
                    <li v-for="(item,index) in NewItems"  class="searchInputLi" @click="getWireName(item.NAME)" :key="index"><span class="inputText" :value="item.value" v-text="item.NAME"></span></li>
                  </ul>
                </Col>
                <!-- 功能按钮 -->
                <Col span="4" class="colRight">
                  <Button @click="selectLineParam()" size="small" type="info" title="绘制线查询台风">线查询</Button>
                </Col>
                <Col span="4" class="colRight">
                  <Button @click="selectPolygonParam()" size="small" type="info" title="绘制面查询台风">面查询</Button>
                </Col>
                <Col span="2">
                  <Button @click="clearElement()" size="small" style="margin-left: 11px" type="warning" title="关闭绘制元素">清除</Button>
                </Col>
            </Row>

            <!-- 线路等级 -->
            <Row class="rowStyle">
                <Col span="2" offset="1" >
                  <span>
                    线路等级<Icon class="colorGray" type="ios-arrow-forward" />
                  </span>
                </Col>
                <!-- <Col span="21"> -->
                  <div class="radioPadding">
                    <div v-for="(item, index) in selectLinvLevel"  @click="clearLineLevelSelect(lineLevel, item) , typhoonLineTableFilterResult()"  :class="[item == lineLevel ? 'selectSpan' : '']">
                      <Divider v-if="index != 0" type="vertical" />
                      <span :class="[item == typhoonLevel ? 'selectSpan' : 'levelContent']">{{item}}</span>
                    </div>
                  </div>
                <!-- </Col> -->
            </Row>
            <!-- 台风等级 -->
            <Row class="rowStyle">
                <Col span="2" offset="1" >
                  <span>
                    台风等级<Icon class="colorGray" type="ios-arrow-forward" />
                  </span>
                </Col>
                <!-- <Col span="21"> -->
                  <div class="radioPadding">
                    <div @click="clearTyphoonLevelSelect(typhoonLevel, item) , typhoonTableFilterResult()" v-for="(item, index) in selectLevel" >
                      <Divider v-if="index != 0" type="vertical" />
                      <span :class="[item == typhoonLevel ? 'selectSpan' : 'levelContent']">{{item}}</span>
                    </div>
                  </div>
                <!-- </Col> -->
            </Row>
            <!-- 活跃周期 -->
            <Row class="rowStyle">
                <Col span="2" offset="1" >
                  <span>
                    活跃周期<Icon class="colorGray" type="ios-arrow-forward" />
                  </span>
                </Col>
                <!-- <Col span="21"> -->
                  <div class="radioPadding">
                    <div @click="clearTimeSelect(activeTime, item), typhoonTableFilterResult()" v-for="(item, index) in selectTime" :class="[item == activeTime ? 'selectSpan' : '']">
                      <Divider v-if="index != 0" type="vertical" />
                      <span :class="[item == typhoonLevel ? 'selectSpan' : 'levelContent']">{{item}}</span>
                    </div>
                  </div>
                <!-- </Col> -->
            </Row>
            <!-- 表格数据 -->
            <Row>
              <Col class="colCenter" span="24">
                <h1 class="tableTitle">历史台风统计数据表</h1>
              </Col>
            </Row>
            <Row class="tableContent">
              <Col span="24">
                <Spin fix v-if="loading">
                  <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                  <div>Loading</div>
                </Spin>
                <Table 
                  ref="myTable"
                  @on-current-change="getRowData" 
                  @on-selection-change="selectRow" 
                  @on-select-cancel="clearFeature"
                  @on-select-all-cancel="clearAll"
                  class="tableStyle"
                  highlight-row 
                  border 
                  :columns="columns1" 
                  :data="tableFilterData"></Table>   
              </Col>    
            </Row>
            <!-- 图表分析 -->
            <TyphoonChart 
              :rowData="currentRowData"
              :tableOrgData="tableOriginData"
              :tableFilterData="tableFilterData"
              :typhoonInfosData="typhoonInfos"
            ></TyphoonChart>
        </div>
    </div>
    </transition>
     <!-- panel下面功能控制面板 -->
     <TyphoonOrg @forecastShow="forecastShow" @singleForcastUpdate="singleForcastUpdate" @allForecastupdate="allForecastupdate"></TyphoonOrg>
  </div>
</template>

<script>
/* eslint-disable */
import $ from "jquery"
import Bus from './bus.js'
import TyphoonChart from './TyphoonChart'
import TyphoonOrg from "./TyphoonOrg"
import MapLegend from "./MapLegend"
export default {
  components: {
    MapLegend, TyphoonOrg, TyphoonChart
    
  },
  props: {
    map: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    map(newVal, oldVal) {
      this.map = newVal;
       // console.log(data.forePointLayer.features)
      this.$emit("update", {
        drawPoint: this.drawPoint,
        drawLine: this.drawLine,
        drawPolygon: this.drawPolygon,
        elementVector: this.elementVector,
        lineVectorLayer: this.lineVectorLayer,
        pointVectorLayer: this.pointVectorLayer,
        foreLineLayer: this.foreLineLayer,
        typhoonCircleVector: this.typhoonCircleVector,
        // forePointLayer: this.forePointLayer,
        selectControl: this.selectControl,
        markerlayer: this.markerlayer
      }); //监听点查询，通知父组件的map执行update
    },
  },
  data() {
    return {
      blockTab: [
        //要素查询
        {
          name: "点查询",
          id: "pointChoose"
        },
        {
          name: "线查询",
          id: "lineChoose"
        },
        {
          name: "区域查询",
          id: "geoChoose"
        }
      ],
      wireNames:[], //暂存线路名称
      wireInput:"",  //输电线路查询输入框输入的值
      wireVectorBuffers:[],
      forecastCountries: [],  //所有预测机构
      startYear: new Date(), //开始日期
      endYear:  new Date(), //结束日期
      lineLevel: '',  //线路等级选择
      typhoonLevel: '',  //台风等级选择
      activeTime: '',  //台风活跃周期
      selectLinvLevel: ['±650KV', '±500KV', '±380KV', '±220KV', '±200KV', ' ±110KV'],
      selectLevel: ['热带低压(TD)','热带风暴(TS)','强热带风暴(STS)','台风(TY)','强台风(STY)','超强台风(Super TY)'],
      selectTime: ['<=5天','5~7天','7~10天','10天以上'],
      loading: false,  //表格搜索是否加载中
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          key:"index",
          width: 40,
          align: 'center'
        },
        {
          title: '台风编号',
          key: 'typhoonId',
          width: 60,
          align: 'center'
        },
        {
          title: '台风名称',
          key: 'name',
          width: 60,
          align: 'center'
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: 140,
          align: 'center'
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: 140,
          align: 'center'
        },
        {
          title: '活跃周期',
          key: 'typhoonActiveTime',
          width: 66,
          align: 'center'
        },
        {
          title: '最大风力等级',
          key: 'maxWindLevel',
          width: 60,
          align: 'center'
        },
        {
          title: '最大风速(m/S)',
          key: 'maxwindSpeed',
          align: 'center'
        },
        {
          title: '最大中心气压',
          key: 'maxCenterPressure',
          align: 'center'
        },
        {
          title: '最大7级风圈',
          key: 'maxSevenRadius',
          align: 'center'
        },
        {
          title: '最大10级风圈',
          key: 'maxTenRadius',
          align: 'center'
        }
      ],
      tableOriginData: [],  //表格原始数据(根据用户选择在原始数据中筛选出需要显示的数据放到tableFilterData中)
      tableFilterData: [],  //表格筛选结果
      currentRowData: {},  //当前高亮行数据
      radius: 50, //点查询点半径(KM)
      lon: null, //要素查询tab 经度E
      lat: null, //要素查询tab 纬度N
      drawPoint: {}, //点绘制
      drawLine: {}, //线绘制
      drawPolygon: {}, //面绘制
      elementVector: new SuperMap.Layer.Vector("elementVector"), //要素图层 点查询、线查询、面查询, 绘制的矢量图形均放入elementVector中

      typhoonInfos: [], //需要绘制的台风列表
      typhoonOriginInfos: [],  //请求获得的台风数据
      isTyphoonListAllSelect: false, //台风数据列表是否全选
      typhoonSelectInfos: [],  //打勾台风详细数据
      pointVectorLayer: new SuperMap.Layer.Vector("pointVectorLayer"),
      lineVectorLayer: new SuperMap.Layer.Vector("lineVectorLayer"),
      typhoonTitle:"",
     
      // featurePop: new SuperMap.InfoWindow("feature", "台风详情"),
      // hoverFeaturePop: new SuperMap.InfoWindow("feature", "台风详情" ),
      featurePop:"",  //距离测量弹出框
      hoverFeaturePop:"",
      selectControl: "",
      // forePointLayer: new SuperMap.Layer.Vector("forePointLayer"),
      foreLineLayer: new SuperMap.Layer.Vector("foreLineLayer"),
      org: {},  //台风预测路径单选
      isShowAllOrg: {},  //台风预测路径全选
      typhoonOrg: {},  //台风预测路径所有单选数据
      nowFeature: '',  //当前选中feature
      typhoonCircleVector: new SuperMap.Layer.Vector("typhoonCircleVector"),  //台风风圈
      pointTyphoonArray: [],  //按数组存放每个台风的所有点
      markerlayer: new SuperMap.Layer.Markers("markerlayer"),
      marker: ''
    };
  },
  methods: {
    mockData() {  //进入页面请求台风数据
      this.$axios
        // .get("listlive?startYear=2019&endYear=2019")
        .get("mock/test.json")
        .then(res => {
          // console.log(res)
          this.tableSearchTyphoon(res)  //将台风数据放入数据统计表格中
          // res.data.forEach(typhoonInfos => {
          //   var len =typhoonInfos.points.length
          //   typhoonInfos.forecastPointIndex = -1  //初始化台风预测路径绘制(-1即该台风最后一个点绘制预测路径)
          //   typhoonInfos.end_time = typhoonInfos.points[len-1].time
          //   this.typhoonSelectInfos.push(typhoonInfos)
          //   this.typhoonInfos.push(typhoonInfos);
          // });
          this.addTyphoonFeatures() //绘制当前台风路径
        })
        .catch(function(e) {
          console.log(e);
        });
    },
/**
 * 功能面板:时间选择、点、线、面查询
 **/
    // 在地图上清除选择的要素
    clearElement() {
      this.drawPoint.deactivate();
      this.drawLine.deactivate();
      this.drawPolygon.deactivate();
      if (this.elementVector != null) {
        this.elementVector.removeAllFeatures();
      }
      this.lon = "";
      this.lat = "";
    },

    //选择点要素
    selectPointParam() {
      this.clearElement()
      this.elementVector.removeAllFeatures();
      this.drawPoint.deactivate();
      this.drawPoint.activate();
    },

    // 点要素绘制结束
    drawPointCompleted(eventArgs) {
      this.deactiveAll(); //关闭绘制
      var geometry = eventArgs.feature.geometry;
      var pointElement = geometry.getCentroid();  //获取到的点

      pointElement.x = pointElement.x.toFixed(2) * 1;
      pointElement.y = pointElement.y.toFixed(2) * 1;
      this.lon = pointElement.x;
      this.lat = pointElement.y;
      var _self = this
      var circleP = this.createCircle(
        pointElement,
        _self.radius / 110,
        256,
        360,
        360
      ); //除以110转换成经纬度坐标
      var circleVector = new SuperMap.Feature.Vector(circleP);
      circleVector.style = {
        strokeColor: "#A83D2A",
        fillColor: "#EA6847",
        strokeWidth: 2,
        fillOpacity: 0.4
      };
      this.elementVector.removeAllFeatures();
      this.elementVector.addFeatures([circleVector]);
      //重置台风gif的z-index
      $(".olAlphaImg").parent().parent().css("z-index", 390)
      pointElement.radius = this.radius
      // console.log(pointElement)
      // console.log("点要素绘制结束");
      this.searchByPoint(pointElement);
    },

    //点查询数据请求
    searchByPoint(point) {
      this.loading = true
      var startYear = this.startYear.getFullYear()
      var endYear = this.endYear.getFullYear()
      this.$axios.get('mock/test.json')
        // .get('querybypoint', {
        //   // startYear & endYear & longitude & latitude & radius
        //   params: {
        //     startYear: startYear,
        //     endYear: endYear,
        //     longitude: point.x,
        //     latitude:point.y,
        //     radius: point.radius,
        //   }

        // })
        .then(res => {
          console.log("点查询",res)
          this.tableSearchTyphoon(res)  //将查询到的台风数据填入表格
          // this.typhoonTableData
          // 每次查询之后先将选项,台风数据重置

        })
        .catch(function(e) {
          console.log(e)
        })
    },

    // 绘制圆对象
    createCircle(origin, radius, sides, r, angel) {
      var rR = (r * Math.PI) / (180 * sides);
      var rotatedAngle, x, y;
      var points = [];
      for (var i = 0; i < sides; ++i) {
        rotatedAngle = rR * i;
        x = origin.x + radius * Math.cos(rotatedAngle);
        y = origin.y + radius * Math.sin(rotatedAngle);
        points.push(new SuperMap.Geometry.Point(x, y));
      }
      rotatedAngle = (r * Math.PI) / 180;
      x = origin.x + radius * Math.cos(rotatedAngle);
      y = origin.y + radius * Math.sin(rotatedAngle);
      points.push(new SuperMap.Geometry.Point(x, y));

      var ring = new SuperMap.Geometry.LinearRing(points);
      ring.rotate(parseFloat(angel), origin);
      var geo = new SuperMap.Geometry.Collection([ring]);
      geo.origin = origin;
      geo.radius = radius;
      geo.r = r;
      geo.angel = angel;
      geo.sides = sides;
      geo.polygonType = "Curve";
      return geo;
    },

    // 选择线要素
    selectLineParam() {
      this.clearElement()
      this.elementVector.removeAllFeatures();
      this.drawLine.deactivate();
      this.drawLine.activate();
    },
    
    // 线要素绘制结束
    drawLineCompleted(eventArgs) {
      this.deactiveAll(); //关闭绘制
      const geometry = eventArgs.feature.geometry;
      const points = [];
      geometry.components[0].components.forEach(point => {
        point.x = point.x.toFixed(2) * 1;
        point.y = point.y.toFixed(2) * 1;
        points.push({ 'latitude': point.y, 'longitude': point.x });
      });
      const lineVector = eventArgs.feature;
      lineVector.style = {
        strokeColor: "#ee9900",
        strokeWidth: 2
      };
      this.elementVector.removeAllFeatures();
      this.elementVector.addFeatures([lineVector]);
      console.log("线查询",points)
      this.searchByLine(points)
    },
     
    // 线查询数据请求
    async searchByLine(points) {
      const startYear = this.startYear.getFullYear()
      const endYear = this.endYear.getFullYear()
      this.loading = true

      const res = await this.$axios.post(`/typhoon/querybyline`, { startYear, endYear, points })
      this.tableSearchTyphoon(res.data)  //将线查询到的台风数据填入表格
      
    }, 

    // 选择面要素
    selectPolygonParam() {
      this.clearElement()
      this.elementVector.removeAllFeatures()
      this.drawPolygon.deactivate()
      this.drawPolygon.activate()
    },

    // 面要素绘制结束
    drawPolygonCompleted(eventArgs) {
      this.deactiveAll(); //关闭绘制
      var geometry = eventArgs.feature.geometry;
      var points = [];
      geometry.components[0].components.forEach(point => {
        point.x = point.x.toFixed(2) * 1;
        point.y = point.y.toFixed(2) * 1;
        //points.push({ x: point.x, y: point.y });
		points.push({ 'latitude': point.y, 'longitude': point.x });
      });
      points.pop()  //最后一个点和起始点重叠推出数组
      var polygonVector = eventArgs.feature;
      this.elementVector.removeAllFeatures();
      this.elementVector.addFeatures([polygonVector]);
      // console.log("面要素绘制结束");
      this.searchByPolygon(points)
    },

    // 面查询数据请求
    async searchByPolygon(points) {
      this.loading = true

	  const startYear = this.startYear.getFullYear();
	  const endYear = this.endYear.getFullYear();
	  const resp = await this.$axios.post(`/typhoon/querybypolygon`,{ startYear, endYear, points})
	  
      //const resp = await this.$axios.get(`your-api-address?polygonPoints=${polygonPoints}`)
      this.tableSearchTyphoon(resp.data)  //将面查询到的台风数据填入表格
      
    }, 

    //关闭所有绘制方法
    deactiveAll() {
      this.drawPoint.deactivate();
      this.drawLine.deactivate();
      this.drawPolygon.deactivate()
    },


/**
 *  查询统计
 */
    /**
     * @todo 按年份查询
     * 此处代码为获得所有台风数据, 前端根据台风编号过滤台风年份
     *
     * 自有接口时使用: const resp = await this.$axios.get(`your-api?startYear=${startYear}&endYear=${endYear}`)
     */
    async searchTyphoon() {
      const startYear = this.startYear.getFullYear()
      const endYear = this.endYear.getFullYear()
      this.clearElement()
      this.loading = true

      //const resp = await this.$axios.get('mock/test.json')
      const resp = await this.$axios.get(`/typhoon/listlive?startYear=${startYear}&endYear=${endYear}`)
      this.tableSearchTyphoon(resp.data)
      this.reDrawTyphoon(resp.data)
    },

     // 将条件查询的台风数据填入表格中
     tableSearchTyphoon(res){
       // 每次查询之后先将选项,台风数据重置
      this.typhoonLevel = '';
      this.activeTime = '';
      this.typhoonInfos = [];  // 条件筛选后的台风数据
      this.typhoonOriginInfos = [];  // 一开始请求的台风数据
      this.tableOriginData = [];   // 表格原始数据
      this.typhoonSelectInfos = []; // 筛选后的表格数据
      var isChecked = false;  
      res.forEach(typhoonInfos => {
        var len = typhoonInfos.points.length
        // typhoonInfos.isShow = false;
        // typhoonInfos._checked = true
        typhoonInfos.forecastPointIndex = -1;  //初始化台风预测路径绘制(-1即该台风最后一个点绘制预测路径)
        typhoonInfos.end_time = typhoonInfos.points[len-1].time
        this.typhoonInfos.push(typhoonInfos);
        this.typhoonOriginInfos.push(typhoonInfos);
        let maxData = this.maxTyphoonData(typhoonInfos.points);  //返回整个台风最大(风圈、压强、风速)等数据
        //查询出的台风数据如果为活跃台风,初始为选中状态
        if(typhoonInfos.is_current == 1){
          this.typhoonSelectInfos.push(typhoonInfos)
          isChecked = true;  
        }else{
          isChecked = false;
        }
        //添加表格行数据
        this.tableOriginData.push({
          typhoonId: typhoonInfos.typhoonId,
          name: typhoonInfos.typhoonName,
          startTime: typhoonInfos.begin_time.replace(/T/g, " "),
          endTime: typhoonInfos.end_time.replace(/T/g, " "),
          typhoonActiveTime: this.typhoonActiveTime(typhoonInfos.begin_time, typhoonInfos.end_time),
          maxWindLevel: maxData.maxWindLevel,
          maxwindSpeed: maxData.maxwindSpeed,
          maxCenterPressure: maxData.maxCenterPressure,
          maxSevenRadius: maxData.maxSevenRadius,
          maxTenRadius: maxData.maxTenRadius,
          _checked:isChecked,
        })
      });
      this.tableFilterData = this.tableOriginData;  //初始表格数据 台风请求的原始表格数据
      this.clearMapTyphoon();  //根据表格数据重绘台风前清除其他台风要素
      this.resetForecastIndex();  //重置台风预测路径绘制的位置
      this.loading = false
    },


    
    // 台风活跃周期计算
    typhoonActiveTime(startTime, endTime) {
      var activateTime = 0;
      startTime = new Date(startTime.replace(/T/g, " "))
      endTime = new Date(endTime.replace(/T/g, " "))

      var dateDiff = endTime - startTime  //时间差的毫秒数
      activateTime = Math.floor(dateDiff / (24 * 3600 * 1000))  //计算出相差天数
      var dateDiffSecond = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
      var hours = Math.floor(dateDiffSecond / (3600 * 1000))//计算出小时数
      if(activateTime > 0) {
        return activateTime + "天" + hours + "小时"
      } else {
        return hours + "小时"
      }
    },

    //台风相关数据最大值计算
    maxTyphoonData(points) {
      var maxObj = {
        maxWindLevel: 0,
        maxwindSpeed: 0,
        maxCenterPressure: 0,
        maxSevenRadius: 0,
        maxTenRadius: 0
      }
      points.forEach(point => {
        maxObj.maxWindLevel = maxObj.maxWindLevel > point.power ? maxObj.maxWindLevel : point.power
        maxObj.maxwindSpeed = maxObj.maxwindSpeed > point.speed ? maxObj.maxwindSpeed : point.speed
        maxObj.maxCenterPressure = maxObj.maxCenterPressure > point.pressure ? maxObj.maxCenterPressure : point.pressure
        maxObj.maxSevenRadius = maxObj.maxSevenRadius > point.radius7 ? maxObj.maxSevenRadius : point.radius7
        maxObj.maxTenRadius = maxObj.maxTenRadius > point.radius10 ? maxObj.maxTenRadius : point.radius10
      })
      // 台风最大数据为0的置为空
      if(maxObj.maxTenRadius == 0 || maxObj.maxTenRadius == null) {
          maxObj.maxTenRadius = '无'
      }
      if(maxObj.maxSevenRadius == 0 || maxObj.maxSevenRadius == null) {
          maxObj.maxSevenRadius = '无'
      }
      return maxObj
    },
    
    //重置线路选项
    clearLineLevelSelect(lineLevel, item) {
      console.log(item)
      this.lineLevel == item ? this.lineLevel = '' : this.lineLevel = item
    },
    //重置台风等级选项
    clearTyphoonLevelSelect(typhoonLevel, item) {
      console.log("%%%%%%",typhoonLevel,"****",item)
      this.typhoonLevel == item ? this.typhoonLevel = '' : this.typhoonLevel = item
    },
    //重置活跃周期选项
    clearTimeSelect(activeTime, item) {
      this.activeTime == item ? this.activeTime = '' : this.activeTime = item
    },

    // 重置台风预测路径绘制的位置
    resetForecastIndex() {
      // console.log("重置台风预测路径绘制的位置",this.tableFilterData)
      this.typhoonInfos.forEach(singleTyphoonInfo => {
        // this.tableFilterData.forEach(FilterTyphoon => {  
        //   if(FilterTyphoon._checked == false && FilterTyphoon.typhoonId == singleTyphoonInfo.typhoonId) {
             singleTyphoonInfo.forecastPointIndex = -1
          // }
        // })
        
      })
    },

    //线路等级(对应台风风级过滤)
    lineLevelFilter(){
      var arraytyphoonId = []  //存放符合条件的台风编号
      
    },

    //台风等级过滤 
    levelFilterResult() {
      var arraytyphoonId = []  //存放符合条件的台风编号
      for(var i = 0;i < this.typhoonOriginInfos.length; i++) {
        for(var j = 0;j < this.typhoonOriginInfos[i].points.length;j++) {
          if(this.typhoonOriginInfos[i].points[j].strong == this.typhoonLevel) {
            arraytyphoonId.push(this.typhoonOriginInfos[i].typhoonId)
            break;
          }
        }
      }
      return arraytyphoonId
    },

    //台风活跃周期过滤
    activeTimeFilterResult() {
      var arraytyphoonId = []  //存放符合条件的台风编号
      this.tableOriginData.forEach(singleTyphoonData => {
        var dayTime = singleTyphoonData.typhoonActiveTime.substring(0, singleTyphoonData.typhoonActiveTime.indexOf("天"))
        var dayHour = singleTyphoonData.typhoonActiveTime.substring(singleTyphoonData.typhoonActiveTime.indexOf("天"), singleTyphoonData.typhoonActiveTime.indexOf("小时"))
        if(dayHour > 0) {
          dayTime += 1
        }
        if("<=5天" == this.activeTime && (dayTime >= 0 && dayTime <= 5)) {
          arraytyphoonId.push(singleTyphoonData.typhoonId)
        } else if("5~7天" == this.activeTime && (dayTime > 5 && dayTime <= 7)) {
          arraytyphoonId.push(singleTyphoonData.typhoonId)
        } else if("7~10天" == this.activeTime && (dayTime > 7 && dayTime <= 10)) {
          arraytyphoonId.push(singleTyphoonData.typhoonId)
        } else if("10天以上" == this.activeTime && dayTime > 10) {
          arraytyphoonId.push(singleTyphoonData.typhoonId)
        }
      })
      return arraytyphoonId
    },

    typhoonLineTableFilterResult(){
      var wireLineLevelChoose = false
      // 遍历表格中台风的风力,找到符合对应线路等级的台风数据
      if(this.lineLevel != null && this.lineLevel != '') {
          // typhoonLineLevelFilter = this.lineLevelFilter()
          this.loading = true
          wireLineLevelChoose = true
          this.$axios.get('mock/test.json')
          .then(res => {
             this.tableSearchTyphoon(res)  //将查询到的台风数据填入表格
             this.reDrawTyphoon( res.data) //查询出的台风数据如果为活跃台风，则绘制活跃台风
          }).catch(e =>{
             console.log(e)
          })
      }else{
          this.searchTyphoon()
      }
    },

    // 台风筛选结果
    typhoonTableFilterResult() {
      var that = this
      var wireLineLevelChoose = false
      var levelChoose = false
      var timeChoose = false
      // var typhoonLineLevelFilter = [] // 存放满足台风等级条件的台风编号
      var typhoonLevelFilter = []  //存放满足 台风等级条件的台风编号
      var typhoonActiveTimeFilter = []  //存放满足台风活跃周期的台风编号
      var typhoonSet = []  //存放所有条件的过滤结果

      // 遍历表格中台风每个点的数据找到符合对应台风等级
      if(this.typhoonLevel != null && this.typhoonLevel != '') {
          levelChoose = true
          typhoonLevelFilter = this.levelFilterResult()
      }
      
      // 遍历表格中台风活跃周期找到符合选项的台风编号返回
      if(this.activeTime != null && this.activeTime != '') {
        timeChoose = true
        typhoonActiveTimeFilter = this.activeTimeFilterResult()
      }

      // 根据选项返回查找出的符合条件的台风编号
      if(levelChoose && timeChoose) {
        typhoonSet = this.concatArray(typhoonLevelFilter, typhoonActiveTimeFilter)
      } else if(levelChoose && !timeChoose) {
        typhoonSet = typhoonLevelFilter
      } else if(!levelChoose && timeChoose) {
        typhoonSet = typhoonActiveTimeFilter
      }
      
      // this.tableOriginData.forEach(OriginData => {
      //   if( that.tableFilterData .length >0 ){
      //     that.tableFilterData.forEach(FilterData => {
      //       if(OriginData.typhoonId == FilterData.typhoonId){
      //         FilterData._checked == OriginData._checked
      //       }
      //     })
      //   }
      //   console.log("原始表格数据",this.tableOriginData)
      // })

      // 从表格源数据中通过台风编号筛选出需要显示的台风
      this.tableFilterData = this.tableOriginData.filter(singleTyphoonData => {
        return typhoonSet.some(typhoonId => {

          if(typhoonId == singleTyphoonData.typhoonId) {
            return singleTyphoonData
          }

        });
      })

      // 如果没有做条件筛选则返回最初的结果
      if(this.typhoonLevel == '' && this.activeTime == '') {
        this.tableFilterData = this.tableOriginData
      }
      
      //重置typhoonInfos的值，用于重绘最新数据的台风
      if(this.typhoonOriginInfos.length > 0) {
        this.typhoonInfos = this.typhoonOriginInfos.filter(singleTyphoonInfo => {
          return this.tableFilterData.some(singleTyphoonData => {
            return singleTyphoonData.typhoonId == singleTyphoonInfo.typhoonId
          });
        })
      }
      this.clearMapTyphoon()  //根据表格数据重绘台风
      this.resetForecastIndex()  //重置台风预测路径绘制的位置
      this.reDrawTyphoon(this.typhoonInfos)
    },
 
    //is_current=1 重绘台风
    reDrawTyphoon(typhoonInfos){
      var that = this
       typhoonInfos.forEach(typhoonInfo => {
        if(typhoonInfo.is_current == 1){
          that.addTyphoon(typhoonInfo)
        }
      })
    },

    //数组合并找到重复部分
    concatArray(typhoonLevelFilter, typhoonActiveTimeFilter) {
      let newArr = Array.prototype.concat(typhoonLevelFilter, typhoonActiveTimeFilter)  //合并生成的新数组
      var tmp = []
      newArr.sort().sort(function (a,b) {
        if(a === b && tmp.indexOf(a) === -1){
          tmp.push(a)
        }
      })
      if(tmp.length != 0) {
        //如果有重复数据则返回
        return tmp
      } else {
        //若两个条件均选择后无重复数据则没有符合条件的台风
        return []
      }
    },

    // 通过表格条件筛选结果（重绘选中台风前）清除地图中的台风要素
    clearMapTyphoon() {
      var that = this
      //暂存pointVectorLayer里的杆塔点
      var featurebuffers = this.pointVectorLayer.features.filter(data => {
          return data.hasOwnProperty('NAME')
      })

      this.lineVectorLayer.removeAllFeatures()
      this.pointVectorLayer.removeAllFeatures()
      this.foreLineLayer.removeAllFeatures()
      this.map.removePopup(this.hoverFeaturePop);//移除信息框
      this.map.removePopup(this.featurePop);
      this.markerlayer.removeMarker(this.marker)  //删除已经显示的台风gif
      this.typhoonCircleVector.removeAllFeatures()  //删除台风风圈
      
      // 重绘杆塔点数据
      featurebuffers.forEach(item =>{
         this.pointVectorLayer.addFeatures(item)
      })
 
    },

    // 获得当前高亮行数据
    getRowData(currentRow, oldCurrentRow) {
      this.currentRowData = currentRow
    },

    // 选中项发生变化绘制选中台风
    selectRow(selection) {
      //暂存pointVectorLayer里的杆塔点
      var featurebuffers = this.pointVectorLayer.features.filter(data => {
          return data.hasOwnProperty('NAME')
      })
      // console.log("杆塔&&&：",featurebuffers)

      this.lineVectorLayer.removeAllFeatures()
      this.pointVectorLayer.removeAllFeatures()
      this.foreLineLayer.removeAllFeatures()

      // 重绘杆塔点数据
      featurebuffers.forEach(item =>{
         this.pointVectorLayer.addFeatures(item)
      })
      this.pointTyphoonArray = []
      this.typhoonSelectInfos = []
      var that = this
      selection.forEach(singleTyphoonInfo => {
        that.typhoonInfos.some(typhoonData => {
          if(singleTyphoonInfo.typhoonId == typhoonData.typhoonId) {
            // typhoonData.isShow = true
            that.typhoonSelectInfos.push(typhoonData)  //打勾显示的台风
            that.addTyphoon(typhoonData)
            return true
          }
        })
      })

    },

    //取消选中某一项时触发,将对应打开风圈的台风删除
    clearFeature(selection, row) {
      if(this.nowFeature.typhoonId == row.typhoonId) {
        this.typhoonInfos.some(singleTyphoonInfo => {
          if(row.typhoonId == singleTyphoonInfo.typhoonId) {
            singleTyphoonInfo.forecastPointIndex = -1
            return true
          }
        })
        this.clearMapTyphoon()  // 通过表格条件筛选结果（重绘选中台风前）清除地图中的台风要素
      }
    },

    //取消全选时触发 
    clearAll(selection) {
      this.resetForecastIndex()  //重置台风预测路径绘制的位置
      this.clearMapTyphoon()  // 通过表格条件筛选结果（重绘选中台风前）清除地图中的台风要素
    },




/**
 * 台风初始化、创建、删除、样式
 */
    //初始化图层控件
    otherInit() {
      let _self = this;
      this.drawPoint = new SuperMap.Control.DrawFeature( this.elementVector,SuperMap.Handler.Point, { multi: true });
      this.drawLine = new SuperMap.Control.DrawFeature(this.elementVector,SuperMap.Handler.Path, { multi: true });
      this.drawPolygon = new SuperMap.Control.DrawFeature(this.elementVector,SuperMap.Handler.Polygon );
      this.drawPoint.events.on({ featureadded: this.drawPointCompleted });
      this.drawLine.events.on({ featureadded: this.drawLineCompleted });
      this.drawPolygon.events.on({ featureadded: this.drawPolygonCompleted });
      this.selectControl = new SuperMap.Control.SelectFeature(
        this.pointVectorLayer,
        {
          onSelect: this.onFeatureSelect,
          //鼠标移动事件
          callbacks: {
            over: f => {
              // console.log(f)
              if(f.hasOwnProperty("typhoonId")){
                f.style.pointRadius = 6;
                _self.pointVectorLayer.redraw();
              }
              _self.setHoverFeaturePop(f)
            },
            out: f => {
              _self.pointVectorLayer.features.forEach(val => {
                if(val.hasOwnProperty("typhoonId"))
                   val.style.pointRadius = 3.5}
                );
              _self.pointVectorLayer.redraw();
              _self.map.removePopup(_self.hoverFeaturePop);
            }
          }
        });
    },

    //绘制所有台风路径
    addTyphoonFeatures() {
      this.pointTyphoonArray = []
      this.typhoonInfos.forEach(singleTyphoonInfo => {
          if(singleTyphoonInfo.is_current == 1) {
            this.addTyphoon(singleTyphoonInfo)  //添加一条台风
            // this.showMajorInfos(singleTyphoonInfo)  //显示台风详细数据
          }
      });
      // this.addFinalVectorForecast()
    },

    //添加某一条台风路径
    addTyphoon(singleTyphoonInfo) {
      var that = this
      var typhoonPathPoints = []; //台风路径的点数据
      var pointVector;
      var pointBuffer;
      var pointVectors = [];
      var pointBuffers = [];
      var time = ''
      singleTyphoonInfo.points.forEach((pathPoint, index) => {
        pointBuffer = new SuperMap.Geometry.Point(
          pathPoint.longitude,
          pathPoint.latitude
        );
        pathPoint.index = index;
        pathPoint.typhoonId = singleTyphoonInfo.typhoonId;
        pathPoint.typhoonName =  singleTyphoonInfo.typhoonName;
        time = pathPoint.time.substring(5).replace(/(\d\d)-(\d\d)T(\d\d).*/, "$1月$2日$3时")        
        pointVector = new SuperMap.Feature.Vector(pointBuffer, {
          "历史时间:": time,
          "经纬坐标:": pathPoint.longitude + "E/" + pathPoint.latitude + "N",
          "中心气压:": pathPoint.pressure + "百帕",
          "风速风级:": pathPoint.speed + "米/秒 , " +  pathPoint.power  + "级", 
          "移速移向:": (pathPoint.move_speed != null ? pathPoint.move_speed : '') +  "公里/小时 , " +  (pathPoint.move_dir != null ? pathPoint.move_dir : ''),
          "风圈半径:": pathPoint.radius7 != null ? ("东北" + "  " + "东南" + "  " + "西南" + "  " + "西北") : '',
          "7级风圈:": pathPoint.radius7 != null && pathPoint.radius7 != 0 ? this.radius_quad(pathPoint.radius7_quad) + "<span>(KM)</span>" : '',
          "10级风圈:": pathPoint.radius10 != null && pathPoint.radius10 != 0 ? this.radius_quad(pathPoint.radius10_quad) + "<span>(KM)</span>" : ''
        });
        pointVector.radius7_quad = pathPoint.radius7_quad
        pointVector.radius10_quad = pathPoint.radius10_quad
        pointVector.style = this.setPointStyle(pathPoint.speed, index, singleTyphoonInfo.typhoonId, singleTyphoonInfo.typhoonName);
        pointVector.index = index;
        pointVector.typhoonId = singleTyphoonInfo.typhoonId;
        pointVector.typhoonName =  singleTyphoonInfo.typhoonName;
        pointVector.isShowForePath = false;
        //将各点矢量添加到pointVectors数组中，待添加线后在遍历点的数组
        pointVectors.push(pointVector);
        pointBuffers.push(pointBuffer);
      });

      var linePathVector = this.setLineVector(pointBuffers);
      linePathVector.typhoonId = singleTyphoonInfo.typhoonId;
      this.lineVectorLayer.addFeatures([linePathVector]);
      pointVectors.forEach(item => {
        that.pointVectorLayer.addFeatures(item);
      });
      this.pointTyphoonArray.push(pointVectors)

      //初始化台风添加预测路径
      if(singleTyphoonInfo.forecastPointIndex == -1) {
        var length = pointVectors.length;
        var finalVector = pointVectors[length - 1];
        // finalVector.isShowForePath = true;
        this.addforecastPaths(finalVector);
        // this.finalVectors.push(finalVector);
        // console.log(this.typhoonInfos)
      } else {
        var feature = pointVectors[singleTyphoonInfo.forecastPointIndex];
        // feature.isShowForePath = true;
        this.addforecastPaths(feature);
      }
      // console.log(this.finalVectors)
    },
    
    //弹窗台风风圈数据添加
    radius_quad(radius) {
      var str = ''
      for(var attr in radius) {
        str += "<span class='radius_qual'>" + radius[attr] + "</span>"
      }
      return str
    },

    //根据台风风速设置台风点的样式(同时在台风起点设置台风名字)
    setPointStyle(speed, index, typhoonId , name) {
      var radius = 3.5,
        color;
      var style = {};
      if (speed < 17.2) {
        color = "#efb796";
      } else if (speed >= 17.2 && speed <= 24.4) {
        color = "#0062fe";
      } else if (speed >= 24.5 && speed <= 32.6) {
        color = "yellow";
      } else if (speed >= 32.7 && speed <= 41.4) {
        color = "#f072f6";
      } else if (speed >= 41.5 && speed <= 50.9) {
        color = "#fd5c1c";
      } else if (speed >= 51) {
        color = "#fd0026";
      }
      if(index == 0) {
        style = {
          "fillColor": color,
          "pointRadius": radius,
          "strokeOpacity": 0.8,
          "label": typhoonId + name,
          "fontColor": "red",
          "fontFamily": "宋体",
          "fontSize": "1.2em",
          "fontWeight": "bold",
          "labelXOffset": 46
        };
      }else{
        style = {
          fillColor: color,
          pointRadius: radius,
          strokeOpacity: 0.8
        };
      }
      return style;
    },

    //设置台风实际路径的线样式
    setLineVector(points) {
      var line = new SuperMap.Geometry.LineString(points);
      var linecVector = new SuperMap.Feature.Vector(line);
      linecVector.style = {
        //设置台风颜色
        strokeColor: "#d23e3e",
        //设置台风线条宽度
        strokeWidth: 2
      };
      return linecVector;
    },

    //列表打勾台风显示详细数据(已注释)
      showMajorInfos(singleTyphoonInfo) {
        // if(singleTyphoonInfo.isShow) {
        //     this.typhoonMajorInfos.push(singleTyphoonInfo)
        // } else {
        //     this.typhoonMajorInfos = this.typhoonMajorInfos.filter(isShowTyphoon => {
        //         if(isShowTyphoon.isShow) {
        //             return isShowTyphoon
        //         }
        //     })
        // }
        // console.log(this.typhoonMajorInfos)
    },

/**
 * 预测台风路径
 */
    //在台风最后一个点绘制预报台风路径(已注释)
      addFinalVectorForecast() {
      // this.foreLineLayer.removeAllFeatures();
      // this.forePointLayer.removeAllFeatures();

      // this.finalVectors.forEach(pointFeature => {
      //     pointFeature.isShowForePath = true
      // })
      // this.finalVectors.forEach(item => {
      //   this.addforecastPaths(item);
      // });
    },

    //添加feature所在的台风预报路径
    addforecastPaths(feature) {
      //该feature上的所有的预报机构对应预报路径（所在的点的索引）
      var forecastList = this.allForecastLine(feature);
      for (var attr in forecastList) {
        if (forecastList[attr] != -1) {
          //找到当前feature所在台风
          var selectTyphoonInfo = this.typhoonInfos.filter(function(selectTyphoonInfo) {
            return selectTyphoonInfo.typhoonId == feature.typhoonId;
          });
          //找到找到feature的预测点索引在台风路径中对应的点
        
          var point = selectTyphoonInfo[0].points.filter(function(point) {
            return point.index == forecastList[attr];
          });
          //找到预测路径中对应预报机构
        
          var forecast = point[0].forecast.filter(function(forecast) {
            return forecast.sets == attr;
          });

          //调用addforecastPath(startPoint,forecast)方法绘制台风路径
          this.typhoonOrg.forEach(singleOrg => {
            if(singleOrg.isOrgChecked && (forecast[0].sets == singleOrg.orgName)) {
              this.addforecastPath(point[0],forecast[0])
            }
          })
        }
      }
    },

    //添加其他台风需要显示的的预报台风路径
    addOtherForecastPaths() {
      this.pointVectorLayer.features.forEach(pointFeature => {
        if(pointFeature.isShowForePath) {
          this.addforecastPaths(pointFeature)
        }
      })
    },

    // 绘制单条预报路径
    addforecastPath(startPoint, forecast) {
      var forePointVectors = [];
      //点串数组
      var buffers = [];
      //预测路径的起点
      var startPointGeo = new SuperMap.Geometry.Point(
        startPoint.longitude,
        startPoint.latitude
      );
      //将起点放到点串的第一个位置
      buffers.push(startPointGeo);
      forecast.points.forEach(forePoint => {
        var buffer = new SuperMap.Geometry.Point(
          forePoint.longitude,
          forePoint.latitude
        );
        //创建预测点的Feature
        var time = forePoint.time.substring(5).replace(/(\d\d)-(\d\d)T(\d\d).*/, "$1月$2日$3时")
        var forePointVector = new SuperMap.Feature.Vector(buffer, {
          "中心位置:": forePoint.longitude + "E/" + forePoint.longitude + "N",
          "风速风级:": ( forePoint.speed != null ? forePoint.speed : '' ) + "公里/小时 , " + forePoint.power + "级",
          "中心气压:": ( forePoint.pressure != null ? forePoint.pressure : '' ) + "百帕"
        });
        //预测点的样式
        forePointVector.style = this.setPointStyle(forePoint.speed);
        //将点feature添加到layer上
        forePointVector.typhoonName = startPoint.typhoonName
        forePointVector.foreTime = time
        //   console.log(forePointVector)
        forePointVector.sets = forecast.sets
        // console.log(forePointVector)
        forePointVector.forecast = "isForecast"  //设置预测路径属性,区别实际路径
        buffers.push(buffer);
        forePointVectors.push(forePointVector);
      });
      //创建预测路径线对象
      var line = new SuperMap.Geometry.LineString(buffers);
      var foreLineVector = new SuperMap.Feature.Vector(line);
      //设置预测路径线的样式
      foreLineVector.style = this.setForeLineStyle(forecast.sets);
      //给预测路径添加sets属性
      foreLineVector.sets = forecast.sets;
      foreLineVector.typhoonId = startPoint.typhoonId;
      this.foreLineLayer.addFeatures(foreLineVector);
      forePointVectors.forEach(forePointVector => {
        // this.forePointLayer.addFeatures(forePointVector);
        this.pointVectorLayer.addFeatures(forePointVector);
        forePointVector.typhoonId = startPoint.typhoonId;
      });
    },
    
    //移除台风路径上面对应的预测路径
    removeForeFeatures(feature){
      //删除对应的台风预报点，保留其他点
      // var pointVector = this.forePointLayer.features.filter(function(pointVector){
        var pointVector = this.pointVectorLayer.features.filter(function(pointVector){
          if(pointVector.typhoonId == feature.typhoonId && pointVector.hasOwnProperty("forecast")) {
            
          } else {
            return pointVector
          }
      })
      //删除对应的台风预报线，保留其他线
      var lineVector = this.foreLineLayer.features.filter(function(lineVector){
         if(lineVector.typhoonId == feature.typhoonId) {

          } else {
            return lineVector
          }
      }) 

      //删除所有点
      this.pointVectorLayer.removeAllFeatures()

      //添加需要保留的点
      pointVector.forEach(point => {
        this.pointVectorLayer.addFeatures(point)  
      })

      //删除所有线
      this.foreLineLayer.removeAllFeatures()
      //添加保留的线
      lineVector.forEach(line => {
        this.foreLineLayer.addFeatures(line)  
      })

      //删除预测路径同时将台风最后一个点上对应预测路径也删除
      // this.finalVectors = this.finalVectors.filter(finalFeature => {
      //   if(finalFeature.typhoonId == feature.typhoonId) {

      //   } else {
      //     return finalFeature
      //   }
      // })
    },

    //设置预测台风路径的样式
    setForeLineStyle(country) {
      var style;
      this.typhoonOrg.some(forecastLineItem => {
        if(forecastLineItem.orgName == country) {
          style = {
            //设置线条颜色
            strokeColor: forecastLineItem.lineStyle.substring(6),
            //设置台风线条宽度
            strokeWidth: 1.6,
            strokeDashstyle: "dash",
            strokeOpacity: 0.8
          };
          return true
        }
      })
      return style;
    },

/**
 * 预测路径显示控制
 */
    //赋值初始预测路径是否显示数据(true or false,默认全为true)
    forecastShow(data) {
      this.typhoonOrg = data.typhoonOrg
      data.typhoonOrg.forEach(dataItem => {
        this.forecastCountries.push(dataItem.orgName)
      })
    },
    //单选控制预测路径显示隐藏
    singleForcastUpdate(data) {
        var line = []
        var point = []
        this.org = data.singleOrgChecked
        var that = this
        this.typhoonOrg.filter(singleOrg => {
          if(singleOrg.orgName == data.orgName) {
            singleOrg.isOrgChecked = data.isOrgChecked
          }
        })
        if(!this.org.isOrgChecked){  //是否单选
            //删除预测路径线
            line = this.foreLineLayer.features.filter(lineFeature => {
                if(lineFeature.sets == this.org.orgName) {

                } else{
                    return lineFeature  //返回保留线
                }   
            })
            this.foreLineLayer.removeAllFeatures()
            line.forEach(lineFeature => {
                this.foreLineLayer.addFeatures(lineFeature)
            })

            //删除预测路径点
            point = this.pointVectorLayer.features.filter(pointFeature => {
                if(pointFeature.sets == this.org.orgName && pointFeature.hasOwnProperty("forecast")) {
                    
                }else{
                    return pointFeature  //返回保留点
                }   
            })
            this.pointVectorLayer.removeAllFeatures()
            point.forEach(pointFeature => {
                this.pointVectorLayer.addFeatures(pointFeature)
            })
        } 
        else {
            // 遍历每个台风上面的预测点索引
            console.log("this.typhoonSelectInfos",this.typhoonSelectInfos)
            console.log("this.pointTyphoonArray",this.pointTyphoonArray)
            this.typhoonSelectInfos.forEach((singleTyphoonInfo, index) => {
              var points = that.pointTyphoonArray[index]
              var feature = {}
              // 索引值为-1则是该台风最后一个点上绘制预测路径，否则在对应索引值的点上绘制预测路径
              if(singleTyphoonInfo.forecastPointIndex == -1) {
                var len = points.length;
                feature = points[len - 1]
              } else {
                feature = points[singleTyphoonInfo.forecastPointIndex]
              }
              this.addforecastPaths(feature)
            })
        }
    },
    
    //全选控制预测路径显示隐藏
    allForecastupdate(data) {
        var that = this
        var line = []
        var point = []
        this.isAllOrgChecked = data.isAllOrgChecked;
        this.typhoonOrg = data.typhoonOrg

        if(this.isAllOrgChecked) {  //是否全选
            that.typhoonSelectInfos.forEach((singleTyphoonInfo, index) => {
              var points = that.pointTyphoonArray[index]
              var feature = {}
              if(singleTyphoonInfo.forecastPointIndex == -1) {
                feature = points[points.length -1]
              } else {
                feature = points[singleTyphoonInfo.forecastPointIndex]
              }
              that.addforecastPaths(feature)
            })
        } else {
          this.foreLineLayer.removeAllFeatures()
          // this.forePointLayer.removeAllFeatures()
          // 找出所有预测路径上的点并删除
          var point =  this.pointVectorLayer.features.filter(pointFeature => {
            if(!pointFeature.hasOwnProperty("forecast")) {
              return pointFeature
            }
          })
          this.pointVectorLayer.removeAllFeatures()
          point.forEach(pointFeature => {
            that.pointVectorLayer.addFeatures(pointFeature)
          })
        }
    },

/**
 * 台风事件
 */
    
    //显示、隐藏台风真实路径(已注释)
      isShowPath(singleTyphoonInfo){
      // if(singleTyphoonInfo.isShow) {
      //     this.addTyphoon(singleTyphoonInfo)  //打勾添加该台风，否则删除
      // } else {
      
      //     var line = []
      //     var points = []
      //     // //filter找到对应编号的需要删除台风线,返回剩余线以提高删除效率
      //     line = this.lineVectorLayer.features.filter(lineFeature => { 
      //         if(lineFeature.typhoonId == singleTyphoonInfo.typhoonId) {
      //             this.removeForeFeatures(lineFeature);  //删除台风同时删除预测路径
      //         } else { 
      //             return lineFeature
      //         }
      //     })
      //     this.lineVectorLayer.removeAllFeatures()
      //     //遍历需要重新添加的线并添加
      //     line.forEach(lineFeature => {
      //         this.lineVectorLayer.addFeatures(lineFeature)  
      //     })

      //     //filter找到对应编号的需要删除台风点,返回剩余点以提高删除效率
      //     points = this.pointVectorLayer.features.filter(pointFeature => {
      //         if(pointFeature.typhoonId == singleTyphoonInfo.typhoonId) {
                
      //         } else {
      //             return pointFeature
      //         }
      //     })
      //     this.pointVectorLayer.removeAllFeatures()
      //     //遍历需要重新添加的点并添加
      //     points.forEach(pointFeature => {
      //         this.pointVectorLayer.addFeatures(pointFeature)  
      //     })

      //     //同时将之前点击的nowFeature置为false
      //     if(this.nowFeature != "" && this.nowFeature != null) {
      //       if(singleTyphoonInfo.typhoonId == this.nowFeature.typhoonId) {
      //         this.nowFeature.isShowForePath = false
      //         this.map.removePopup(this.featurePop);  //关闭已经打开的窗口
      //         this.map.removePopup(this.hoverFeaturePop);
      //         this.markerlayer.removeMarker(this.marker)  //删除已经显示的台风gif
      //         this.typhoonCircleVector.removeAllFeatures()  //删除台风风圈
      //       }
      //     }
      // }
    },

    //点击全选控制所有台风显示、隐藏(已注释)
      selectAllTyphoon() {
      // if(this.isTyphoonListAllSelect) {
      //     this.typhoonInfos.forEach(singleTyphoonInfo => {  //遍历所有台风,为false的台风全部添加
      //         if(!singleTyphoonInfo.isShow)
      //         {
      //             singleTyphoonInfo.isShow = true
      //             this.addTyphoon(singleTyphoonInfo)
      //             // this.showMajorInfos(singleTyphoonInfo)
      //         }
      //     })
      // }
      // else {
      //       this.typhoonInfos.forEach(singleTyphoonInfo => {  //所有台风置为false不显示
      //         singleTyphoonInfo.isShow = false
      //         //同时将之前点击的nowFeature置为false
      //         if(this.nowFeature != "" && this.nowFeature != null) {
      //           if(singleTyphoonInfo.typhoonId == this.nowFeature.typhoonId) {
      //             this.nowFeature.isShowForePath = false
      //           }
      //         }
      //         this.isShowPath(singleTyphoonInfo)
      //         // this.showMajorInfos(singleTyphoonInfo)
      //     }) 
      // }
    },

    // 台风point选中事件
    onFeatureSelect(feature) {
      if(!feature.hasOwnProperty("forecast") && !feature.hasOwnProperty("NAME")) {  //点击的实际路径上的点
          this.nowFeature = feature  //赋值当前点击feature给nowFeature
          // 点击实际路径上的点把点的索引存在这条台风上用于显示预测路径
          this.typhoonInfos.some(singleTyphoonInfo => {
            if(singleTyphoonInfo.typhoonId == feature.typhoonId) {
              singleTyphoonInfo.forecastPointIndex = feature.index
              return true
            }
          })
          this.addTyphoonGif(feature)  //添加台风Gif图片
          this.removeForeFeatures(feature);
          this.addforecastPaths(feature);
          //绘制风圈
          this.createOval(feature)
          //移除信息框
          this.map.removePopup(this.featurePop)
          // 弹出实际点信息框
          this.setFeaturePop(feature)
      } 
      // else{
      //   //预测路径点
      //   this.map.removePopup(this.hoverFeaturePop)
      //   this.setFeaturePop(feature)
      // }
    },
    // 点击实际点feature信息框
    setFeaturePop(feature){
      // typhoonTitle = feature.typhoonName
      // this.featurePop = new SuperMap.InfoWindow("feature","台风:" + feature.typhoonName)
      if(!feature.hasOwnProperty('forecast')){
        this.featurePop = new SuperMap.InfoWindow("feature" , feature.typhoonId + ' ' + feature.typhoonName)
        $(function(){
          $('.pop-hide').css('opacity', 1)
        })
        this.featurePop.contentSize = new SuperMap.Size(235, 185);
      }
      //点击预报点
      // else{
      //   this.featurePop = new SuperMap.InfoWindow("feature","预报详情("+feature.typhoonName + ')')
      //   this.featurePop.contentSize = new SuperMap.Size(215, 123)
      // }
      this.featurePop.titleBox = true;
      this.featurePop.render();
      this.featurePop.show(null, feature);
      var lonLat = new SuperMap.LonLat(feature.geometry.x, feature.geometry.y);
      this.featurePop.setLonLat(lonLat, { x: 0, y: 0 });
      //添加弹窗到map图层
      this.map.addPopup(this.featurePop);
    },

    // 鼠标hover显示信息框
    setHoverFeaturePop(feature){
      if(feature.hasOwnProperty('forecast')){
        // console.log(feature)
        this.hoverFeaturePop = new SuperMap.InfoWindow("feature" , feature.sets + " &nbsp&nbsp" +  feature.foreTime +  "<span style='font-size: 10px;font-weight: normal'>&nbsp预报</span>")
        this.hoverFeaturePop.contentSize = new SuperMap.Size(235, 67)
      }
      else if(feature.hasOwnProperty('NAME')){
        this.hoverFeaturePop = new SuperMap.InfoWindow("feature" ,feature.NAME)
        this.hoverFeaturePop.contentSize = new SuperMap.Size(170, 130)
      }else{
        this.hoverFeaturePop = new SuperMap.InfoWindow("feature" , feature.typhoonId + " " +feature.typhoonName)
        this.hoverFeaturePop.contentSize = new SuperMap.Size(235, 185)
      }
      this.hoverFeaturePop.titleBox = true
      this.hoverFeaturePop.render()
      this.hoverFeaturePop.show(null, feature)
      var lonLat = new SuperMap.LonLat(feature.geometry.x, feature.geometry.y)
      this.hoverFeaturePop.setLonLat(lonLat, { x: 0, y: 0 })
      //添加弹窗到map图层
      this.map.addPopup(this.hoverFeaturePop)
    },

    // 点击添加台风gif  
    addTyphoonGif(feature) {  
      this.markerlayer.removeMarker(this.marker)
      var size = new SuperMap.Size(44, 33);
      var offset = new SuperMap.Pixel(-(size.w / 2), -16);
      var icon = new SuperMap.Icon('image/typhoonGIF.gif', size, offset);
      this.marker = new SuperMap.Marker(new SuperMap.LonLat(feature.geometry.x, feature.geometry.y), icon);
      this.markerlayer.addMarker(this.marker);
      $(".olAlphaImg").parent().parent().css("z-index", 390)
      // nowFeature切换之后将具有nowFeature线上的其他点置为false，不显示预测路径
      // this.finalVectors.filter(finalFeature => {
      //   if(finalFeature.typhoonId == this.nowFeature.typhoonId) {
      //     finalFeature.isShowForePath = false
      //   }
      // })
      // this.removeForeFeatures(feature);
      // this.addforecastPaths(feature);
    },

    //点击台风详情在对应台风点上打开窗口(已注释)
      clickMajorInfos(infoItem, typhoonId) {
      // this.featurePop.destroy()  //关闭已经打开的窗口
      // var feature = {}
      // feature = this.pointVectorLayer.features.filter(pointFeature => {
      //     if(pointFeature.index == infoItem.index && pointFeature.typhoonId == typhoonId) {
      //         return pointFeature
      //     }
      // })
      // this.onFeatureSelect(feature[0])
    },

    // 返回选中点所有预测路径(addforecastPath(feature)方法调用)
    allForecastLine(feature) {
      var forecastList = {}; //该点所有预测路径以及编号
      var isAllForecast = false;
      this.typhoonInfos.some(singleTyphoonInfo => {
        if (singleTyphoonInfo.typhoonId == feature.typhoonId) {
          //遍历找到台风编号和当前点击点所属台风一致
          //若当前点击点预测路径不为空,遍历预测信息并添加到forecastList
          if (
            singleTyphoonInfo.points[feature.index].forecast != null && singleTyphoonInfo.points[feature.index].forecast != ""
          ) {
            singleTyphoonInfo.points[feature.index].forecast.forEach(
              forecast => {
                forecastList[forecast.sets] = feature.index; //对应预测机构做出的预测在该点的索引值
              }
            );
          }

          //遍历预测机构数组将forecastList中不存在的预测机构赋值为-1
          this.forecastCountries.forEach(forecastItem => {
            if (!forecastList.hasOwnProperty(forecastItem)) {
              forecastList[forecastItem] = -1;
            }
          });

          for (var i = feature.index - 1; i >= 0; i--) {
            //遍历选中点之前的点
            if (!isAllForecast) {
              //是否找到所有预测机构的预测信息
              while(singleTyphoonInfo.points[i].forecast == null && i >=0) {
                //如果该点预测数据为空则找上一个点
                i--
              }
              singleTyphoonInfo.points[i].forecast.forEach(forecast => {
                //遍历之前的点的预测信息
                for (var attr in forecastList) {
                  if (forecastList[attr] == -1 && attr == forecast.sets) {
                    //若该预测机构和i点预测机构一致且值为-1则将i点该预测机构索引i赋值
                    forecastList[forecast.sets] = i;
                  }
                }
              });
              //遍历forecastList看预测机构是否全部都赋值，即预测路径全部找到
              for (var attr in forecastList) {
                var count = 0;
                if (forecastList[attr] != -1) {
                  count++;
                  continue;
                }
                if (count == 7 || i == 0) {
                  //预测机构数量为7或者已经遍历完所有点则跳出循环
                  isAllForecast = true;
                }
              }
            } else {
              break; //找到所有预测信息结束循环
            }
          }
          return true; //找到选中点所属台风之后结束循环,否则遍历继续寻找选中点是哪个台风
        }
      });
      return forecastList;
    },
    
    // 绘制台风风圈
    createOval(feature) {
      //点击绘制该点台风风圈
      this.typhoonCircleVector.removeAllFeatures()
      var origion = new SuperMap.Geometry.Point(feature.geometry.x, feature.geometry.y);
      var sides = 30
      for(var attr in feature.radius7_quad) {
        if(feature.radius7_quad[attr] != null && feature.radius7_quad[attr] > 0) {
          var angle = 0
          var direction = ""
          if(attr == "ne") {
              angle = 0
              direction = "东北"
            } else if(attr == "se") {
              angle = 270
              direction = "东南"
            } else if(attr == "sw") {
              angle = 180
              direction = "西南"
            } else if(attr == "nw") {
              angle = 90
              direction = "西北"
          }
        
          var cuvre = SuperMap.Geometry.Polygon.createRegularPolygonCurve(origion, feature.radius7_quad[attr] / 110, sides, 90, angle);
          var cuvreVector = new SuperMap.Feature.Vector(cuvre);
          cuvreVector.style = {
            fillColor: "rgb(118, 201, 177)",
            stroke: false,
            fillOpacity: 0.8,
          }
          this.typhoonCircleVector.addFeatures(cuvreVector)
        }
      }

      for(var attr in feature.radius10_quad) {
        if(feature.radius10_quad[attr] != null && feature.radius10_quad[attr] > 0) {
          var angle = 0
          var direction = ""
          if(attr == "ne") {
              angle = 0
              direction = "东北"
            } else if(attr == "se") {
              angle = 270
              direction = "东南"
            } else if(attr == "sw") {
              angle = 180
              direction = "西南"
            } else if(attr == "nw") {
              angle = 90
              direction = "西北"
          }
        
          var cuvre = SuperMap.Geometry.Polygon.createRegularPolygonCurve(origion, feature.radius10_quad[attr] / 110, sides, 90, angle);
          var cuvreVector = new SuperMap.Feature.Vector(cuvre);
          cuvreVector.style = {
            fillColor: "rgb(144, 204, 143)",
            stroke: false,
            fillOpacity: 0.8,
          }
          this.typhoonCircleVector.addFeatures(cuvreVector)
        }
      }
    },
    
    //按下回车键触发事件
    searchWire(){
      console.log(this.wireInput)
      if(this.wireInput == null || this.wireInput == "") {
        alert("请输入线路名称！")
      }else{
        this.loading = true 
        $("#searchInputUL li").css("display","none")
        this.$axios.get('mock/test.json')
        //参数，开始年startYear，结束年 endYear
        .then(res => {
          this.tableSearchTyphoon(res)
          this.reDrawTyphoon( res.data) //查询出的台风数据如果为活跃台风，则绘制出台风
        }).catch(e => {
          console.log(e)
        })
      }
    },

    //线路名称模糊查询 
    getWireName(inputData){
      $("#searchInputUL li").css("display","none")
      this.wireInput = inputData;
      this.loading = true
      this.$axios.get('mock/test.json')
         //参数，开始年startYear，结束年 endYear
     .then(res => {
        
        this.tableSearchTyphoon(res)
        this.reDrawTyphoon( res.data) //查询出的台风数据如果为活跃台风，则绘制出台风
      }).catch(e => {
        console.log(e)
      })
      // alert( this.wireInput)
    },

    //导出预报路径数据
    exportForeExcel(){
      console.log("预报路径导出")
    },
    
    //导出实际路径数据
    exportActualExcel() {
      this.downloadLoading = true;
      require.ensure([], () => {
         const {export_json_to_excel} = require('../../excel/Export2Excel') //这个地址和页面的位置相关，这个地址是Export2Excel.js相对于页面的相对位置
         var titles = [];
         var keys = [];
         for(var i=0,len = this.columns1.length;i<len;i++){
              if(i != 0 && i != 1){
                titles.push( this.columns1[i].title)
                keys.push(this.columns1[i].key)
              }
         }
         const tHeader = titles; //这个是表头名称 可以是iveiw表格中表头属性的title的数组
         const filterVal = keys; //与表格数据配合 可以是iview表格中的key的数组
         const list = this.tableFilterData; //表格数据，iview中表单数据也是这种格式！
         
         const data = this.formatJson(filterVal, list)
         export_json_to_excel(tHeader, data, '实况路径数据excel') //列表excel  这个是导出表单的名称
         this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
  },

  // 获取线路站点的矢量元素
  getWireStation(){
    var that = this
    Bus.$on("getWireStation",data => {
      data.wirePointVectors.forEach(item => {
        that.pointVectorLayer.addFeatures(item)
        // that.wireVectorBuffers
      })
    })
  },
  //清除线路图层
  clearWirePath(){
    var that = this;
    Bus.$on("clearWirePath",data => {
      var features=[];
      // that.pointVectorLayer.removeFeatures(item)
      // console.log( that.pointVectorLayer)G
      var features = that.pointVectorLayer.features.filter(pointVector => {
          return  pointVector.hasOwnProperty('NAME')
      })
      
      features.forEach(item => {
        that.pointVectorLayer.removeFeatures(item)
      })
      
    })
  }
  },
  mounted() {
    this.otherInit();
    this.getWireStation();
    this.clearWirePath();
    this.$axios.get('mock/wireName.json')
    .then(res => {
       this.wireNames = res.data
    }).catch(e => {
       console.log(e)
    })
  },
  //监视线路输入框内容的变化，并匹配下拉框内容
  computed:{
    NewItems() {
      var _this = this;
      var NewItems = [];
      if(this.wireInput != ""){
        this.wireNames.map(function(item) {
          if (item.NAME.search(_this.wireInput) != -1) {
            NewItems.push(item);
          }
        });
        if(NewItems.length != 0){
          $("#searchInputUL li").css("display","block")
        }else{
          $("#searchInputUL li").css("display","none")
        }
      }
      // console.log(NewItems)
      return NewItems;
    },
  },
  created() {
    this.mockData();
  }
};
</script>

<style scoped>

.fadeAni-enter-active, .fadeAni-leave-active {
  transition: all .38s cubic-bezier(0.69, -0.39, 0.88, 0.74);
}
.fadeAni-enter, .fadeAni-leave-to  {
  transform: translateX(-50%) scale(.3);
  opacity: 0
}

#panel {
  position: absolute;
  left: 15px;
  top: 60px;
  width: 50%;
  height: calc(100% - 100px);
  min-width: 700px;
  overflow: auto;
  border-radius: 4px;
  z-index: 10;
  color: black;
  background-color: #f8f8f8;
  box-shadow: 0 0 20px #aaa;
}

/* 滚动条整体样式 */
#panel::-webkit-scrollbar {
  width: 4px;
  background-color: #b3d3ee8f;
}

/* 滚动条背景 */
#panel ::-webkit-scrollbar-track {
	background-color: #b3d3ee8f;
}
/* 滚动条滑块样式 */
#panel::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: #2db7f5;
}

#panel button {
  width: 78%;
}

.statistics {
  height: calc(100% - 5px);
  margin-top: 5px;
}

.tableContent{
  height: calc(100% - 535px);
  min-height: fit-content;
  padding: 0 5px;
  background-color: #fff;
}
/* Row的样式 */
.rowStyle {
  margin-top: 5px;
  line-height: 30px;
}
/* Col样式 */
.colCenter {
  text-align: center;
}
.colRight {
  text-align: right;
}

#searchInputUL{
  position: absolute;
  width: 250px;
  margin-left: 8px;
  background-color:#fff;
  box-shadow:0px 2px 10px rgb(170, 170, 170); 
  -webkit-box-shadow:0px 2px 10px rgb(170, 170, 170);
  z-index: 1;
  
}

#searchInputUL li {
  width: 100%;
  height: 25px;
  line-height: 25px;
  cursor: pointer;
}

#searchInputUL li:hover {
  background-color: #b0b2b6;
}

.inputText{
  margin-left: 5px;
}

/* 文字居中 */
/*.lineHeight32 {*/
  /*line-height: 30px;*/
/*}*/
/* 灰色右箭头 */
.colorGray {
  margin: 0 12px 0 5px;
  color: #ccc;
  /*line-height: 32px;*/
}
/* 按钮组样式 */
.radioPadding div {
  /* width: 114px; */
  display: inline-block;
  line-height: 30px;
  color: #515a6e;
  cursor: pointer;
}
.selectSpan {
  color: #2d8cf0 !important;
}

.levelContent{
  display: inline-block;
  /* width: 130px; */
}

.levelContent:hover {
  color: #2d8cf0;
}
/* 分割线 */
.ivu-divider {
  background: #bdbaba;
  margin: 0 12px;
  height: 10px;
  display: inline-block;
}
/* 表格样式 */
.tableTitle {
  height: 36px;
  line-height: 32px;
  font-size: 1.3em;
}
/* 表格搜索Loading动画 */
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
.demo-spin-col{
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}

</style>