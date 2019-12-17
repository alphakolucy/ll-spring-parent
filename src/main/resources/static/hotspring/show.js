// 自定义坐标系,Leaflet框架默认的坐标系为EPSG:4326
proj4.defs("EPSG:2385",
	"+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
// proj4.defs("EPSG:2385",
// 	"+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=1500000 +y_0=-3000000 +a=6378140 +b=6356755.288157528 +units=m +no_defs"
// );
var mapcenter = [0.05352918955315693, 115.52501678466798]; //地图默认显示中心
var mapzoom = 16; //地图默认显示级别
// 地图实例化
var map = L.map('map', {
	center: mapcenter, //中心
	zoom: mapzoom, //级别
	minZoom: 15, //最小级别
	maxZoom: 21, //最大级别
	crs: L.CRS.EPSG4326,
	zoomControl: false,
	attributionControl: false,
});

var curpointjson = {}; //当前点击温泉点数据
var allpointdata = {}; //所有查询到的温泉点数据
var getpointlist; //获取数据库中所有的温泉点函数
var showtype = 2; //1 直接点地图点上面显示 2 弹出详情框

// 地图图层定义
var provincelayer = new L.layerGroup();
var picturelayer = new L.layerGroup();
var citynamelayer = new L.layerGroup();
var trafficlayer = new L.layerGroup();
var highspeedlayer = new L.layerGroup();
var hotspringslayer = new L.layerGroup();
// 地图图层添加
picturelayer.addTo(map);
provincelayer.addTo(map);
citynamelayer.addTo(map);
trafficlayer.addTo(map);
highspeedlayer.addTo(map);
hotspringslayer.addTo(map);
// 地图打印插件实例化
var printer = L.easyPrint({
	tileLayer: null,
	sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
	filename: 'myMap',
	exportOnly: true,
	tileWait: 200,
	hideControlContainer: true,
	hidden: true
}).addTo(map);


//添加地图图名及地图比例尺
function addmapname() {
	var geojson = {
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [971.1033678379731, 6402.224912442785]
		},
		crs: {
			type: "name",
			properties: {
				name: "EPSG:2385"
			}
		}
	};
	var myIcontext = L.divIcon({
		html: "",
		/* 贵州理疗温泉（地热水）调查评价工作布置图*/
		className: 'map-name17',
		iconSize: 30,
	});
	L.Proj.geoJson(geojson, {
		pointToLayer: function(feature, latlng) {
			return L.marker(latlng, {
				icon: myIcontext,
			});
		},
	}).addTo(picturelayer);



	var geojson1 = {
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [951.1033678379731, 6402.224912442785]
		},
		crs: {
			type: "name",
			properties: {
				name: "EPSG:2385"
			}
		}
	};
	var myIcontextscale = L.divIcon({
		html: "&nbsp; &nbsp; &nbsp; 1:500000",
		className: 'map-scale17',
		iconSize: 30,
	});
	L.Proj.geoJson(geojson1, {
		pointToLayer: function(feature, latlng) {
			return L.marker(latlng, {
				icon: myIcontextscale,
			});
		},
	}).addTo(picturelayer);
}
addmapname();
// 添加温泉点到地图上
// 参数说明 纬度 经度 点属性
function readdpoint(lat, lng, properties) {
	var relat = lat / pointrotiox;
	var relng = lng / pointrotioy;
	// 定义点样式
	var geojsonMarkerOptions = {
		radius: 1,
		fillColor: "#ff7800",
		color: "blue",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.6
	};
	//点对象
	var geojson = {
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [relng, relat]
		},
		crs: {
			type: "name",
			properties: {
				name: "EPSG:2385"
			}
		},
		properties: properties
	};
	// 点图标设置
	var pointiconUrl = 'img/hotspring-yellow.png';
	if (properties.pointCategory == 30001) {
		pointiconUrl = 'img/hotspring.png'; //温泉-达标
	} else if (properties.pointCategory == -30002) {
		pointiconUrl = 'img/hotspring-gray.png'; //温泉-不达标
	} else if (properties.pointCategory == -30003) {
		pointiconUrl = 'img/hotspring-yellow.png'; //温泉-无资料
	} else if (properties.pointCategory == -30004) {
		pointiconUrl = 'img/hotspring-black.png'; //温泉-废弃
	} else if (properties.pointCategory == 30005) {
		pointiconUrl = 'img/build.png'; //地热井-达标
	} else if (properties.pointCategory == 30006) {
		pointiconUrl = 'img/build-drill.png'; //地热井-施工
	} else if (properties.pointCategory == -30007) {
		pointiconUrl = 'img/build-gray.png'; //地热井-不达标
	} else if (properties.pointCategory == -30008) {
		pointiconUrl = 'img/build-discard.png'; //地热井-废弃
	} else if (properties.pointCategory == -30009) {
		pointiconUrl = 'img/build-nodata.png'; //地热井-无资料
	} else if (properties.llstatus == 30010) {
		pointiconUrl = 'img/anatomy.png'; //理疗功效研究点
	} else if (properties.llstatus == 30011) {
		pointiconUrl = 'img/effect.png'; //成因解剖研究点
	}else if (properties.llstatus == 30012) {
		pointiconUrl = 'img/anatomyeffect.png'; //理疗功效成因解剖研究点
	}else if (properties.pointCategory == -30012) {
		pointiconUrl = 'img/default.png'; //录入编号异常
	}
	// 点样式实例化
	var myIcon = L.icon({
		iconUrl: pointiconUrl,
		iconSize: [20, 20],
		iconAnchor: [10, 10],
		popupAnchor: [10, 10],
		// shadowUrl: 'my-icon-shadow.png',
		// shadowSize: [68, 95],
		// shadowAnchor: [22, 94]
	});
	var myIcontext = L.divIcon({
		html: properties.codeNumber,
		className: 'my-div-icon',
		iconSize: 30,
	});

	L.Proj.geoJson(geojson, {
		pointToLayer: function(feature, latlng) {
			return L.marker(latlng, {
				icon: myIcontext,
			});
		},
	}).addTo(hotspringslayer);
	L.Proj.geoJson(geojson, {
		pointToLayer: function(feature, latlng) {
			return L.marker(latlng, {
				icon: myIcon,
			});
		},
	}).on('click', function(e) { //点对象点击事件
		var pointproperties = e.layer.feature.properties; //当前点击的物体的名称
		if (showtype == 2) {
			curpointjson = pointproperties;
			layer.open({
				type: 2,
				title: "温泉点详情",
				area: ['90%', '90%'],
				shadeClose: true, //点击遮罩关闭
				content: 'html/pointmodify.html'
			});
		} else if (showtype == 1) {
			var popuphtml = [];
			Object.keys(pointproperties).forEach(function(key) {
				if (showproperties.hasOwnProperty(key)) {
					if (waterstanard.hasOwnProperty(key)) {
						if (pointproperties[key] > waterstanard[key]) {
							popuphtml.push("<span style=\"color:#FF0000\">" + showproperties[key] + ":" + pointproperties[key] +
								"</span>");
						} else {
							popuphtml.push("<span>" + showproperties[key] + ":" + pointproperties[key] + "</span>");
						}
					} else {
						popuphtml.push("<span>" + showproperties[key] + ":" + pointproperties[key] + "</span>");
					}
				}
			});
			var popup = L.popup()
				.setLatLng(e.latlng)
				.setContent(popuphtml.join("</br>"))
				.openOn(map);
		}
	}).addTo(hotspringslayer);
}

