package com.booledata.llspringparent.api.drawMap;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@Api(value = "图文上传管理", tags = {"图文管理接口"})
public interface UploadControllerApi {


    @ApiOperation(value = "图片上传")
    ResponseEntity<?> uploadImgDif(@RequestParam("file") MultipartFile file, @RequestParam(value = "filetype", defaultValue = "") String type, HttpServletRequest request, @RequestParam(value = "PicState", defaultValue = "") Integer picState, @RequestParam(value = "codeNumber", defaultValue = "") String codeNumber, String id,String poinId,String plottingScale);

    @ApiOperation(value = "文件上传")
    ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, HttpServletRequest request, @RequestParam(value = "PicState", defaultValue = "") Integer picState, @RequestParam(value = "codeNumber", defaultValue = "") String codeNumber, String id,String poinId,Integer packageType);


    @ApiOperation(value = "文件/文件夹删除")
    String deledteFile(@RequestParam("ap") String ap);

}
