var apiUrl = "http://localhost:8090"; //接口通用服务器地址
var pointrotiox = 500; //点坐标x缩放比例
var pointrotioy = 500; //点坐标y缩放比例
//水质对应中文 查询字段选择
var waterstanardsearch = [
	{
		"id": "waterTemperature",
		"name": "温度"
	},
	{
		"id": "dissolvedSolids",
		"name": "溶解性总固体"
	},
	{
		"id": "co2",
		"name": "二氧化碳"
	},
	{
		"id": "hydrothion",
		"name": "总硫化氢"
	},
	{
		"id": "hsio",
		"name": "偏硅酸"
	},
	{
		"id": "hbo2",
		"name": "偏硼酸"
	},
	{
		"id": "br2",
		"name": "溴"
	},
	{
		"id": "i2",
		"name": "碘"
	},
	{
		"id": "fe",
		"name": "总铁"
	},
	{
		"id": "asa",
		"name": "砷"
	},
	{
		"id": "rn",
		"name": "氡"
	},
];
//水质标准
var waterstanard = {
	"waterTemperature": 36,
	"dissolvedSolids": 1000,
	"co2": 500,
	"hydrothion": 2,
	"hsio": 50,
	"hbo2": 35,
	"br2": 25,
	"i2": 5,
	"fe": 10,
	"asa": 0.7,
	"rn": 110,
};
//详情显示字段
var showproperties = {
	"codeNumber": "编号",
	"address": "位置名称",
	"x": "x",
	"y": "y",
	"z": "海拔",
	"holeDepth": "孔深",
	"ph": "PH",
	"waterTemperature": "温度",
	"waterInflow": "涌水量",
	"trepanning": "开孔/出露层位",
	"waterOutlet": "出水段",
	"dissolvedSolids": "溶解性总固体",
	"co2": "二氧化碳",
	"hydrothion": "总硫化氢",
	"hsio": "偏硅酸",
	"hbo2": "偏硼酸",
	"br2": "溴",
	"i2": "碘",
	"fe": "总铁",
	"asa": "砷",
	"rn": "氡",
	"hydrochemicalType": "水化学类型"
};
//导出数据文件表头
var pointtabletitles = {
	"id": "ID",
	"codeNumber": "编号",
	"address": "位置名称",
	"x": "x",
	"y": "y",
	"z": "海拔",
	"waterInflow": "涌水量",
	"ph": "PH",
	"trepanning": "开孔/出露层位",
	"waterOutlet": "出水段",
	"holeDepth": "孔深",
	"hydrochemicalType": "水化学类型",
	"reservoirUnit": "热储单元",
	"status": "温泉状态",
	"waterTemperature": "温度",
	"dissolvedSolids": "溶解性总固体",
	"co2": "二氧化碳",
	"hydrothion": "总硫化氢",
	"hsio": "偏硅酸",
	"hbo2": "偏硼酸",
	"br2": "溴",
	"i2": "碘",
	"fe": "总铁",
	"asa": "砷",
	"rn": "氡",
	"epidemiologicalSurvey": "温泉地区流行病学调查",
	"efficacyInterventionExperiment": "温泉理疗功效干预实验",
	"geneticDissection": "理疗温泉成因解剖",
	"pointCategory": "理疗类型",
	"createTime": "创建时间"
};
//将数据导出为Excel
//参数说明 导出数据表头  导出数据
function tableToExcel(tabletitles, jsonData) {
	//列标题，逗号隔开，每一个逗号就是隔开一个单元格
	let str = "<tr>";
	for (let item in tabletitles) {
		str += `<td>${tabletitles[item] + '\t'}</td>`;
	}
	str += '</tr>';
	// `姓名,电话,邮箱\n`;
	//增加\t为了不让表格显示科学计数法或者其他格式
	for (let i = 0; i < jsonData.length; i++) {
		str += '<tr>';
		for (let item in tabletitles) {
			if (jsonData[i].hasOwnProperty(item)) {
				if (item == "pointCategory") {
					//将数据库的温泉编码转换为对应的温泉类型
					if (jsonData[i][item] == 30001) {
						str += "<td>天然温泉\t</td>";
					}else if (jsonData[i][item] == -30002) {
						str += "<td>不达标温泉\t</td>";
					} else if (jsonData[i][item] == -30003) {
						str += "<td>无资料温泉\t</td>";
					}else if (jsonData[i][item] == -30004) {
						str += "<td>废弃温泉\t</td>";
					}else if (jsonData[i][item] == 30005) {
						str += "<td>地热井\t</td>";
					}else if (jsonData[i][item] == 30006) {
						str += "<td>施工中地热井\t</td>";
					}else if (jsonData[i][item] == -30007) {
						str += "<td>不达标地热井\t</td>";
					}else if (jsonData[i][item] == -30008) {
						str += "<td>废弃地热井\t</td>";
					}else if (jsonData[i][item] == -30009) {
						str += "<td>无资料地热井\t</td>";
					}else if (jsonData[i][item] == 30010) {
						str += "<td>理疗功效研究点\t</td>";
					}else if (jsonData[i][item] == 30011) {
						str += "<td>成因解剖研究点\t</td>";
					}else if (jsonData[i][item] == 30012) {
						str += "<td>理疗功效成因解剖研究点\t</td>";
					}else if (jsonData[i][item] == -30012) {
						str += "<td>录入编号异常\t</td>";
					}
				} else {
					str += `<td>${jsonData[i][item] + '\t'}</td>`;
				}
			}
		}
		str += '</tr>';
	}
	//Worksheet名
	let worksheet = '温泉点数据'
	let uri = 'data:application/vnd.ms-excel;base64,';

	//下载的表格模板数据
	let template =
		`<html xmlns:o="urn:schemas-microsoft-com:office:office" 
	      xmlns:x="urn:schemas-microsoft-com:office:excel" 
	      xmlns="http://www.w3.org/TR/REC-html40">
	      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
	        <x:Name>${worksheet}</x:Name>
	        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
	        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
	        </head><body><table>${str}</table></body></html>`;
	//下载模板
	let link = document.createElement("a");
	link.href = uri + base64(template);
	//对下载的文件命名
	link.download = "温泉点数据.xls";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

}

