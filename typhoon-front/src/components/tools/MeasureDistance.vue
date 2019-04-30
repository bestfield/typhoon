<template>
  <div id="measureDistancd">
    <div class="paint" @click="distanceMeasure()" title="城市测距"><span>测距</span></div>
    <div class="cancel" @click="closePaint()" title="取消"><span>取消</span></div>
  </div>
</template>

<script>
// import Bus from './bus.js'
import $ from "jquery"
export default {
    props: {
      map: {
        type: Object,
        required: true
      }
    },
    data(){
      return {
        drawLineMeasure:{}, 
        measureLineLayer:{},
        style : {
            strokeColor: "red",
            strokeWidth: 1,
            pointerEvents: "visiblePainted",
            fillColor: "red",
            fillOpacity: 0.8
        },
        distance:" ",  //距离
        positionPopup:"",//距离弹出框
        measureFeatureEnd:"",
        // url: host + "/iserver/services/map-world/rest/maps/World"
      }
    },
    
    methods:{
      //初始化测距矢量/layer
      initDrawline(){
          this.measureLineLayer=new SuperMap.Layer.Vector("measureLineLayer"),
          this.drawLineMeasure = new SuperMap.Control.DrawFeature(this.measureLineLayer, SuperMap.Handler.Path, {multi: true});
          this.measureLineLayer.style = this.style;
          this.drawLineMeasure.events.on({"featureadded": this.drawCompleted});
      },

      drawCompleted(drawGeometryArgs) {
         var host = window.isLocal ? window.server : "http://support.supermap.com.cn:8090";
         var url = host + "/iserver/services/map-world/rest/maps/World";
        //停止画线控制
        this.drawLineMeasure.deactivate();
        $(".olAlphaImg").parent().parent().css("z-index", 390)
        //获得图层几何对象
        var geometry = drawGeometryArgs.feature.geometry,
        measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
        myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
        //绘折线的转折点的个数(数组的长度)
        var length = geometry.components[0].components.length
        //获得绘制的线终点的Feature
        this.measureFeatureEnd =  geometry.components[0].components[length-1]
        //调用测量结束事件
        myMeasuerService.events.on({"processCompleted": this.measureCompleted});
        //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
        myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
        myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
       
        
      },
      //设置显示距离的弹出框
      setPositionPop(lon,lat){
        var that = this
        this.positionPopup = new SuperMap.Popup("positionValue",
                   new SuperMap.LonLat(lon,lat),
                   new SuperMap.Size(140,30),
                   "<div class='distanceValue'>距离：" + this.distance+ " km</div>",
                   true,
                   this.clearFeatures//点击关闭弹窗icon，调用clearFeatures方法移除图层要素
                   );
        this.map.addPopup(this.positionPopup);
      },

      //测量结束调用事件
      measureCompleted(measureEventArgs) {
        var distance = measureEventArgs.result.distance
        //距离精度到小数点后两位
        this.distance= (distance/1000).toFixed(2) * 1
        var unit = measureEventArgs.result.unit
        //绘制结束设置距离弹出框
        this.setPositionPop((this.measureFeatureEnd.x+0.3),(this.measureFeatureEnd.y+0.6))     
      },

      //点击测量按钮，启动测距
      distanceMeasure() {
        this.map.removePopup(this.positionPopup)
        this.clearFeatures();
        this.drawLineMeasure.activate();
      },
      //点击取消按钮，清除几何图层和信息弹出框
      closePaint(){
        //distance回到初始值
        this.distance=" ",
        this.drawLineMeasure.deactivate();
        //重置台风gif的z-index
        $(".olAlphaImg").parent().parent().css("z-index", 390)
        this.clearFeatures()
      },
      //移除图层要素
      clearFeatures() {
        this.map.removePopup(this.positionPopup)
        this.measureLineLayer.removeAllFeatures();
      },
    },
}
</script>

<style scoped>
#measureDistancd{
  width: 102px;
  z-index: 10002;
  position: absolute;
  top:53px;
  font-size: 13px;
  right: 165px;
  background: white;
  color: #000;
  text-align: center;
  border: 1px solid rgb(216, 214, 214);
  border-radius: 4px;
}

.paint span{
  background: url(../../assets/images/paint.png) no-repeat left center;
}

.cancel span{
  background:url(../../assets/images/cancel.png) no-repeat left center;
}

.paint,
.cancel{
  display: inline-block;
  width: 45px;
  height: 22px;
  line-height: 22px;
  cursor: pointer;
}

.paint{
  margin-right: 2px;
}
.cancel span,
.paint span{
  padding-left:17px;
  display: inline-block;
}
</style>
