package com.booledata.llspringparent;


import com.booledata.llspringparent.utils.ApplicationConfig;
import com.booledata.llspringparent.utils.CloudBaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;


@Component
@Order(value=1)
public class AppStartupRunner implements CommandLineRunner {
	
	@Autowired
	private CloudBaseConfig baseConfig;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>>>>>>>>>>>>>>服务启动执行，执行加载数据等操作 <<<<<<<<<<<<<");
        
        System.out.println("读取图片路径: " + baseConfig.getImageBaseUrl());
        ApplicationConfig.newInstance().setBaseUrl(baseConfig.getImageBaseUrl());
        
        System.out.println(">>>>>>>>>>>>>>>服务启动结束 <<<<<<<<<<<<<");
    }

}