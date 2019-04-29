package com.field.typhoonquery.service;

import com.field.typhoonquery.service.impl.DataFeignClientHystrix;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by Tian.Ye in 15:13 2019/4/23
 */
@FeignClient(value = "typhoon-data", fallback = DataFeignClientHystrix.class)
public interface DataFeignClient {

    @GetMapping("sync")
    String sync();

    @GetMapping("syncall")
    String syncAll();

}
