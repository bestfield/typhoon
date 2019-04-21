package com.field.typhoonquery.mapper;

import com.field.typhoonquery.entity.TyphoonBase;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

/**
 * Created by Tian.Ye in 下午 14:48 2019/1/25 0025
 */
@Repository
public interface TyphoonBaseMapper {

    /**
     * 插入或更新TyphoonBase Bean
     */
    boolean insertOrUpdateBase(@Param(value = "base") TyphoonBase base);

}
