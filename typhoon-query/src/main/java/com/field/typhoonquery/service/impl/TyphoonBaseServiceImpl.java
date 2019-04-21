package com.field.typhoonquery.service.impl;

import com.field.typhoonquery.entity.TyphoonBase;
import com.field.typhoonquery.mapper.TyphoonBaseMapper;
import com.field.typhoonquery.service.TyphoonBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Tian.Ye in 下午 14:51 2019/1/25 0025
 */
@Service
public class TyphoonBaseServiceImpl implements TyphoonBaseService {

    @Autowired
    TyphoonBaseMapper typhoonBaseMapper;

    @Override
    public void insertOrUpdateBase(TyphoonBase base) {
        boolean b = typhoonBaseMapper.insertOrUpdateBase(base);
        System.out.println("更新typhoon_base表 : " + b);
    }
}
