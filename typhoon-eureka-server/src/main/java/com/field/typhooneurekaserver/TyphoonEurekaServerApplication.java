package com.field.typhooneurekaserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class TyphoonEurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TyphoonEurekaServerApplication.class, args);
    }

}
