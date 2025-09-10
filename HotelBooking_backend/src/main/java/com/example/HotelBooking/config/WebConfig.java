package com.example.HotelBooking.config;// package com.example.HotelBooking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/rooms/**")
                .addResourceLocations("file:D:/Spring Boot Projects/HotelApp/src/assets/");
    }
}
