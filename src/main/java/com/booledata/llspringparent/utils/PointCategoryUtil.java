package com.booledata.llspringparent.utils;

import com.booledata.llspringparent.dao.SpringPointRepository;
import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import com.booledata.llspringparent.service.SpringTypeService;
import com.booledata.llspringparent.utils.enums.PointCategory;

import java.util.ArrayList;
import java.util.List;

public class PointCategoryUtil {


	public SpringPointInfo selectPointCategory(SpringPointInfo springPointInfo, boolean b) {
		//当前状态  无资料，施工中，废弃
		String statu = springPointInfo.getStatus();
		String codeNumber = springPointInfo.getCodeNumber();

		//温泉地区流行病学调查a
		String epidemiologicalSurvey = springPointInfo.getEpidemiologicalSurvey();

		//温泉理疗功效干预实验
		String efficacyInterventionExperiment = springPointInfo.getEfficacyInterventionExperiment();

		//理疗温泉成因解剖
		String geneticDissection = springPointInfo.getGeneticDissection();
//        String substring = codeNumber.substring(0, 1);
		String[] status = {"无资料", "不达标", "废弃"};
		codeNumber = codeNumber.trim();

		if (codeNumber.contains("S") || codeNumber.contains("s")) {

			if (b) {
				if ("是".equals(epidemiologicalSurvey) || "是".equals(efficacyInterventionExperiment)) {
					springPointInfo.setLlStatus(PointCategory.LLGXYJD.getValue());
					if ("是".equals(geneticDissection)) {
						springPointInfo.setLlStatus(PointCategory.BOTHLLCY.getValue());
						return springPointInfo;
					}
				}else if ("是".equals(geneticDissection)) {
					springPointInfo.setLlStatus(PointCategory.SGZRKSZK.getValue());
					return springPointInfo;
				}
				springPointInfo.setPointCategory(PointCategory.S.getValue());
				return springPointInfo;
			} else if (statu.equals(status[0])) {
				springPointInfo.setPointCategory(PointCategory.SWZL.getValue());
				return springPointInfo;
			} else if (statu.equals(status[2])) {
				springPointInfo.setPointCategory(PointCategory.SFQ.getValue());
				return springPointInfo;
			} else if ("是".equals(epidemiologicalSurvey) || "是".equals(efficacyInterventionExperiment)) {
				springPointInfo.setLlStatus(PointCategory.LLGXYJD.getValue());
				if ("是".equals(geneticDissection)) {
					springPointInfo.setLlStatus(PointCategory.BOTHLLCY.getValue());
				}
				return springPointInfo;
			} else if ("是".equals(geneticDissection)) {
				springPointInfo.setLlStatus(PointCategory.SGZRKSZK.getValue());
				return springPointInfo;
			} else {
				springPointInfo.setPointCategory(PointCategory.SBDB.getValue());
				return springPointInfo;
			}


		} else if (codeNumber.contains("D") || codeNumber.contains("d")) {

			//判断是否是施工中地热井
			boolean reach = getReach(springPointInfo);
			if (b) {
				if ("是".equals(epidemiologicalSurvey) || "是".equals(efficacyInterventionExperiment)) {
					springPointInfo.setLlStatus(PointCategory.LLGXYJD.getValue());
					if ("是".equals(geneticDissection)) {
						springPointInfo.setLlStatus(PointCategory.BOTHLLCY.getValue());
						return springPointInfo;
					}
				}else if ("是".equals(geneticDissection)) {
					springPointInfo.setLlStatus(PointCategory.SGZRKSZK.getValue());
					return springPointInfo;
				}
				springPointInfo.setPointCategory(PointCategory.DR.getValue());
				return springPointInfo;
			} else if (statu.equals(status[0])) {
				springPointInfo.setPointCategory(PointCategory.DRWZL.getValue());
				return springPointInfo;
			} else if (statu.equals(status[2])) {
				springPointInfo.setPointCategory(PointCategory.DRFQ.getValue());
				return springPointInfo;
			} else if ("是".equals(epidemiologicalSurvey) || "是".equals(efficacyInterventionExperiment)) {
				springPointInfo.setLlStatus(PointCategory.LLGXYJD.getValue());
				if ("是".equals(geneticDissection)) {
					springPointInfo.setLlStatus(PointCategory.BOTHLLCY.getValue());
					return springPointInfo;
				}
				return springPointInfo;
			} else if ("是".equals(geneticDissection)) {
				springPointInfo.setLlStatus(PointCategory.SGZRKSZK.getValue());
				return springPointInfo;
			} else {
				springPointInfo.setPointCategory(PointCategory.DRBDB.getValue());
				return springPointInfo;
			}
		} else {
			springPointInfo.setPointCategory(PointCategory.NCANCEL.getValue());
			return springPointInfo;
		}

	}


	public boolean getReach(SpringPointInfo springPointInfo) {
		List<Double> standValue = new ArrayList<>();
		Integer sumStand = 0;
		standValue.add(springPointInfo.getDissolvedSolids());
		standValue.add(springPointInfo.getCo2());
		standValue.add(springPointInfo.getHydrothion());
		standValue.add(springPointInfo.getHsio());
		standValue.add(springPointInfo.getHbo2());
		standValue.add(springPointInfo.getBr2());
		standValue.add(springPointInfo.getI2());
		standValue.add(springPointInfo.getFe());
		standValue.add(springPointInfo.getAsa());
		standValue.add(springPointInfo.getRn());


		for (Double aDouble : standValue) {
			if (aDouble == 0) {
				sumStand++;
				if (sumStand >= 10) {
					return true;
				}
			} else {
				return false;
			}
		}
		return false;
	}


	public SpringPointInfo getPointCategory(SpringPointInfo springPointInfo, SpringPointRepository springPointRepository, SpringTypeService springTypeService) {
		SpringPointInfo entity = new SpringPointInfo();
		//判断温泉是否达标(
		Double waterTemperature = 36.0;
		String statu = "正常";
		String[] status = {"无资料", "不达标", "废弃"};
//        springPointRepository.save(springPointInfo);
		String pointStatus = springPointInfo.getStatus();
		Double waterTemperature1 = springPointInfo.getWaterTemperature();
		boolean equals = statu.equals(pointStatus);
		boolean equals1 = waterTemperature1 >= waterTemperature;
		//温度大于等于36°进行判断  否则为不达标
		if (waterTemperature1 >= waterTemperature && statu.equals(pointStatus)) {
			boolean b = springTypeService.saveType(springPointInfo);
			//温度达标亦为达标温泉点
			if (springPointInfo.getWaterTemperature()>=36){
				b =true;
			}
			return selectPointCategory(springPointInfo, b);
		} else if (status[0].equals(pointStatus) || status[2].equals(pointStatus)) {
//            Integer  pointCategory=PointCategory.WZL.getTxt().equals(pointStatus)? PointCategory.WZL.getValue():PointCategory.FQ.getValue();
//            springPointInfo.setPointCategory(pointCategory);
			Boolean aBoolean = springTypeService.saveType(springPointInfo);

			return selectPointCategory(springPointInfo, aBoolean);
		} else {
			boolean bo = false;
			springTypeService.saveType(springPointInfo);
			return selectPointCategory(springPointInfo, bo);
		}
	}
}
