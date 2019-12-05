package com.booledata.llspringparent;


import com.booledata.llspringparent.service.wisely.WiselyRepositoryImpl;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

//@ComponentScan(value = "com.gitee.sunchenbin.mybatis.actable.manager.*")
//@EntityScan("com.booledata.llspringparent.model")//扫描实体类
//@MapperScan(basePackages ="com.gitee.sunchenbin.mybatis.actable.dao.*")
@SpringBootApplication
@EnableSwagger2
@ComponentScan("com.booledata.llspringparent.config")
@ComponentScan(basePackages = {"com.booledata.llspringparent.api","com.gitee.sunchenbin.mybatis.actable.manager.*"})
@MapperScan("com.booledata.llspringparent.dao")
@MapperScan({"com.booledata.mapper","com.gitee.sunchenbin.mybatis.actable.dao.*"})
@EnableJpaRepositories(repositoryBaseClass = WiselyRepositoryImpl.class)
public class LlSpringParentApplication {
    public static void main(String[] args) {
        SpringApplication.run(LlSpringParentApplication.class, args);
    }

}
