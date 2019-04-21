package com.field.typhoonquery.service.impl;

import com.field.typhoonquery.entity.TyphoonForecast;
import com.field.typhoonquery.mapper.TyphoonForecastMapper;
import com.field.typhoonquery.service.TyphoonForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Tian.Ye in 下午 17:35 2019/1/22 0022
 */
@Service
public class TyphoonForecastServiceImpl implements TyphoonForecastService {

    @Autowired
    private TyphoonForecastMapper typhoonForecastMapper;

    @Override
    /** Usage:TyphoonObserverTest readTXT()
     *  批量插入
     */
    public void insertNMC(List list) {
        boolean b = typhoonForecastMapper.insertMap(list);
        System.out.println(b);
    }

    /**
     * mybatis foreach批量插入list
     */
    @Override
    public void insertForecast(List list) {
        boolean b = typhoonForecastMapper.insertList(list);
        System.out.println("insertForecast---: " + b);
    }

    /**
     * 循环遍历list 单个插入
     */
    @Override
    public void insertOrUpdateForecast(List list) {
        for (int i = 0; i < list.size(); i++) {
            TyphoonForecast forecast = (TyphoonForecast) list.get(i);
            boolean b = typhoonForecastMapper.insertOrUpdateForecast(forecast);
            System.out.println("=====insertForecast: " + b);
        }
    }

    @Override
    public List<TyphoonForecast> listTpForecastByIdAndTime(int typhoon_id, String obs_time){
        return typhoonForecastMapper.listTpFcByIdAndTime(typhoon_id, obs_time);
    }

}
