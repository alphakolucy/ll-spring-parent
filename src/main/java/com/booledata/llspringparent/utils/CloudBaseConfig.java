package com.booledata.llspringparent.utils;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="CommonConfig")
public class CloudBaseConfig {  
	private String ImageBaseUrl;

	public String getImageBaseUrl() {
		return ImageBaseUrl;
	}

	public void setImageBaseUrl(String imageBaseUrl) {
		ImageBaseUrl = imageBaseUrl;
	}
}
