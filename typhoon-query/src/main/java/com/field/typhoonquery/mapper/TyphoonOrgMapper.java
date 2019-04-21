package com.field.typhoonquery.mapper;

import com.field.typhoonquery.entity.TyphoonOrg;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Tian.Ye in 15:32 2019/3/12
 */
@Repository
public interface TyphoonOrgMapper {

    List<TyphoonOrg> listAllOrgs();

    TyphoonOrg selectByPrimaryKey(@Param(value = "stationCode") String stationCode);

}
