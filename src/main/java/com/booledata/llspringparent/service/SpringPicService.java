package com.booledata.llspringparent.service;

import com.alibaba.fastjson.JSONObject;
import com.baidu.aip.ocr.AipOcr;
import com.booledata.llspringparent.api.drawMap.SpringPointControllerApi;
import com.booledata.llspringparent.dao.SpringPicFileRepository;
import com.booledata.llspringparent.dao.SpringPicRepository;
import com.booledata.llspringparent.dao.SpringPointRepository;
import com.booledata.llspringparent.model.Image;
import com.booledata.llspringparent.model.springPoint.SpringPicFile;
import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import com.booledata.llspringparent.model.springPoint.SpringPointPic;
import com.booledata.llspringparent.model.springPoint.response.RespondSpringPic;
import com.booledata.llspringparent.model.UploadStatus;
import com.booledata.llspringparent.model.springPoint.response.RespondSpringPicFile;
import com.booledata.llspringparent.utils.ApplicationConfig;
import com.booledata.llspringparent.utils.FileUtil;
import com.booledata.llspringparent.utils.HttpStatusContent;
import com.booledata.llspringparent.utils.enums.OutputState;
import com.booledata.llspringparent.utils.tools.ObjectCopyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
public class SpringPicService {
   /* @Value("${upload.file.path}")
    private String PATH;*/
    //private static final String PATH = "D:\\springService\\ll-spring-parent\\src\\main\\resources\\static"; //上传路径
  private static final String PATH = "E:\\llspringservice-tomcat8\\webapps\\static";
//  private static final String PATH = "G:\\IDEA\\ll-spring-parent\\src\\main\\resources\\static";

    @Autowired
    private SpringPicRepository springPicRepository;


    @Autowired
    private SpringPicFileRepository springPicFileRepository;

    @Autowired
    private SpringPointRepository springPointRepository;

    @Autowired
    private SpringPointControllerApi springPointControllerApi;

