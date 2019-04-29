package com.field.typhoonquery.service;

import com.field.typhoonquery.service.impl.HelloFeignClientHystrix;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.cloud.openfeign.FeignClient;

/**
 * Created by Tian.Ye in 16:34 2019/4/18
 *  feign测试
 */
@FeignClient(value = "typhoon-eureka-client", fallback = HelloFeignClientHystrix.class)
public interface HelloFeignClient {

    @GetMapping("hello")
    public String hello(@RequestParam(value = "name") String name);

}
