package com.booledata.llspringparent.service;

import com.booledata.llspringparent.dao.SpringPointRepository;
import com.booledata.llspringparent.dao.SpringTypeRepository;
import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import com.booledata.llspringparent.model.springPoint.SpringPointType;
import com.booledata.llspringparent.utils.enums.PointType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.ArrayList;

@Service
public class SpringTypeService {

    @Autowired
    private SpringTypeRepository springTypeRepository;


    @Autowired
    private SpringPointRepository springPointRepository;

    public String deleteType(String pointId) {
        Integer integer = springTypeRepository.deleteByPointId(pointId);

        if (integer > 0) {
            return "success";
        } else {
            return "error";
        }

    }


    public Boolean saveType(SpringPointInfo springPointInfo) {

        BigInteger bigInteger = BigInteger.valueOf(111);
        boolean bool = false;
//
        ArrayList arrayList = new ArrayList();
        //温泉类型标准值（大于）
        double[] arr = {1000, 5, 500, 10, 2, 0.7, 50, 110, 35, 25};
        String type = "";
//        SpringPointType springPointType = springPointInfo.getSpringPointType();
        SpringPointType springPointType = new SpringPointType();
        if (springPointInfo.getDissolvedSolids() > arr[0]) {
            type += PointType.KQS.getTxt() + ",";
        }
        if (springPointInfo.getI2() > arr[1]) {
            type += PointType.I.getTxt() + ",";

        }
        if (springPointInfo.getCo2() > arr[2]) {
            type += PointType.CO2.getTxt() + ",";
        }
        if (springPointInfo.getFe() > arr[3]) {
            type += PointType.FE.getTxt() + ",";
        }
        if (springPointInfo.getHydrothion() > arr[4]) {
            type += PointType.H2S.getTxt() + ",";
        }
        if (springPointInfo.getAsa() > arr[5]) {
            type += PointType.AS.getTxt() + ",";
        }
        if (springPointInfo.getHsio() > arr[6]) {
            type += PointType.H2SIO3.getTxt() + ",";
        }
        if (springPointInfo.getRn() > arr[7]) {
            type += PointType.RN.getTxt() + ",";
        }
        if (springPointInfo.getHbo2() > arr[8]) {
            type += PointType.HBO2.getTxt() + ",";
        }
        if (springPointInfo.getBr2() > arr[9]) {
            type += PointType.BR.getTxt() + ",";
        }


        if (type.length()>0){
            springPointType.setPointType(type);
            SpringPointInfo save = springPointRepository.save(springPointInfo);
            springPointType.setPointId(save.getId());
            springPointInfo.setSpringPointType(springPointType);
            springPointRepository.save(save);
            return true;
        }else {
            springPointType.setPointType(type);
            SpringPointInfo save = springPointRepository.save(springPointInfo);
            springPointType.setPointId(save.getId());
            springPointInfo.setSpringPointType(springPointType);
            springPointRepository.save(save);
            return bool;
        }


    }



    public String getType(SpringPointInfo springPointInfo) {

        boolean bool = false;
//
        ArrayList arrayList = new ArrayList();
        //温泉类型标准值（大于）
        double[] arr = {1000, 5, 500, 10, 2, 0.7, 50, 110, 35, 25};
        String type = "";
//        SpringPointType springPointType = springPointInfo.getSpringPointType();
        SpringPointType springPointType = new SpringPointType();
        if (springPointInfo.getDissolvedSolids() > arr[0]) {
            type += PointType.KQS.getTxt() + ",";
        }
        if (springPointInfo.getI2() > arr[1]) {
            type += PointType.I.getTxt() + ",";

        }
        if (springPointInfo.getCo2() > arr[2]) {
            type += PointType.CO2.getTxt() + ",";
        }
        if (springPointInfo.getFe() > arr[3]) {
            type += PointType.FE.getTxt() + ",";
        }
        if (springPointInfo.getHydrothion() > arr[4]) {
            type += PointType.H2S.getTxt() + ",";
        }
        if (springPointInfo.getAsa() > arr[5]) {
            type += PointType.AS.getTxt() + ",";
        }
        if (springPointInfo.getHsio() > arr[6]) {
            type += PointType.H2SIO3.getTxt() + ",";
        }
        if (springPointInfo.getRn() > arr[7]) {
            type += PointType.RN.getTxt() + ",";
        }
        if (springPointInfo.getHbo2() > arr[8]) {
            type += PointType.HBO2.getTxt() + ",";
        }
        if (springPointInfo.getBr2() > arr[9]) {
            type += PointType.BR.getTxt() + ",";
        }
        if (type.length()>0){
            return type;
        }else {
            return "";
        }

    }
}
