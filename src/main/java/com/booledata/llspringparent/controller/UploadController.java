package com.booledata.llspringparent.controller;


import com.booledata.llspringparent.api.drawMap.UploadControllerApi;
import com.booledata.llspringparent.dao.SpringPicRepository;
import com.booledata.llspringparent.model.springPoint.SpringPointPic;
import com.booledata.llspringparent.service.SpringPicService;
import com.booledata.llspringparent.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/upload")
@Transactional(propagation = Propagation.SUPPORTS)
public class UploadController implements UploadControllerApi {





    @Autowired
    private SpringPicService springPicService;

    @Autowired
    private SpringPicRepository springPicRepository;

    //处理图片上传
    @Override
    @RequestMapping(value = "/image", method = RequestMethod.POST)
    public ResponseEntity<?> uploadImgDif(@RequestParam("file") MultipartFile file, @RequestParam(value = "filetype", defaultValue = "") String type,
                                          HttpServletRequest request,@RequestParam(value = "PicState", defaultValue = "") Integer picState,String codeNumber,String id,String pointId,String plottingScale) {

        return springPicService.saveImg(file, type, request, picState, codeNumber,id,pointId,plottingScale);
    }

    @Override
    @RequestMapping(value = "/file", method = RequestMethod.POST)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, HttpServletRequest request,@RequestParam(value = "PicState", defaultValue = "")  Integer picState,String codeNumber,String id,String poinId,Integer packageType) {
        return springPicService.saveFile(file,request,picState,codeNumber,id,poinId,packageType);
    }

    @Override
    @DeleteMapping
    public String deledteFile(String id) {

        if(id.isEmpty()){
            return "删除失败，id为空！";
        }else {
            SpringPointPic one = springPicRepository.findOne(id);
            if (one!=null){
                String filePath = one.getFilePath();
                FileUtil.delete(filePath);
                springPicRepository.delete(id);
                return "删除成功";
            }else {
                return "删除失败";
            }
        }





    }
}
