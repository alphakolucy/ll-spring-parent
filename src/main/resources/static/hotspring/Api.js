var apiUrl = "http://localhost:8090";
var pointrotiox = 500;//点坐标x缩放比例
var pointrotioy = 500;//点坐标y缩放比例
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
    "waterTemperature": "水温",
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
    "reservoirUnit":"热储单元",
    "status":"温泉状态",
    "waterTemperature": "水温",
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
    "pointCategory": "温泉类型",
    "createTime": "创建时间"
};

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
                    switch (jsonData[i][item]) {
                        case 30001:
                            str += "<td>天然温泉\t</td>";
                            break;
                        case 30002:
                            str += "<td>地热井\t</td>";
                            break;
                        case 30003:
                            str += "<td>施工中热矿水转孔\t</td>";
                            break;
                        case -30001:
                            str += "<td>不达标温泉\t</td>";
                            break;
                        case -30002:
                            str += "<td>不达标地热\t</td>";
                            break;
                        case -30004:
                            str += "<td>无资料\t</td>";
                            break;
                        case -30005:
                            str += "<td>废弃\t</td>";
                            break;
                        default:
                            str += "<td>未分类\t</td>";
                            break;
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

//温泉点测试数据
var visualpoint = [{
    "latlng": [1558.156759601893, 6416.941167692173],
    "properties": {
        "dissolvedSolids": 10001,
        "co2": Math.floor(Math.random()),
        "hydrothion": Math.floor(Math.random()),
        "hsio": Math.floor(Math.random()),
        "hbo2": Math.floor(Math.random()),
        "br2": Math.floor(Math.random()),
        "i2": Math.floor(Math.random()),
        "fe": Math.floor(Math.random()),
        "asa": Math.floor(Math.random()),
        "rn": Math.floor(Math.random()),
        "name": "矿泉水",
        "codeNumber": 100001
    }
},
    {
        "latlng": [1337.9366231342924, 5688.141157241805],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": 501,
            "hydrothion": Math.floor(Math.random()),
            "hsio": Math.floor(Math.random()),
            "hbo2": Math.floor(Math.random()),
            "br2": Math.floor(Math.random()),
            "i2": Math.floor(Math.random()),
            "fe": Math.floor(Math.random()),
            "asa": Math.floor(Math.random()),
            "rn": Math.floor(Math.random()),
            "name": "碳酸水",
            "codeNumber": 100002
        }
    },
    {
        "latlng": [1583.6585023737064, 5853.381356395495],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": Math.floor(Math.random()),
            "hydrothion": 3,
            "hsio": Math.floor(Math.random()),
            "hbo2": Math.floor(Math.random()),
            "br2": Math.floor(Math.random()),
            "i2": Math.floor(Math.random()),
            "fe": Math.floor(Math.random()),
            "asa": Math.floor(Math.random()),
            "rn": Math.floor(Math.random()),
            "name": "硫化氢水",
            "codeNumber": 100003
        }
    },
    {
        "latlng": [1069.1403459809264, 5865.449171819021],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": Math.floor(Math.random()),
            "hydrothion": Math.floor(Math.random()),
            "hsio": 51,
            "hbo2": Math.floor(Math.random()),
            "br2": Math.floor(Math.random()),
            "i2": Math.floor(Math.random()),
            "fe": Math.floor(Math.random()),
            "asa": Math.floor(Math.random()),
            "rn": Math.floor(Math.random()),
            "name": "硅酸水",
            "codeNumber": 100004
        }
    },
    {
        "latlng": [1327.0387774299284, 5879.417466329692],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": Math.floor(Math.random()),
            "hydrothion": Math.floor(Math.random()),
            "hsio": Math.floor(Math.random()),
            "hbo2": 36,
            "br2": Math.floor(Math.random()),
            "i2": Math.floor(Math.random()),
            "fe": Math.floor(Math.random()),
            "asa": Math.floor(Math.random()),
            "rn": Math.floor(Math.random()),
            "name": "硼酸水",
            "codeNumber": 100005
        }
    },
    {
        "latlng": [1343.7663418306565, 5859.614069646941],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": Math.floor(Math.random()),
            "hydrothion": Math.floor(Math.random()),
            "hsio": Math.floor(Math.random()),
            "hbo2": Math.floor(Math.random()),
            "br2": 6,
            "i2": Math.floor(Math.random()),
            "fe": Math.floor(Math.random()),
            "asa": Math.floor(Math.random()),
            "rn": Math.floor(Math.random()),
            "name": "碘水",
            "codeNumber": 100006
        }
    },
    {
        "latlng": [1185.4862450271612, 5923.353686311734],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": Math.floor(Math.random()),
            "hydrothion": Math.floor(Math.random()),
            "hsio": Math.floor(Math.random()),
            "hbo2": Math.floor(Math.random()),
            "br2": Math.floor(Math.random()),
            "i2": 11,
            "fe": Math.floor(Math.random()),
            "asa": Math.floor(Math.random()),
            "rn": Math.floor(Math.random()),
            "name": "铁水",
            "codeNumber": 100007
        }
    },
    {
        "latlng": [1646.2309305244903, 5877.6395040083835],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": Math.floor(Math.random()),
            "hydrothion": Math.floor(Math.random()),
            "hsio": Math.floor(Math.random()),
            "hbo2": Math.floor(Math.random()),
            "br2": Math.floor(Math.random()),
            "i2": Math.floor(Math.random()),
            "fe": 0.8,
            "asa": Math.floor(Math.random()),
            "rn": Math.floor(Math.random()),
            "name": "砷水",
            "codeNumber": 100008
        }
    },
    {
        "latlng": [1559.2078926797144, 5881.841633252836],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": Math.floor(Math.random()),
            "hydrothion": Math.floor(Math.random()),
            "hsio": Math.floor(Math.random()),
            "hbo2": Math.floor(Math.random()),
            "br2": Math.floor(Math.random()),
            "i2": Math.floor(Math.random()),
            "fe": Math.floor(Math.random()),
            "asa": 111,
            "rn": Math.floor(Math.random()),
            "name": "氡水",
            "codeNumber": 100009
        }
    },
    {
        "latlng": [1458.580120648891, 5922.612347354173],
        "properties": {
            "dissolvedSolids": Math.floor(Math.random()),
            "co2": Math.floor(Math.random()),
            "hydrothion": Math.floor(Math.random()),
            "hsio": Math.floor(Math.random()),
            "hbo2": Math.floor(Math.random()),
            "br2": Math.floor(Math.random()),
            "i2": Math.floor(Math.random()),
            "fe": Math.floor(Math.random()),
            "asa": Math.floor(Math.random()),
            "rn": 26,
            "name": "溴水",
            "codeNumber": 100010
        }
    },
];
