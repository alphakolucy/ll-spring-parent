package com.booledata.llspringparent.service;

import com.alibaba.fastjson.JSONObject;
import com.baidu.aip.ocr.AipOcr;
import com.booledata.llspringparent.api.drawMap.SpringPointControllerApi;
import com.booledata.llspringparent.dao.SpringPicFileRepository;
import com.booledata.llspringparent.dao.SpringPicRepository;
import com.booledata.llspringparent.dao.SpringPointRepository;
import com.booledata.llspringparent.model.Image;
import com.booledata.llspringparent.model.UploadStatus;
import com.booledata.llspringparent.model.springPoint.SpringPicFile;
import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import com.booledata.llspringparent.model.springPoint.SpringPointPic;
import com.booledata.llspringparent.model.springPoint.response.RespondSpringPic;
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


/**
 *
 */
@Service
public class SpringPicFileService {

  private static final String PATH = "E:\\llspringservice-tomcat8\\webapps\\static";
//  private static final String PATH = "G:\\IDEA\\ll-spring-parent\\src\\main\\resources\\static";
   /* @Value("${upload.file.path}")
    private String PATH;
    upload.file.path=E:\\dong\\ll-spring-parent\\src\\main\\resources\\static*/
    @Autowired
    private SpringPicRepository springPicRepository;


    @Autowired
    private SpringPicFileRepository springPicFileRepository;

    @Autowired
    private SpringPointRepository springPointRepository;

    @Autowired
    private SpringPointControllerApi springPointControllerApi;

    public String deleteAllFileFromPoint(String id) {
        List<SpringPicFile> byPointId = springPicFileRepository.findByPointId(id);
        try {
            for (SpringPicFile springPicFile : byPointId) {
                String url = springPicFile.getUrl();
                SpringPointPic byUrl = springPicRepository.findByUrl(url);
                String filePath = byUrl.getFilePath();
                FileUtil.delete(filePath);
            }
            return "删除成功";
        } catch (Exception e) {
//            e.printStackTrace();
            return e.getMessage();
        }


    }
}
