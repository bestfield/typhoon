package com.field.typhoonquery.service.impl;

import com.field.typhoonquery.service.HelloFeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by Tian.Ye in 18:17 2019/4/26
 *
 *  熔断处理test
 */
@Component
public class FeignClientHystrix implements HelloFeignClient {

    @Override
    public String hello(@RequestParam(value = "name") String name) {
        return "sorry "+name+"，service has fail!";
    }
}
