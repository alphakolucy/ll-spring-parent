package com.booledata.llspringparent.utils;

//应用全局配置 单例在应用启动时加载
public class ApplicationConfig {
	
	private static ApplicationConfig instance = new ApplicationConfig();  
    private ApplicationConfig(){}  
    public static ApplicationConfig newInstance(){  
        return instance;  
    }  
    
    public String getBaseUrl() {
		return baseUrl;
	}
	public void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}

	private String baseUrl;
}
