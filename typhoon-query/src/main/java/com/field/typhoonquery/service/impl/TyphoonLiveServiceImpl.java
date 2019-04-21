package com.field.typhoonquery.service.impl;

import com.field.typhoonquery.entity.TyphoonLive;
import com.field.typhoonquery.mapper.TyphoonLiveMapper;
import com.field.typhoonquery.service.TyphoonLiveService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.geom.GeneralPath;
import java.awt.geom.Point2D;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Tian.Ye in 下午 17:35 2019/1/22 0022
 */
@Service
@Slf4j
public class TyphoonLiveServiceImpl implements TyphoonLiveService {

    @Autowired
    TyphoonLiveMapper typhoonLiveMapper;

    /**
     * mybatis foreach批量插入
     */
    @Override
    public void insertLive(List list) {
        boolean b = typhoonLiveMapper.insertList(list);
        System.out.println("insertLive---: " + b);
    }

    /**
     * 循环遍历list 单个插入
     */
    @Override
    public void insertOrUpdateLive(List list) {
        for (int i = 0; i < list.size(); i++) {
            TyphoonLive live = (TyphoonLive) list.get(i);
            boolean b = typhoonLiveMapper.insertOrUpdateLive(live);
            System.out.println("=====insertLive: " + b);
        }
    }

    @Override
    public List<TyphoonLive> listTyphoonByYears(int startYear, int endYear) {
        return typhoonLiveMapper.listTpLiveByYears(startYear, endYear);
    }

    @Override
    public List<TyphoonLive> listTyphoonById(int typhoonId) {
        return typhoonLiveMapper.listTpLiveById(typhoonId);
    }

    /** 点查询*/
    @Override
    public List<Integer> queryTyphoonByPoint(int startYear, int endYear, float cenLongitude, float cenLatitude, float radius) {
        /**
         * @Description: 点查询
         * @Date: Created in 10:00 2018/12/11
         * @param startYear
         * @param endYear
         * @param cenLongitude
         * @param cenLatitude
         * @param radius
         * @Return: 返回的result存的值为typhoonId(s)
         */
        List<Integer> result = new ArrayList<>();
        List<TyphoonLive> list = typhoonLiveMapper.listTpLiveByYears(startYear, endYear);
        log.info(list.toString());
        int size = list.size();
        if(size == 0) return null;
        int typhoonCount = calcTyphoonCount(list);
        List<Integer> index = cutJson(list, typhoonCount);
        int flag = 0;

        for(int i = 0; i < index.size(); i++){
            for(int j = flag;j < index.get(i);j++){
                /**!!!!!!!这里radius要改 经纬度与Km的转换*/
                if( getDistance(cenLongitude, cenLatitude, list.get(j).getLon(), list.get(j).getLat())
                        > radius){
                    continue;
                }else{
                    if(! result.contains(list.get(index.get(i)).getTyphoon_id())) {
                        result.add(list.get(index.get(i)).getTyphoon_id());
                    }
                    break;
                }
            }
            flag = index.get(i) ;
        }
        return result;
    }

