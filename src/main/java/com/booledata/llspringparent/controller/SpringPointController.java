package com.booledata.llspringparent.controller;

import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelReader;
import com.alibaba.excel.read.builder.ExcelReaderBuilder;
import com.alibaba.excel.read.builder.ExcelReaderSheetBuilder;
import com.alibaba.excel.support.ExcelTypeEnum;
import com.booledata.llspringparent.api.drawMap.SpringPointControllerApi;
import com.booledata.llspringparent.common.model.response.CommonCode;
import com.booledata.llspringparent.dao.SpringPicFileRepository;
import com.booledata.llspringparent.dao.SpringPicRepository;
import com.booledata.llspringparent.dao.SpringPointRepository;
import com.booledata.llspringparent.dao.SpringTypeRepository;
import com.booledata.llspringparent.model.springPoint.SpringPicFile;
import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import com.booledata.llspringparent.model.springPoint.SpringPointPic;
import com.booledata.llspringparent.model.springPoint.SpringPointType;
import com.booledata.llspringparent.model.springPoint.response.SpringPicFileResult;
import com.booledata.llspringparent.model.springPoint.response.SpringPointResult;
import com.booledata.llspringparent.service.SpringPicFileService;
import com.booledata.llspringparent.service.SpringPicService;
import com.booledata.llspringparent.service.SpringTypeService;
import com.booledata.llspringparent.utils.*;
import com.booledata.llspringparent.utils.enums.OutputState;
import com.booledata.llspringparent.utils.enums.PointCategory;
import com.booledata.llspringparent.utils.tools.ObjectCopyUtil;
import com.gitee.sunchenbin.mybatis.actable.manager.common.BaseMysqlCRUDManager;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLIntegrityConstraintViolationException;
import java.text.ParseException;
import java.util.*;

/**
 * @author xlr
 * @description 温泉点
 * @date 2019/10/12
 **/
@RestController
@RequestMapping("/springPoint")
@Transactional(propagation = Propagation.SUPPORTS)
public class SpringPointController implements SpringPointControllerApi {

    @Autowired
    private SpringPointRepository springPointRepository;

    @Autowired
    private SpringPicService springPicService;


    @Autowired
    private SpringTypeService springTypeService;

    @Autowired
    private SpringTypeRepository springTypeRepository;


    @Autowired
    private SpringPicRepository springPicRepository;

    @Autowired
    private SpringPicFileService springPicFileService;

    @Autowired
    private SpringPicFileRepository springPicFileRepository;
    @Autowired
    private BaseMysqlCRUDManager baseMysqlCRUDManager;


    private static ArrayList<Integer> spState = new ArrayList<Integer>() {{
        add(10001);
        add(10002);
        add(10003);
        add(10004);
        add(10005);
        add(10006);
    }};

