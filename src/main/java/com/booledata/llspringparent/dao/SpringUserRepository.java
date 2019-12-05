package com.booledata.llspringparent.dao;

import com.booledata.llspringparent.model.ucenter.request.LoginRequest;
import com.booledata.llspringparent.service.wisely.WiselyRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringUserRepository extends WiselyRepository<LoginRequest,String>  {





    @Query(nativeQuery = true,value = "select * from spring_login where username = ?1")
    LoginRequest findByUsername(String username);
}