    /** 线查询*/
    @Override
    public List<Integer> queryTyphoonByLine(int startYear, int endYear, float p1_x, float p1_y, float p2_x, float p2_y) {
        /**
         * @Description:     线查询：线段相交判断基于快速排斥实验(x/y方向投影是否重合)和跨立实验(两点是否在线段两侧)
         * @Date: Created in 15:31 2018/12/12
         * @param startYear
         * @param endYear
         * @param p1_x
         * @param p1_y
         * @param p2_x
         * @param p2_y
         * @Return: 返回的result存的值为typhoonId(s)
         */
        List<Integer> result = new ArrayList<>();
        List<TyphoonLive> list = typhoonLiveMapper.listTpLiveByYears(startYear, endYear);
        log.info(list.toString());
        int size = list.size();
        if(size == 0) return null;
        int typhoonCount = calcTyphoonCount(list);
        List<Integer> index = cutJson(list, typhoonCount);
        /** locList存放的所有TyphoonLocation的typhoonId相同，即一个locList对应一个台风路径 */
        List<TyphoonLive> locList = new ArrayList<>();
        float p3_x, p3_y, p4_x, p4_y;
        int move = 0;
        int flag = 0;
        for(int i = 0; i < index.size(); i++){
            locList = list.subList(flag, index.get(i) + 1);
            if (locList.size() == 1){
                move = index.get(i);
                flag = move + 1;
                continue;
            }
            for (int j = 1; j < locList.size(); j++) {
                p3_x = locList.get(j-1).getLon();
                p3_y = locList.get(j-1).getLat();
                p4_x = locList.get(j).getLon();
                p4_y = locList.get(j).getLat();
                if ( isIntersection(p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, p4_x, p4_y)) {
                    result.add(locList.get(j).getTyphoon_id());
                    break;
                }
            }
            move = index.get(i);
            flag = move + 1;
        }

        return result;
    }

    /** 线查询*/
    @Override
    @SuppressWarnings("Duplicates")
    public List<Integer> queryTyphoonByLine(int startYear, int endYear, List<Float> lonList, List<Float> latList) {
        /**
         * @Description: 线查询：线段相交判断基于快速排斥实验(x/y方向投影是否重合)和跨立实验(两点是否在线段两侧)
         * @Date: Created in 上午 10:50 2018/12/20 0020
         * @Param: [startYear, endYear, lonList, latList]
         * @Return: java.util.List<java.lang.Integer>
         */
        List<Integer> result = new ArrayList<>();
        List<TyphoonLive> list = typhoonLiveMapper.listTpLiveByYears(startYear, endYear);
        log.info(list.toString());
        int size = list.size();
        if(size == 0) return null;
        if (lonList.size() != latList.size()) return null;
        int typhoonCount = calcTyphoonCount(list);
        List<Integer> index = cutJson(list, typhoonCount);
        /** locList存放的所有TyphoonLocation的typhoonId相同，即一个locList对应一个台风路径 */
        List<TyphoonLive> locList = new ArrayList<>();
        float p1_x, p1_y, p2_x, p2_y;
        float p3_x, p3_y, p4_x, p4_y;
        int move = 0;
        int flag = 0;
        for(int i = 0; i < index.size(); i++){
            locList = list.subList(flag, index.get(i) + 1);
            if (locList.size() == 1){
                move = index.get(i);
                flag = move + 1;
                continue;
            }
            /** a循环 遍历线查询所指定的线段 */
            a:for (int k = 1; k < lonList.size(); k++) {
                p1_x = lonList.get(k-1);
                p1_y = latList.get(k-1);
                p2_x = lonList.get(k);
                p2_y = latList.get(k);
                b:for (int j = 1; j < locList.size(); j++) {
                    /** b循环 遍历台风路径 点构成的线段 */
                    p3_x = locList.get(j-1).getLon();
                    p3_y = locList.get(j-1).getLat();
                    p4_x = locList.get(j).getLon();
                    p4_y = locList.get(j).getLat();
                    if ( isIntersection(p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, p4_x, p4_y)) {
                        result.add(locList.get(j).getTyphoon_id());
                        break a;
                    }
                }

            }
            move = index.get(i);
            flag = move + 1;

        }

        return result;
    }

