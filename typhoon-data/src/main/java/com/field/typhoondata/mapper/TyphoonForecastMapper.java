package com.field.typhoondata.mapper;

import com.field.typhoondata.entity.TyphoonForecast;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Tian.Ye in 10:38 2018/12/7
 */
@Repository
public interface TyphoonForecastMapper {
//    List<TyphoonForecastScheduler> listTpFcByIdAndTime(@Param(value = "typhoonId") String typhoonId,
//                                                    @Param(value = "currentTime") String currentTime);

    /**
     * 插入mapDataList
     */
    boolean insertMap(@Param(value = "list") List list);

    /**
     * 插入List<TyphoonForecastScheduler>
     */
    boolean insertList(@Param(value = "list") List<TyphoonForecast> list);

    /**
     * 插入或更新TyphoonForecast Bean
     */
    boolean insertOrUpdateForecast(@Param(value = "forecast") TyphoonForecast forecast);

    /** 查询*/
    List<TyphoonForecast> listTpFcByIdAndTime(@Param(value = "typhoon_id") int typhoon_id,
                                              @Param(value = "obs_time") String obs_time);
}