//输出base64编码
function base64(s) {
	return window.btoa(unescape(encodeURIComponent(s)))
}
//将数据导出为CSV文件
//参数说明 导出数据表头 导出数据
function tableToExcelcsv(tabletitles, jsonData) {
	//列标题，逗号隔开，每一个逗号就是隔开一个单元格
	tabletitletext = [];
	for (let item in tabletitles) {
		tabletitletext.push(tabletitles[item])
	}
	let str = tabletitletext.join(',') + "\n";
	// `姓名,电话,邮箱\n`;
	//增加\t为了不让表格显示科学计数法或者其他格式
	for (let i = 0; i < jsonData.length; i++) {
		for (let item in tabletitles) {
			if (jsonData[i].hasOwnProperty(item)) {
				if (item == "pointCategory") {
					//将数据中的温泉编码转换为对应的温泉类型
					switch (jsonData[i][item]) {
						case 30001:
							str += "天然温泉\t,";
							break;
						case 30002:
							str += "地热井\t,";
							break;
						case 30003:
							str += "施工中热矿水转孔\t,";
							break;
						case -30001:
							str += "不达标温泉\t,";
							break;
						case -30002:
							str += "不达标地热\t,";
							break;
						case -30004:
							str += "无资料\t,";
							break;
						case -30005:
							str += "废弃\t,";
							break;
						default:
							str += "未分类\t,";
							break;
					}
				} else {
					str += `${jsonData[i][item] + '\t'},`;
				}
			}
		}
		str += '\n';
	}
	//encodeURIComponent解决中文乱码
	let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
	//通过创建a标签实现
	let link = document.createElement("a");
	link.href = uri;
	//对下载的文件命名
	link.download = "温泉点数据.csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
