/**
 * 截图
 */
function mapToImg() {
  MapToImg && MapToImg.excute(map);
}
/**
 * 划线
 */

function distanceMeasure() {
  clearFeatures();
  drawLine.activate();
}

//绘完触发事件
function drawCompleted(drawGeometryArgs) {
  //停止画面控制
  drawLine.deactivate();
  //获得图层几何对象
  var geometry = drawGeometryArgs.feature.geometry,
    measureParam = new SuperMap.REST.MeasureParameters(
      geometry
    ) /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/,
    myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
  myMeasuerService.events.on({ processCompleted: measureCompleted });

  //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA

  myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;

  myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
}

//测量结束调用事件
function measureCompleted(measureEventArgs) {
  var distance = measureEventArgs.result.distance;
  var unit = measureEventArgs.result.unit;
  alert("量算结果:" + distance + "米");
}

//移除图层要素
function clearFeatures() {
  lineLayer.removeAllFeatures();
}
