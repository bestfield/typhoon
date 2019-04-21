package com.field.typhoonquery.service;

import com.field.typhoonquery.entity.TyphoonOrg;

import java.util.List;

/**
 * Created by Tian.Ye in 15:30 2019/3/12
 */
public interface TyphoonOrgService {

    List<TyphoonOrg> listAllOrgs();

    TyphoonOrg selectByPrimaryKey(String stationCode);

}