    /** 面查询*/
    public List<Integer> queryTyphoonByPolygon(int startYear, int endYear, List<Float> lonList, List<Float> latList){
        List<Integer> result = new ArrayList<>();
        List<TyphoonLive> list = typhoonLiveMapper.listTpLiveByYears(startYear, endYear);
        log.info(list.toString());
        int size = list.size();
        if(size == 0) return null;
        int typhoonCount = calcTyphoonCount(list);
        List<Integer> index = cutJson(list, typhoonCount);
        /** locList存放的所有TyphoonLocation的typhoonId相同，即一个locList对应一个台风路径 */
        List<TyphoonLive> locList = new ArrayList<>();
        /** 数组polygonPts_lon、 polygonPts_lat存放多边形的顶点 */
        float[] polygonPts_lon = new float[lonList.size()];
        float[] polygonPts_lat = new float[latList.size()];
        for (int i = 0; i < lonList.size(); i++) {
            polygonPts_lon[i] = lonList.get(i);
        }
        for (int i = 0; i < latList.size(); i++) {
            polygonPts_lat[i] = latList.get(i);
        }
        int move = 0;
        int flag = 0;
        for(int i = 0; i < index.size(); i++){
            locList = list.subList(flag, index.get(i) + 1);
            /** 如果某个台风路径只有一个点 则判断该点是否在多边形内 */
            if (locList.size() == 1){
                float ptLon = locList.get(0).getLon();
                float ptLat = locList.get(0).getLat();
                if (isInPolygon(ptLon, ptLat, polygonPts_lon, polygonPts_lat)) {
                    result.add(locList.get(0).getTyphoon_id());
                }
                move = index.get(i);
                flag = move + 1;
                continue;
            }
            /** 当某个台风路径有多个点时，依次判断每个点是否在多边形内 */
            for (int j = 0; j < locList.size(); j++) {
                float ptLon = locList.get(j).getLon();
                float ptLat = locList.get(j).getLat();
                if ( isInPolygon(ptLon, ptLat, polygonPts_lon, polygonPts_lat)) {
                    result.add(locList.get(j).getTyphoon_id());
                    break;
                }
            }
            move = index.get(i);
            flag = move + 1;
        }

        return result;
    }

    @Override
    public int calcTyphoonCount(List<TyphoonLive> list){
        /**
         * @Description: 根据台风编号(typhoonId)计算查询到的台风数
         * @Date: Created in 17:12 2018/12/6
         * @param list
         */
        Set<Integer> set = new HashSet<>();
        for(int i = 0; i<list.size();i++){
            set.add(list.get(i).getTyphoon_id());
        }
        log.info("***typhoonId(s) is :"+set);
        return set.size();
    }

    @Override
    public List<Integer> cutJson(List<TyphoonLive> list, int typhoonCount){
        /**
         * @Description: 拼接json函数，拼接重复的json数据，返回【最后一个重复行】的下标
         *                  如：假设数据库中0-8行数据的typhoonId均为201827,第9行为201826,第10-12行为201727
         *                      则index.size==3 且index.get(0)==8, index.get(1)==9, index.get(2)==12
         *               其中必然有 index.size() == typhoonCount
         * @Date: Created in 17:17 2018/12/10
         * @param list
         * @param typhoonCount
         * @Return 返回一个list对象：存放重复数据行的最后一个下标集合
         */
        List<Integer> index = new ArrayList<>();
        int flag = 0;
        int move = 0;
        for(int i = 0 ;i<typhoonCount;i++) {
            for (int j = flag + 1 ; j < list.size(); j++) {
                if (list.get(j).getTyphoon_id() == list.get(j - 1).getTyphoon_id()) {
                    move++;
                } else {
                    flag = move;
                    index.add(flag);
                    move++;
                }
            }
        }
        return index;
    }

    private float getDistance(float cenLongitude, float cenLatitude, float ptLongitude, float ptLatitude){
        /**
         * @Description: 获取点与圆心的距离
         * @Date: Created in 9:36 2018/12/11
         * @param cenLongitude  圆心经度
         * @param cenLatitude     圆心纬度
         * @param ptLongtitude    点经度
         * @param ptLatitude      点纬度
         */
        BigDecimal a = new BigDecimal(String.valueOf(ptLongitude));
        double ptLon = a.doubleValue();
        BigDecimal b = new BigDecimal(String.valueOf(ptLatitude));
        double ptLat = b.doubleValue();
        BigDecimal c = new BigDecimal(String.valueOf(cenLongitude));
        double cenLon = c.doubleValue();
        BigDecimal d = new BigDecimal(String.valueOf(cenLatitude));
        double cenLat = d.doubleValue();

        return (float)Math.sqrt( Math.pow((ptLon - cenLon),2) + Math.pow((ptLat - cenLat),2) );
    }

