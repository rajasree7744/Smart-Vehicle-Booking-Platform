package com.rental.config;
import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig {
 @Bean public WebMvcConfigurer corsConfigurer() {
  return new WebMvcConfigurer() {
   @Override public void addCorsMappings(CorsRegistry r) {
    r.addMapping("/api/**")
     .allowedOrigins("http://localhost:5500","http://127.0.0.1:5500","http://localhost:5501","http://127.0.0.1:5501")
     .allowedMethods("GET","POST","DELETE","OPTIONS").allowedHeaders("*");
   }
  };
 }
}
