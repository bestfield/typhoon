package com.field.typhoondata.service;

import com.field.typhoondata.entity.TyphoonLive;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Tian.Ye in 下午 14:30 2019/1/17 0017
 */
//@Service
public interface TyphoonLiveService {

    /** Deprecated */
    void insertLive(List list);

    void insertOrUpdateLive(List list);

    List<TyphoonLive> listTyphoonByYears(int startYear, int endYear);

    List<TyphoonLive> listTyphoonById(int typhoonId);


    int calcTyphoonCount(List<TyphoonLive> list);

    List<Integer> cutJson(List<TyphoonLive> list, int typhoonCount);

    /** 点查询*/
    List<Integer> queryTyphoonByPoint(int startYear, int endYear,
                                      float cenLongitude, float cenLatitude, float radius);

    /** 线查询*/
    List<Integer> queryTyphoonByLine(int startYear, int endYear,
                                     float p1_x, float p1_y, float p2_x, float p2_y);

    /** 线查询*/
    List<Integer> queryTyphoonByLine(int startYear, int endYear, List<Float> lonList, List<Float> latList);

    /** 面查询*/
    List<Integer> queryTyphoonByPolygon(int startYear, int endYear, List<Float> lonList, List<Float> latList);

}
