package com.palmyralabs.palmyra.filemgmt.spring;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	 @Override
     public void addReturnValueHandlers(List<HandlerMethodReturnValueHandler> handlers) {
         handlers.add(new FileEmitterReturnValueHandler()); 
     }
}
