package com.field.typhoonquery.service;

import com.field.typhoonquery.entity.TyphoonForecast;

import java.util.List;

/**
 * Created by Tian.Ye in 10:45 2018/12/7
 */
//@Service
public interface TyphoonForecastService {

    void insertNMC(List list);

    void insertForecast(List list);

    void insertOrUpdateForecast(List list);

    List<TyphoonForecast> listTpForecastByIdAndTime(int typhoon_id, String obs_time);

}