    boolean isIntersection(float p1_x, float p1_y, float p2_x, float p2_y,
                           float p3_x, float p3_y, float p4_x, float p4_y){
        /**
         * @Description:
         * @Date: Created in 14:19 2018/12/12
         * @param p1_x        point1、point2来自url请求
         * @param p1_y
         * @param p2_x
         * @param p2_y
         * @param p3_x         point3、point4来自数据库
         * @param p3_y
         * @param p4_x
         * @param p4_y
         */
        /** 快速排斥实验：若line1在x/y方向的投影与 line2在x/y方向的投影 均未产生交集，则两个线段一定不相交*/
        if(     (Math.max(p1_x,p2_x)) < (Math.min(p3_x,p4_x)) ||
                (Math.max(p1_y,p2_y)) < (Math.min(p3_y,p4_y)) ||
                (Math.max(p3_x,p4_x)) < (Math.min(p1_x,p2_x)) ||
                (Math.max(p3_y,p4_y)) < (Math.min(p1_y,p2_y))  ){
            return false;
        }
        /** 跨立实验：根据向量叉乘的结果 判断两个点是否在线段的异侧*/
        if(   ( ((p1_x - p3_x)*(p4_y - p3_y) - (p1_y - p3_y)*(p4_x - p3_x))*
                ((p2_x - p3_x)*(p4_y - p3_y) - (p2_y - p3_y)*(p4_x - p3_x)) ) > 0 ||
                ( ((p3_x - p1_x)*(p2_y - p1_y) - (p3_y - p1_y)*(p2_x - p1_x))*
                        ((p4_x - p1_x)*(p2_y - p1_y) - (p4_y - p1_y)*(p2_x - p1_x)) ) > 0){
            return false;
        }
        return true;
    }

    boolean isInPolygon(float ptLon, float ptLat, float[] lon, float[] lat){
        /**
         * @Description:  判断点(ptLon, ptLat) 是否在由数组lon和lat构成的多边形里面
         * @Date: Created in 15:42 2018/12/13
         * @param ptLon
         * @param ptLat
         * @param lon
         * @param lat
         */
        Point2D.Float point = new Point2D.Float(ptLon, ptLat);	//要判断的点
        List<Point2D.Float> pointList = new ArrayList<>();
        float polygonPoint_x = 0, polygonPoint_y = 0;
        for(int i = 0;i < lon.length; i++){
            polygonPoint_x = lon[i];
            polygonPoint_y = lat[i];
            Point2D.Float polygonPoint = new Point2D.Float(polygonPoint_x, polygonPoint_y);
            pointList.add(polygonPoint);
        }
        return judge(point, pointList);

    }

    private boolean judge(Point2D.Float point, List<Point2D.Float> polygon) {
        /**
         * @Description: 判断
         * @Date: Created in 15:44 2018/12/13
         * @param point
         * @param polygon
         */
        GeneralPath generalPath = new GeneralPath();
        Point2D.Float firstPt = polygon.get(0);
        /**添加第一个点*/
        generalPath.moveTo(firstPt.x, firstPt.y);
        polygon.remove(0);
        /**绘制多边形*/
        for(Point2D.Float d : polygon){
            generalPath.lineTo(d.x , d.y);
        }
        /**将多边形封闭*/
        generalPath.moveTo(firstPt.x, firstPt.y);
        generalPath.closePath();

        return generalPath.contains(point);
    }
}
