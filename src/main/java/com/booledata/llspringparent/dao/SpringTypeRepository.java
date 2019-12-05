package com.booledata.llspringparent.dao;

import com.booledata.llspringparent.model.springPoint.SpringPointType;
import com.booledata.llspringparent.service.wisely.WiselyRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface SpringTypeRepository extends WiselyRepository<SpringPointType,String> {

    @Query(nativeQuery = true,value = "DELETE FROM spring_pointtype WHERE point_id = ?1 ")
    @Modifying
    Integer deleteByPointId(String pointId);



    @Query(nativeQuery = true, value = "SELECT * FROM spring_pointtype WHERE point_id= ?1")
    SpringPointType findByPointId(String pointId);

}