    @Override
    @GetMapping(produces = "application/json", value = "/findAllPage")
    public SpringPointResult findAllPage(SpringPointInfo entity, @PageableDefault(sort = {"createTime"}, direction = Sort.Direction.DESC) Pageable pageable) {
        HttpStatusContent status = null;


        //添加匹配规则  模糊查询 codeNumber address+
        SpringPointResult springPointResult = new SpringPointResult();
//        if (pageable.getPageSize()==0){
//
//        }
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("codeNumber", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
                .withMatcher("address", ExampleMatcher.GenericPropertyMatchers.contains())
                .withMatcher("pointCategory", ExampleMatcher.GenericPropertyMatchers.contains());
        Example<SpringPointInfo> example = Example.of(entity, matcher);

        Page<SpringPointInfo> springPoints = this.springPointRepository.findAll(example, pageable);
        return new SpringPointResult(springPoints, 200);
    }

    @Override
    @GetMapping(produces = "application/json")
    public ResponseEntity<?> findAll() {


        HttpStatusContent status = null;
        try {
            List<SpringPointInfo> all = this.springPointRepository.findAll();
            return new ResponseEntity<List<SpringPointInfo>>(all, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            status = new HttpStatusContent(OutputState.FAIL, "数据不存在！");
            return new ResponseEntity<>(status, HttpStatus.OK);
        }

    }

    @Override
    @GetMapping(produces = "application/json", value = "/{id}")
    public ResponseEntity<?> getOne(@PathVariable(value = "id") String id) {
        HttpStatusContent status = null;
        SpringPointInfo entity = this.springPointRepository.findOne(id);
        if (entity == null) {
            status = new HttpStatusContent(OutputState.FAIL, "数据不存在！");
            return new ResponseEntity<HttpStatusContent>(status, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @Override
    @PostMapping("/addPoint")
    public ResponseEntity<?> addPoint(SpringPointInfo entity) {
        HttpStatusContent status = null;

        PointCategoryUtil pointCategoryUtil = new PointCategoryUtil();

        //根据需求  X Y 各除500 存入realX realY
        entity.setRealX(entity.getY() / 500);
        entity.setRealY(entity.getX() / 500);

        //校验温泉点类型
        pointCategoryUtil.getPointCategory(entity, springPointRepository, springTypeService);

        springPointRepository.save(entity);
        if (entity == null) {
            status = new HttpStatusContent(OutputState.FAIL, "添加失败，请稍后重试！");
            return new ResponseEntity<HttpStatusContent>(status, HttpStatus.INTERNAL_SERVER_ERROR);
        }

//        //存入url
//        if (spState.contains(picState)) {
//            if (picState.equals(spState.get(5))) {
//                springPicService.saveFile(file, request, picState, entity);
//            } else {
//                springPicService.saveImg(file, type, request, picState, entity);
//            }
//        }

        status = new HttpStatusContent(OutputState.SUCCESS);
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @Override
    @PutMapping(produces = "application/json", value = "/{id}")
    public ResponseEntity<?> updatePoint(SpringPointInfo entity) {
        HttpStatusContent status = null;

        //根据需求  X Y 各除500 存入realX realY
        entity.setRealX(entity.getY() / 500);
        entity.setRealY(entity.getX() / 500);

        PointCategoryUtil pointCategoryUtil = new PointCategoryUtil();
        String pointId = entity.getId();
        SpringPointType springPointType = new SpringPointType();
        String type = springTypeService.getType(entity);
        SpringPointInfo springPointInfo = new SpringPointInfo();
        if ("正常".equals(entity.getStatus())) {
            SpringPointType byPointId = springTypeRepository.findByPointId(springPointInfo.getId());
            if (type != null) {
                //更改类型
                springPointType.setPointType(type);
                boolean b = false;
                if (type.length() > 0) {
                    b = true;
                    springPointInfo = pointCategoryUtil.selectPointCategory(entity, b);
                } else {
                    springPointInfo = pointCategoryUtil.selectPointCategory(entity, b);
                }
            }
        } else {
            springPointType.setPointType("");
        }
        SpringPointInfo exist = springPointRepository.findOne(pointId);
        SpringPointType existType = springTypeRepository.findByPointId(pointId);
        //创建时间为null 重新插入
        springPointInfo.setCreateTime(exist.getCreateTime());
        if (null == exist || null == existType) {
            System.out.println("SpringPointType inexistence!");
            status = new HttpStatusContent(OutputState.FAIL, "数据不存在！");
            return new ResponseEntity<HttpStatusContent>(status, HttpStatus.NOT_FOUND);
        }
        //校验温泉点类型
        pointCategoryUtil.getPointCategory(entity, springPointRepository, springTypeService);
        //同一类实体之间的属性复制
        ObjectCopyUtil<SpringPointInfo> uUtil = new ObjectCopyUtil<>();
        ObjectCopyUtil<SpringPointType> copyType = new ObjectCopyUtil<>();
        uUtil.copyProperties(entity, springPointInfo);
        copyType.copyProperties(springPointType, existType);
//		this.springTypeRepository.save(existType);
        springPointInfo.setSpringPointType(existType);
        springPointInfo = this.springPointRepository.save(springPointInfo);
        if (null == springPointInfo) {
            status = new HttpStatusContent(OutputState.FAIL, "修改失败，请稍后重试！");
            return new ResponseEntity<HttpStatusContent>(status, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        status = new HttpStatusContent(OutputState.SUCCESS);
        return new ResponseEntity<HttpStatusContent>(status, HttpStatus.OK);
    }

    @Override
    @DeleteMapping("/deletePoint")
    public ResponseEntity<?> deletePoint(String id) {
        HttpStatusContent status = null;
        //删除本地文件
        String s = springPicFileService.deleteAllFileFromPoint(id);
        //先删子表 不然级联删除报错
        springTypeRepository.deleteByPointId(id);
        springPicRepository.deleteByPointId(id);
        springPicFileRepository.deleteByPointId(id);
        //删除点
        springPointRepository.delete(id);
        status = new HttpStatusContent(OutputState.SUCCESS);
        return new ResponseEntity<HttpStatusContent>(status, HttpStatus.OK);
    }

    @Override
    @GetMapping("findAllPic")
    public List<SpringPointPic> findAllPic() {
        List<SpringPointPic> all = springPicRepository.findAll();
        return all;
    }


    @Override
    @GetMapping("findOnePic")
    public List<SpringPointPic> findPointPic(String id) {

        if (id != null) {
            SpringPointInfo one = springPointRepository.findOne(id);

            if (one.getId() != null) {
                String pointId = one.getId();
                return springPicRepository.findByPointId(pointId);
            } else {
                return null;
            }

        } else {
            return null;
        }

    }


    /**
     * @param file
     * @param req
     * @return SpringPointResult
     * @throws IllegalStateException
     * @throws IOException
     * @throws ParseException
     * @Description: 导入excel 存库
     */
    @RequestMapping("/importToSave")
    @ResponseBody
    public SpringPointResult saveSpringPoint(@RequestParam("file") MultipartFile file, HttpServletRequest req) throws IllegalStateException, IOException {
//				throws IllegalStateException, IOException, ParseException,SQLIntegrityConstraintViolationException

        HttpStatusContent status = null;
//
        PointCategoryUtil pointCategoryUtil = new PointCategoryUtil();
        if (file.isEmpty()) {
            return null;
        }
//        String path = file.getClass().getClassLoader().getResource("").getPath() + "static/excel";
        String path = "E:\\llspringservice-tomcat8\\webapps\\static\\excel";
        // 获取原文件名
        String fileName = file.getOriginalFilename();
//        String subPath = path.substring(1, path.length());

        System.out.println("path:" + path);
//        System.out.println("path:" + subPath);
        // 创建文件实例w
        File filePath1 = new File(path, fileName);
//        File filePath1 = new File(subPath, fileName);
        // 如果文件目录不存在，创建目录
        if (!filePath1.getParentFile().exists()) {
            filePath1.getParentFile().mkdirs();
            System.out.println("创建目录" + filePath1);
        }
        List<Object> values = new ArrayList<>();
        // 读取文件
        file.transferTo(filePath1);
        String absolutePath = filePath1.getAbsolutePath();
        List<Object> objects = EasyExcelUtil.readMoreThan1000Row(absolutePath);
        values.addAll(objects.subList(1, objects.size()));
        Integer integer = 0;

        //存入数据库
        for (Object ob : values) {
            System.out.println(ob);
            if (!ob.toString().isEmpty()) {
                try {
                    SpringPointInfo springPointInfo = new SpringPointInfo();
                    String s = ob.toString();
                    String substring = s.substring(1, s.length() - 1);
                    String[] obArr = substring.split(",");
                    springPointInfo.setCodeNumber(obArr[0]!=null?obArr[0].trim():"");
                    springPointInfo.setAddress(obArr[1]!=null?obArr[1].trim():"");
                    springPointInfo.setX(obArr[2]!=null?Double.parseDouble(obArr[2]):0);
                    springPointInfo.setY(obArr[3]!=null?Double.parseDouble(obArr[3]):0);
                    //根据需求  X Y 各除500 对调存入realX realY   数组顺序查询Api.js的pointtabletitles
                    springPointInfo.setRealX(obArr[2]!=null?Double.parseDouble(obArr[2]) / 500:0);
                    springPointInfo.setRealY(obArr[3]!=null?Double.parseDouble(obArr[3]) / 500:0);
                    springPointInfo.setZ(obArr[4]!=null?Double.parseDouble(obArr[4]):0);
                    springPointInfo.setWaterInflow(obArr[5]!=null?obArr[5].trim():"");
                    springPointInfo.setPh(obArr[6]!=null?obArr[6].trim():"");
                    springPointInfo.setTrepanning(obArr[7]!=null?obArr[7].trim():"");
                    springPointInfo.setWaterOutlet(obArr[8]!=null?obArr[8].trim():"");
                    springPointInfo.setHoleDepth(obArr[9]!=null?Double.parseDouble(obArr[9]):0);
                    springPointInfo.setHydrochemicalType(obArr[10]!=null?obArr[10].trim():"");
                    springPointInfo.setReservoirUnit(obArr[11]!=null?obArr[11].trim():"");
                    springPointInfo.setStatus(obArr[12]!=null?obArr[12].trim():"");
                    springPointInfo.setWaterTemperature(obArr[13]!=null?Double.parseDouble(obArr[13]):0);
                    springPointInfo.setDissolvedSolids(obArr[14]!=null?Double.parseDouble(obArr[14]):0);
                    springPointInfo.setCo2(obArr[15]!=null?Double.parseDouble(obArr[15]):0);
                    springPointInfo.setHydrothion(obArr[16]!=null?Double.parseDouble(obArr[16]):0);
                    springPointInfo.setHsio(obArr[17]!=null?Double.parseDouble(obArr[17]):0);
                    springPointInfo.setHbo2(obArr[18]!=null?Double.parseDouble(obArr[18]):0);
                    springPointInfo.setBr2(obArr[19]!=null?Double.parseDouble(obArr[19]):0);
                    springPointInfo.setI2(obArr[20]!=null?Double.parseDouble(obArr[20]):0);
                    springPointInfo.setFe(obArr[21]!=null?Double.parseDouble(obArr[21]):0);
                    springPointInfo.setAsa(obArr[22]!=null?Double.parseDouble(obArr[22]):0);
                    springPointInfo.setRn(obArr[23]!=null?Double.parseDouble(obArr[23]):0);
                    springPointInfo.setEpidemiologicalSurvey(obArr[24]!=null?obArr[24].trim():"");
                    springPointInfo.setEfficacyInterventionExperiment(obArr[25]!=null?obArr[25].trim():"");
                    springPointInfo.setGeneticDissection(obArr[26]!=null?obArr[26].trim():"");

                    //校验温泉点类型
                    //存入类型
                    SpringPointInfo save = springPointRepository.save(pointCategoryUtil.getPointCategory(springPointInfo, springPointRepository, springTypeService));
                } catch (Exception e) {

                    e.printStackTrace();
                    System.out.println("循环抛出异常:"+e.getMessage());
                }
//                integer = baseMysqlCRUDManager.save(springPointInfo);
//                System.out.println("保存返回integer:" + integer);
            }
        }

        return new SpringPointResult(0);
    }


    @GetMapping(produces = "application/json", value = "/findPicFileHistory")
    public SpringPicFileResult findPicFileList(@RequestParam("pointId") String pointId, @RequestParam("picState") Integer picState, Integer packageType) {
        HttpStatusContent status = null;


        SpringPicFile entity = new SpringPicFile();
        if (packageType != null) {
            entity.setPackageType(packageType);
        }
        entity.setPicState(picState);
        entity.setPointId(pointId);
        //添加匹配规则  模糊查询 codeNumber address+
        SpringPointResult springPointResult = new SpringPointResult();
//        if (pageable.getPageSize()==0){
//        }
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("picState", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
                .withMatcher("pid", ExampleMatcher.GenericPropertyMatchers.contains());

        Example<SpringPicFile> example = Example.of(entity, matcher);

        List<SpringPicFile> all = this.springPicFileRepository.findAll(example);
        return new SpringPicFileResult(all, 200);
    }


    @Override
    @DeleteMapping("/deletePicFileHis")
    public SpringPicFileResult deletePicFileHis(Integer id) {
        SpringPicFile one = springPicFileRepository.findById(id);
        SpringPointPic springPointPic = springPicRepository.selectByUrl(one.getUrl());
        springPicFileRepository.deleteById(id);
        String filePath = springPointPic.getFilePath();
        System.out.println("springPointPic:" + springPointPic.toString());
        if (filePath != null) {
            FileUtil.delete(filePath);
        } else {
            System.out.println("当前文件不存在或已删除");
            return new SpringPicFileResult(404);
        }
        return new SpringPicFileResult(200);
    }


    @GetMapping("/findPointAllPicFile")
    public SpringPicFileResult findPointAllPic(SpringPicFile entity, @PageableDefault(sort = {"createTime"}, direction = Sort.Direction.DESC) Pageable pageable) {
        //添加匹配规则  模糊查询 codeNumber address+
        SpringPointResult springPointResult = new SpringPointResult();
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("codeNumber", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
                .withMatcher("picState", ExampleMatcher.GenericPropertyMatchers.contains())
                .withMatcher("fileName", ExampleMatcher.GenericPropertyMatchers.contains());
        Example<SpringPicFile> example = Example.of(entity, matcher);
        List<SpringPicFile> all = springPicFileRepository.findAll(example);
        return new SpringPicFileResult(all, 200);
    }

}
