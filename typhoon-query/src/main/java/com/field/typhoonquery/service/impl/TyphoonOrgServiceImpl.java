package com.field.typhoonquery.service.impl;

import com.field.typhoonquery.entity.TyphoonOrg;
import com.field.typhoonquery.mapper.TyphoonOrgMapper;
import com.field.typhoonquery.service.TyphoonOrgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Tian.Ye in 15:30 2019/3/12
 */
@Service
public class TyphoonOrgServiceImpl implements TyphoonOrgService {

    @Autowired
    TyphoonOrgMapper typhoonOrgMapper;

    @Override
    public List<TyphoonOrg> listAllOrgs() {
        return typhoonOrgMapper.listAllOrgs();
    }

    @Override
    public TyphoonOrg selectByPrimaryKey(String stationCode){
        return typhoonOrgMapper.selectByPrimaryKey(stationCode);
    }

}
