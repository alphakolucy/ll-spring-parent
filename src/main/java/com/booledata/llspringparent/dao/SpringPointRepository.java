package com.booledata.llspringparent.dao;

import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import com.booledata.llspringparent.service.wisely.WiselyRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
* @author Administrator
* @date 2019/10/11
**/
@Repository
public interface SpringPointRepository extends WiselyRepository<SpringPointInfo,String> {




    @Query(nativeQuery = true,value = "select * from spring_point where code_number = ?1")
    SpringPointInfo getSpringPointByCodeNumber(String codeNumber);
}

