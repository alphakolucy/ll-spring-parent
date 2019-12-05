package com.booledata.llspringparent.dao;

import com.booledata.llspringparent.model.springPoint.SpringPicFile;
import com.booledata.llspringparent.model.springPoint.SpringPointPic;
import com.booledata.llspringparent.service.wisely.WiselyRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
* @author xlr
* @description 温泉点图片
* @date 2019/10/15  
**/

@Transactional
@Repository
public interface SpringPicFileRepository extends WiselyRepository<SpringPicFile,String> {





	@Query(nativeQuery = true,value = "select * from spring_picfile where id= ?1")
	SpringPicFile findById(Integer id);

	@Query(nativeQuery = true,value = "DELETE FROM spring_picfile WHERE id = ?1 ")
	@Modifying
	Integer deleteById(Integer id);


    @Query(nativeQuery = true,value = "DELETE FROM spring_picfile WHERE point_id = ?1 ")
    @Modifying
    Integer deleteByPointId(String id);



    @Query(nativeQuery = true,value = "select * FROM spring_picfile WHERE point_id = ?1 ")

    List<SpringPicFile> findByPointId(String id);

//    @Query(nativeQuery = true,value = "DELETE FROM spring_pointpic WHERE point_id = ?1 ")
//    @Modifying
//    Integer deleteByPointId(String id);
//
//
//
//    @Query(nativeQuery = true,value = "select * from spring_pointpic where file_path = ?1")
//    SpringPointPic findByFilePath(String filePath);
//
//    @Query(nativeQuery = true,value = "select * from spring_pointpic where point_id = ?1")
//    List<SpringPointPic> findByPointId(String pointId);

}