    public ResponseEntity<?> saveImg(MultipartFile file, String type,
                                     HttpServletRequest request, Integer picState, String codeNumber, String id, String pointId, String plottingScale) {
        HttpStatusContent status;

        SpringPicFile springPicFile = new SpringPicFile();

        SpringPointInfo entity = new SpringPointInfo();

        SpringPointPic springPointPic = new SpringPointPic();


        SpringPointInfo springPointInfo = springPointRepository.getSpringPointByCodeNumber(codeNumber);
//        List<SpringPointPic> springPointPics = springPointInfo.getSpringPointPics();

        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        String prefix = file.getOriginalFilename().substring(originalFilename.lastIndexOf(".") + 1);

        String fileName = UUID.randomUUID().toString() + '.' + prefix;
        Image img = new Image();
        img.setImageName(fileName);
        img.setImageType(contentType);


        RespondSpringPicFile respondSpringPicFile = new RespondSpringPicFile();
        RespondSpringPic respondSpringPic = new RespondSpringPic();
        System.out.println(img.getImageName());

        String path = "/" + type + "/";
        try {


            if ("idcard".equals(type)) {
                AipOcr client = new AipOcr("10954235", "FkvCfuuwmD7T5iudrnMq438N", "sQw0jMiXpesWM6fHwCqPcEYyR2cGOqrD");
                HashMap<String, String> options = new HashMap<String, String>();
                options.put("detect_direction", "true");
                //            options.put("detect_risk", "false");
                String idCardSide = "front";
                // 参数为本地图片二进制数组
                byte[] imgbyte = file.getBytes();
                JSONObject res = JSONObject.parseObject(client.idcard(imgbyte, idCardSide, options).toString());
                System.out.println(res.getJSONObject("words_result").get("公民身份号码").toString());

                img.setContent(res.getJSONObject("words_result"));
                img.setImageName(res.getJSONObject("words_result").getJSONObject("公民身份号码").get("words").toString() + '.' + prefix);
            }

            FileUtil.uploadFile(file.getBytes(), PATH + path, img.getImageName());
            String ap = PATH + path + img.getImageName();
            status = new HttpStatusContent(OutputState.SUCCESS);
            img.setImageName(path + fileName);
            img.setImageUrl(ApplicationConfig.newInstance().getBaseUrl() + img.getImageName());

            if (id != null) {
                SpringPointPic one = springPicRepository.findOne(id);

                if (one != null) {
                    //保存历史图片


                    springPicFile.setFileName(originalFilename);
                    springPicFile.setUrl(one.getUrl());
                    springPicFile.setPointId(one.getPointId());
                    springPicFile.setPicState(one.getPicState());
                    springPicFile.setCodeNumber(codeNumber);
                    springPicFile.setPlottingScale(plottingScale);
                    springPicFileRepository.save(springPicFile);
                    //清除缓存图片
//                    boolean delete = FileUtil.delete(one.getFilePath());
//                    if (delete) {
//                        System.out.println("删除覆盖图片成功");
//                    }else {
//                        System.out.println("删除覆盖图片失败");
//                    }

                    springPointPic.setUrl(img.getImageUrl());
                    ObjectCopyUtil<SpringPointPic> uUtil = new ObjectCopyUtil<>();
                    //同一类实体之间的属性复制
                    uUtil.copyProperties(springPointPic, one);
//                    springPointPics.add(one);
//                    springPointInfo.setSpringPointPics(springPointPics);


                    //保存点信息
                    springPicRepository.save(one);
//                    respondSpringPic.setImage(img);
//                    respondSpringPic.setSpringPointPic(springPointPic);

                    respondSpringPicFile.setImage(img);
                    respondSpringPicFile.setSpringPicFile(springPicFile);
                    return new ResponseEntity<RespondSpringPicFile>(respondSpringPicFile, HttpStatus.OK);
                }
            }


            springPointInfo = this.springPointRepository.getSpringPointByCodeNumber(codeNumber);


            //同一类实体之间的属性复制
//            ObjectCopyUtil<SpringPointInfo> uUtil = new ObjectCopyUtil<>();
//            uUtil.copyProperties(springPointInfo,entity);
//

            //存入picState codeNumber
            if (picState == null) {
                status = new HttpStatusContent(OutputState.FAIL, "picState为空！");
                return new ResponseEntity<>(status, HttpStatus.INTERNAL_SERVER_ERROR);
            }


            if (springPointInfo == null) {

                status = new HttpStatusContent(OutputState.FAIL, "没有编号为" + codeNumber + "的温泉点，请先添加温泉点！");
                return new ResponseEntity<>(status, HttpStatus.INTERNAL_SERVER_ERROR);

            }


            //保存当前显示
            springPointPic.setPicState(picState);
            springPointPic.setUrl(img.getImageUrl());
            springPointPic.setFilePath(ap);
            springPointPic.setPointId(pointId);

            springPointPic = springPicRepository.save(springPointPic);

            //保存图文
            springPicFile.setCodeNumber(codeNumber);
            springPicFile.setFileName(originalFilename);
            springPicFile.setUrl(img.getImageUrl());
            springPicFile.setPointId(pointId);
            springPicFile.setPicState(picState);
            springPicFile.setCodeNumber(codeNumber);
            springPicFile.setPlottingScale(plottingScale);

            springPicFileRepository.save(springPicFile);


//            if (springPointPic != null) {
//                //保存历史图片
//                springPicFile.setFileName(originalFilename);
//                springPicFile.setUrl(springPointPic.getUrl());
//                springPicFile.setPointId(springPointPic.getPointId());
//                springPicFile.setPicState(springPointPic.getPicState());
//                springPicFile.setCodeNumber(codeNumber);
//                springPicFile.setPlottingScale(plottingScale);
//                springPicFileRepository.save(springPicFile);
//            }
            respondSpringPicFile.setCode(200);
            respondSpringPicFile.setImage(img);
            respondSpringPicFile.setSpringPicFile(springPicFile);
            return new ResponseEntity<RespondSpringPicFile>(respondSpringPicFile, HttpStatus.OK);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            status = new HttpStatusContent(OutputState.FAIL);//未找到记录
            return new ResponseEntity<HttpStatusContent>(status, HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> saveFile(MultipartFile file, HttpServletRequest request, Integer picState, String codeNumber, String id, String pointId, Integer packageType) {
        HttpStatusContent status;
        SpringPointInfo entity = new SpringPointInfo();
        SpringPointPic springPointPic = new SpringPointPic();
        SpringPicFile springPicFile = new SpringPicFile();
        SpringPointInfo springPointInfo = springPointRepository.getSpringPointByCodeNumber(codeNumber);
//        List<SpringPointPic> springPointPics = springPointInfo.getSpringPointPics();
        String originalFilename = file.getOriginalFilename();
        springPointPic.setFileName(originalFilename);
        String contentType = file.getContentType();
        String prefix = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1);

        String fileName = UUID.randomUUID().toString() + '.' + prefix;
        Image img = new Image();
        img.setImageName(fileName);
        img.setImageType(contentType);

        RespondSpringPicFile respondSpringPicFile = new RespondSpringPicFile();
//        RespondSpringPic respondSpringPic = new RespondSpringPic();


        try {
            FileUtil.uploadFile(file.getBytes(), PATH + "/file/", img.getImageName());
            status = new HttpStatusContent(OutputState.SUCCESS);
            img.setImageName(ApplicationConfig.newInstance().getBaseUrl() + "/file/" + fileName);
            String ap = PATH + "/file/" + fileName;

            UploadStatus uploadStatus = new UploadStatus();
            uploadStatus.setStatus("done");
            uploadStatus.setName("/file/" + fileName);
            uploadStatus.setSize(file.getSize());
            uploadStatus.setDownloadURL(img.getImageName());
            uploadStatus.setFileURL(img.getImageName());
            uploadStatus.setImgURL(img.getImageName());

            if (id != null) {
                SpringPointPic one = springPicRepository.findOne(id);
                if (one != null) {
                    springPointPic.setUrl(img.getImageName());
                    if (!ap.isEmpty()) {
                        springPointPic.setFilePath(ap);
                    }
                    if (picState != null) {
                        springPointPic.setPicState(picState);
                    }


                    ObjectCopyUtil<SpringPointPic> uUtil = new ObjectCopyUtil<>();
                    //同一类实体之间的属性复制
                    uUtil.copyProperties(springPointPic, one);
                    springPointPic = springPicRepository.save(one);
//                    springPointPics.add(one);
//                    springPointInfo.setSpringPointPics(springPointPics);


                    //保存点信息
//                    springPointRepository.save(springPointInfo);
                    springPicFile.setPackageType(packageType);
                    respondSpringPicFile.setImage(img);
                    respondSpringPicFile.setSpringPicFile(springPicFile);
                    return new ResponseEntity<RespondSpringPicFile>(respondSpringPicFile, HttpStatus.OK);
                }
            }


            //同一类实体之间的属性复制
//            ObjectCopyUtil<SpringPointInfo> uUtil = new ObjectCopyUtil<>();
//            uUtil.copyProperties(springPointInfo,entity);
//
//            springPointPic.setSpringPointInfo(springPointInfo);
//            springPointPic.setPicState(picState);
//            springPointPic.setUrl(img.getImageUrl());
//            springPointPic.setSpringPointInfo(springPointInfo);
//            springPointPic.setPicState(picState);
//            springPointPic.setUrl(img.getImageUrl());

            if (picState == null) {
                status = new HttpStatusContent(OutputState.FAIL, "picState为空！");
                return new ResponseEntity<>(status, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            if (springPointInfo == null) {

                status = new HttpStatusContent(OutputState.FAIL, "没有编号为" + codeNumber + "的温泉点，请先添加温泉点！");
                return new ResponseEntity<>(status, HttpStatus.INTERNAL_SERVER_ERROR);
            }


//            springPointPic.setSpringPointInfo(springPointInfo);
            springPointPic.setPicState(picState);
            springPointPic.setUrl(img.getImageName());
            springPointPic.setFilePath(ap);
            springPointPic.setPointId(pointId);

            //存入url
            springPointPic = springPicRepository.save(springPointPic);

//            springPointPics.add(springPointPic);
//            springPointInfo.setSpringPointPics(springPointPics);


            //保存点信息
//            springPointRepository.save(springPointInfo);
            //保存图文
            springPicFile.setCodeNumber(codeNumber);
            springPicFile.setFileName(originalFilename);
            springPicFile.setUrl(img.getImageName());
            springPicFile.setPointId(pointId);
            springPicFile.setPicState(picState);
            springPicFile.setCodeNumber(codeNumber);
            springPicFile.setPackageType(packageType);
            springPicFile.setPlottingScale("无");
            springPicFileRepository.save(springPicFile);
            respondSpringPicFile.setImage(img);
            respondSpringPicFile.setSpringPicFile(springPicFile);
            return new ResponseEntity<RespondSpringPicFile>(respondSpringPicFile, HttpStatus.OK);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            status = new HttpStatusContent(OutputState.FAIL);//未找到记录
            return new ResponseEntity<HttpStatusContent>(status, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    public void sameCodeStart(MultipartFile file, String codeNumber) {

        HttpStatusContent status;

        SpringPointInfo entity = new SpringPointInfo();

        SpringPointPic springPointPic = new SpringPointPic();
        SpringPointInfo springPointInfo = new SpringPointInfo();

        entity.setCodeNumber(codeNumber);
        String contentType = file.getContentType();
        String prefix = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1);

        String fileName = UUID.randomUUID().toString() + '.' + prefix;
        Image img = new Image();
        img.setImageName(fileName);
        img.setImageType(contentType);
    }
}