var $;
// layui对象实例化
layui.use(['layer', 'jquery', 'form'], function() {
	var layer = layui.layer
	$ = layui.jquery;
	var form = layui.form;
	
	//显示影藏图例
	$("#showlegend").click(function(){
		$("#legend").toggle();
	});
	//显示影藏筛选
	$("#showscreen").click(function(){
		$("#screen").toggle();
	});
	//数据列表查看
	$("#operate ul li").click(function(){
		var name=$(this).attr("name");
		switch (name){
			case "hotlistall":{
				var searchpoint = layer.open({
					type: 2,
					title: "基础数据列表",
					area: ['100%', '100%'],
					shadeClose: true, //点击遮罩关闭
					content: 'showhtml/pointlist.html',
					success: function(layero, index) {
					},
				});
				layer.full(searchpoint);
				break;
			}
			case "hotlistanatomy":{
				var searchpoint = layer.open({
					type: 2,
					title: "基础数据列表",
					area: ['100%', '100%'],
					shadeClose: true, //点击遮罩关闭
					content: 'showhtml/pointlistanatomy.html',
					success: function(layero, index) {
					},
				});
				layer.full(searchpoint);
				break;
			}
			case "hotlisteffect":{
				var searchpoint = layer.open({
					type: 2,
					title: "基础数据列表",
					area: ['100%', '100%'],
					shadeClose: true, //点击遮罩关闭
					content: 'showhtml/pointlisteffect.html',
					success: function(layero, index) {
					},
				});
				layer.full(searchpoint);
				break;
			}
			default:
				break;
		}
	})
	
	//地图操作
	$("#mapoperate ul li").click(function(){
		var loadindex = layer.load(2, {
			shade: [0.5, '#000000'] //0.1透明度的白色背景
		});
		var name=$(this).attr("name");
		switch (name){
			case "reset":{
				if (map.getZoom() == mapzoom) {
					map.setView(mapcenter);
				
				} else {
					map.setZoom(mapzoom);
					setTimeout(function() {
						map.setView(mapcenter);
					}, 1000);
				}
				layer.close(loadindex);
				break;
			}
			case "add":{
				map.zoomIn();
				layer.close(loadindex);
				break;
			}
			case "sub":{
				map.zoomOut();
				layer.close(loadindex);
				break;
			}
			case "export":{
				//若当前地图显示级别为默认级别直接进行地图导出
				if (map.getZoom() == mapzoom) {
					printer.printMap('CurrentSize', '导出地图');
					layer.msg('地图开始导出中', {
						time: 3000 //2秒关闭（如果不配置，默认是3秒）
					}, function() {
						setTimeout(function() {
							layer.close(loadindex);
						}, 3000);
					});
				} else {
					map.setZoom(mapzoom);
					setTimeout(function() {
						map.setView(mapcenter);
						printer.printMap('CurrentSize', '导出地图');
						layer.msg('地图开始导出中', {
							time: 3000 //2秒关闭（如果不配置，默认是3秒）
						}, function() {
							setTimeout(function() {
								layer.close(loadindex);
							}, 3000);
						});
					}, 2000);
				}
				break;
			}
			case "manage":{
				layer.close(loadindex);
				window.location = "login.html";
				break;
			}
		}
	})
	
	// 地图缩放事件监听
	map.on("zoomend", e => {
		//获取当前放大或者缩小的等级
		var zoom = e.target.getZoom();
		var curclassname = "map-name" + zoom;
		var delclassname = "map-name" + (zoom - 1);
		var addclassname = "map-name" + (zoom + 1);
		var mapname = $("." + delclassname);
		if (mapname.length > 0) { //放大
			$(mapname).removeClass(delclassname);
			$(mapname).addClass(curclassname);
		} else { //缩小
			mapname = $("." + addclassname);
			mapname.addClass(curclassname);
			mapname.removeClass(addclassname);
		}

		var curclassscale = "map-scale" + zoom;
		var delclassscale = "map-scale" + (zoom - 1);
		var addclassscale = "map-scale" + (zoom + 1);
		var mapscale = $("." + delclassscale);
		if (mapscale.length > 0) { //放大
			mapscale.addClass(curclassscale);
			mapscale.removeClass(delclassscale);
		} else { //缩小
			mapscale = $("." + addclassscale);
			mapscale.addClass(curclassscale);
			mapscale.removeClass(addclassscale);
		}
	});
	//获取所有的温泉点并添加到地图上
	getpointlist = function() {
		hotspringslayer.clearLayers();
		//获取已存在的温泉点
		$.ajax({
			type: "GET",
			url: apiUrl + "/springPoint",
			dataType: "json",
			success: function(data) {
				allpointdata = data;
				$.each(data, function(i, item) {
					readdpoint(item.x, item.y, item);
				})
			},
			errorfunction(data) {
			}
		});
	};
	getpointlist();

	//加载图框
	$.getJSON("jsondata/pictureframe.json", "", function(data) {
		//each循环 使用$.each方法遍历返回的数据date
		$.each(data.features, function(i, item) {
			item["crs"] = {
				type: "name",
				properties: {
					name: "EPSG:2385"
				}
			};
			// 样式设置
			var curprovice = L.Proj.geoJson(item, {
				style: {
					"color": '#BEBEBE',
					"weight": 0.5,
					"opacity": 0.5
				}
			}).addTo(picturelayer);
		});
	});

	//加载县界
	$.getJSON("jsondata/county.json", "", function(data) {
		//each循环 使用$.each方法遍历返回的数据date
		var provices = []
		$.each(data.features, function(i, item) {
			item["crs"] = {
				type: "name",
				properties: {
					name: "EPSG:2385"
				}
			};
			// 样式设置
			var curprovice = L.Proj.geoJson(item, {
				style: {
					"color": "#BEBEBE",
					"weight": 1,
					"opacity": 0.5
				}
			}).addTo(provincelayer);
		});
	});

	//加载县名称
	$.getJSON("jsondata/countyname.json", "", function(data) {
		//each循环 使用$.each方法遍历返回的数据date
		var provices = []
		$.each(data.features, function(i, item) {
			item["crs"] = {
				type: "name",
				properties: {
					name: "EPSG:2385"
				}
			};
			//名称显示样式设置
			var myIcontext = L.divIcon({
				html: item.properties.name,
				className: 'my-div-county-name',
			});
			L.Proj.geoJson(item, {
				pointToLayer: function(feature, latlng) {
					return L.marker(latlng, {
						icon: myIcontext,
					});
				},
			}).addTo(provincelayer);
		});
	});

	//加载市界
	$.getJSON("jsondata/city.json", "", function(data) {
		//each循环 使用$.each方法遍历返回的数据date
		var provices = []
		$.each(data.features, function(i, item) {
			item["crs"] = {
				type: "name",
				properties: {
					name: "EPSG:2385"
				}
			};
			//样式设置
			var curprovice = L.Proj.geoJson(item, {
				style: {
					"color": "#BEBEBE",
					"weight": 1.5,
					"opacity": 1,
					"dashArray": '5',
					"lineCap": 'butt', //虚线设置
					"lineJoin": 'miter',
				}
			}).addTo(provincelayer);
		});
	});
	
	//加载市名称
	$.getJSON("jsondata/cityname.json", "", function(data) {
		//each循环 使用$.each方法遍历返回的数据date
		var provices = []
		$.each(data.features, function(i, item) {
			item["crs"] = {
				type: "name",
				properties: {
					name: "EPSG:2385"
				}
			};
			//名称显示样式设置
			var myIcontext = L.divIcon({
				html: item.properties.name,
				className: 'my-div-city-name',
			});
			L.Proj.geoJson(item, {
				pointToLayer: function(feature, latlng) {
					return L.marker(latlng, {
						icon: myIcontext,
					});
				},
			}).addTo(citynamelayer);
		});
	});

	//加载省界
	$.getJSON("jsondata/province.json", "", function(data) {
		//each循环 使用$.each方法遍历返回的数据date
		var provices = []
		$.each(data.features, function(i, item) {
			item["crs"] = {
				type: "name",
				properties: {
					name: "EPSG:2385"
				}
			};
			//样式设置
			var curprovice = L.Proj.geoJson(item, {
				style: {
					"color": "#BEBEBE", //边界颜色
					"weight": 2,
					"opacity": 0.75,
					"dashArray": '5',
					"lineCap": 'butt', //虚线设置
					"lineJoin": 'miter',
				}
			}).addTo(provincelayer);
		});
	});

	//加载交通
	$.getJSON("jsondata/traffic.json", "", function(data) {
		//each循环 使用$.each方法遍历返回的数据date
		$.each(data.features, function(i, item) {
			item["crs"] = {
				type: "name",
				properties: {
					name: "EPSG:2385"
				}
			};
			//样式设置
			var curprovice = L.Proj.geoJson(item, {
				style: {
					"color": '#FFD898',
					"weight": 1,
					"opacity": 1
				}
			}).addTo(trafficlayer);
		});
	});
	
	//加载高速
	$.getJSON("jsondata/highspeed.json", "", function(data) {
		//each循环 使用$.each方法遍历返回的数据date
		$.each(data.features, function(i, item) {
			item["crs"] = {
				type: "name",
				properties: {
					name: "EPSG:2385"
				}
			};
			//样式设置
			var curprovice = L.Proj.geoJson(item, {
				style: {
					"color": '#FFD832',
					"weight": 1,
					"opacity": 1
				}
			}).addTo(trafficlayer);
		});
	});
	//选中的水质指标
	var checkwaterquality = new Array();
	//符合筛选条件的温泉点
	var checklayerlist = [];
	//水质切换监听
	//水质指标筛选函数
	form.on('checkbox(waterquality)', function(data) {
		var layername = $(data.elem).attr('name');
		var layercheck = data.elem.checked;
		if (layercheck) { //添加筛选指标条件
			checkwaterquality.push(layername);
		} else { //减少筛选指标条件
			var index=$.inArray(layername, checkwaterquality);
			checkwaterquality.splice(index,1);
		}
		form.render('checkbox');
		//水质指标符合筛选
		checklayerlist = [];
		hotspringslayer.eachLayer(function(layer) {
			if(checkwaterquality.length==0){
				checklayerlist.push(layer);
			}else{
				var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
				var isConditions = true;
				$.each(checkwaterquality,function(index, item) {
					if (properties[item] <= waterstanard[item]) { //存在不符合的添加
						isConditions = false;
						return;
					}
				})
				if (isConditions) {
					checklayerlist.push(layer);
				}
			}
		});
		//将筛选之后的点添加到地图上
		if(checklayerlist.length==0){
			hotspringslayer.eachLayer(function(layer) {
				map.removeLayer(layer);
			})
		}else{
			hotspringslayer.eachLayer(function(layer) {
				var index=$.inArray(layer, checklayerlist);
				if(index>-1){
					map.addLayer(layer);
				}else{
					map.removeLayer(layer);
				}
			})
		}
	});

});

//导出所有数据函数
var exportdata = function() {
	tableToExcel(pointtabletitles, allpointdata);
}
