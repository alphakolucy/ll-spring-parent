package com.booledata.llspringparent.api.drawMap;


//import com.booledata.llspringparent.model.springPointInfo.SpringPointInfo;
//import com.booledata.llspringparent.model.springPointInfo.response.SpringPointResult;
import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import com.booledata.llspringparent.model.springPoint.SpringPointPic;
import com.booledata.llspringparent.model.springPoint.response.SpringPicFileResult;
import com.booledata.llspringparent.model.springPoint.response.SpringPointResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
* @author Administrator
* @description 温泉点管理
* @date 2019/9/27
**/
@Api(value = "温泉点管理",tags = {"温泉点管理接口"})
public interface SpringPointControllerApi {



    @ApiOperation(value = "获取温泉点列表(分页）") //Page<SpringPointInfo>
    SpringPointResult findAllPage(SpringPointInfo springPointInfo, @PageableDefault(value = 10, sort = {"createTime"}, direction = Sort.Direction.DESC) Pageable pageable);

    @ApiOperation(value = "获取温泉点列表")
    ResponseEntity<?> findAll();


    @ApiOperation(value = "查询温泉点")
    ResponseEntity<?> getOne(String id);


    @ApiOperation(value = "添加温泉点")
    ResponseEntity<?> addPoint(SpringPointInfo entity);

    @ApiOperation(value = "修改温泉点")
    ResponseEntity<?> updatePoint( SpringPointInfo entity);

    @ApiOperation(value = "删除温泉点")
    ResponseEntity<?> deletePoint(String id);

    @ApiOperation(value = "获取温泉点图文列表")
    public List<SpringPointPic> findAllPic();


    @ApiOperation(value = "获取温泉点图文信息")
    public List<SpringPointPic> findPointPic(String id);


    @ApiOperation(value = "删除温泉图片")
    public SpringPicFileResult deletePicFileHis(Integer id);
}
