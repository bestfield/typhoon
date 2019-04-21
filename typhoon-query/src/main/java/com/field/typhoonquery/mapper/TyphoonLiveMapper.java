package com.field.typhoonquery.mapper;

import com.field.typhoonquery.entity.TyphoonLive;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Tian.Ye in 下午 14:18 2019/1/17 0017
 */
@Repository
public interface TyphoonLiveMapper {

    /**
     * mybatis foreach 插入
     */
    boolean insertList(@Param(value = "list") List<TyphoonLive> list);

    /**
     * mssql merge into 插入更新
     */
    boolean insertOrUpdateLive(@Param(value = "live") TyphoonLive live);

    List<TyphoonLive> listTpLiveByYears(@Param(value = "startYear") int startYear,
                                        @Param(value = "endYear") int endYear);

    List<TyphoonLive> listTpLiveById(@Param(value = "typhoonId") int typhoonId);
}
