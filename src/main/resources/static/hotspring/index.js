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
var structurelayer = new L.layerGroup();
var structure1layer = new L.layerGroup(); //褶皱图层
var residentiallayer = new L.layerGroup();
var hotspringslayer = new L.layerGroup();
var riverslayer = new L.layerGroup();
var faultlayer = new L.layerGroup();
var trafficlayer = new L.layerGroup();
var picturelayer = new L.layerGroup();
var highspeedlayer = new L.layerGroup();
var citynamelayer = new L.layerGroup();

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


// 添加地图图名及地图比例尺
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
	var relng = (lng-18000000) / pointrotioy;
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
	} else if (properties.llStatus == 30010) {
		pointiconUrl = 'img/anatomy.png'; //理疗功效研究点
	} else if (properties.llStatus == 30011) {
		pointiconUrl = 'img/effect.png'; //成因解剖研究点
	}else if (properties.llStatus == 30012) {
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
				content: 'html/pointdetail.html'
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
	$("#operate ul li").click(function() {
		var name = $(this).attr("name");
		switch (name) {
			case "hotlistall":
				{
					var searchpoint = layer.open({
						type: 2,
						title: "基础数据列表",
						area: ['100%', '100%'],
						shadeClose: true, //点击遮罩关闭
						content: 'html/pointlist.html',
						success: function(layero, index) {},
					});
					layer.full(searchpoint);
					break;
				}
			case "hotlistanatomy":
				{
					var searchpoint = layer.open({
						type: 2,
						title: "基础数据列表",
						area: ['100%', '100%'],
						shadeClose: true, //点击遮罩关闭
						content: 'html/pointlistanatomy.html',
						success: function(layero, index) {},
					});
					layer.full(searchpoint);
					break;
				}
			case "hotlisteffect":
				{
					var searchpoint = layer.open({
						type: 2,
						title: "基础数据列表",
						area: ['100%', '100%'],
						shadeClose: true, //点击遮罩关闭
						content: 'html/pointlisteffect.html',
						success: function(layero, index) {},
					});
					layer.full(searchpoint);
					break;
				}
			default:
				break;
		}
	})

	//地图操作
	$("#mapoperate ul li").click(function() {
		var loadindex = layer.load(2, {
			shade: [0.5, '#000000'] //0.1透明度的白色背景
		});
		var name = $(this).attr("name");
		switch (name) {
			case "reset":
				{
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
			case "add":
				{
					map.zoomIn();
					layer.close(loadindex);
					break;
				}
			case "sub":
				{
					map.zoomOut();
					layer.close(loadindex);
					break;
				}
			case "export":
				{
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
			case "manage":
				{
					layer.open({
						type: 2,
						title: "添加温泉点",
						area: ['80%', '88%'],
						shadeClose: true, //点击遮罩关闭
						content: 'html/pointadd.html'
					});
					layer.close(loadindex);
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
			error:function(data) {}
		});
	};
	getpointlist();


	//图层切换监听
	var changesfeature = ['structure', 'fault', 'rivers', 'traffic', 'structure1'];
	//地图图层显示隐藏切换函数
	form.on('checkbox(layers)', function(data) {
		var layername = $(data.elem).attr('name');
		var layercheck = data.elem.checked;
		var reallayername = layername + 'layer';
		if (layercheck) {
			$("#layersall").prop("checked", true);
			eval(reallayername).addTo(map);
			var lengends = $(".legendleft li[name=" + layername + "]");
			$.each(lengends, function(index, item) {
				$(item).removeClass("hothide");
			});
		} else {
			map.removeLayer(eval(reallayername));
			var lengends = $(".legendleft li[name=" + layername + "]");
			$.each(lengends, function(index, item) {
				$(item).addClass("hothide");
			});
		}
		form.render('checkbox');
	});

	//选中的水质指标
	var checkwaterquality = new Array();
	//热储单元
	var checkheatstore = new Array();
	//其他筛选条件
	var checkhotother = new Array();
	//符合筛选条件的温泉点
	var checklayerlist = [];

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
		//热储条件判断
		if(checkheatstore.length>0){
			for (var i = 0; i < checklayerlist.length; i++) {
				var properties = checklayerlist[i]._layers[checklayerlist[i]._leaflet_id - 1].feature.properties;
				var index=$.inArray(properties['reservoirUnit'], checkheatstore);//-1表示不再选择的条件中
				if(index==-1){
					checklayerlist.splice(i, 1);
					i--;
				}
			}
		}
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


	//热储单选筛选函数
	form.on('checkbox(heatstore)', function(data) {
		var layername = $(data.elem).attr('name');
		var layertitle = $(data.elem).attr('title');
		var layercheck = data.elem.checked;
		if (layercheck) { //显示所有的温泉点
			checkheatstore.push(layertitle);
		} else { //隐藏符合筛选条件的温泉点
			var index=$.inArray(layertitle, checkheatstore);
			checkheatstore.splice(index,1);
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
		//热储条件判断
		if(checkheatstore.length>0){
			for (var i = 0; i < checklayerlist.length; i++) {
				var properties = checklayerlist[i]._layers[checklayerlist[i]._leaflet_id - 1].feature.properties;
				var index=$.inArray(properties['reservoirUnit'], checkheatstore);//-1表示不再选择的条件中
				if(index==-1){
					checklayerlist.splice(i, 1);
					i--;
				}
			}
		}
		//将筛选之后的点添加到地图上
		if(checklayerlist.length==0){
			hotspringslayer.eachLayer(function(layer) {
				map.removeLayer(layer);
			})
		}else{
			console.log(checklayerlist);
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

	//温泉点其他筛选条件操作函数
	form.on('checkbox(hotother)', function(data) {
		var layername = $(data.elem).attr('name');
		var layertitle = $(data.elem).attr('title');
		var layercheck = data.elem.checked;
		switch (layername) {
			case "hototherone":
				{
					if (layercheck) { //显示温泉地区流行病学调查录入数据为是的温泉点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["epidemiologicalSurvey"] == "是") {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					} else { //显示温泉地区流行病学调查录入数据为否的温泉点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["epidemiologicalSurvey"] == "否" || properties["epidemiologicalSurvey"] == "") {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					}
					break;
				}
			case "hotothertwo":
				{
					if (layercheck) { //显示温泉理疗功效干预实验录入数据为是的温泉点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["efficacyInterventionExperiment"] == "是") {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					} else { //显示温泉理疗功效干预实验录入数据为否的温泉点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["efficacyInterventionExperiment"] == "否" || properties["efficacyInterventionExperiment"] == "") {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					}
					break;
				}
			case "hototherthree":
				{
					if (layercheck) { //显示理疗温泉成因解剖录入数据为是的温泉点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["geneticDissection"] == "是") {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					} else { //显示理疗温泉成因解剖录入数据为否的温泉点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["geneticDissection"] == "否" || properties["geneticDissection"] == "") {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					}
					break;
				}
			case "hototherfour":
				{
					if (layercheck) { //显示温泉类型为温泉的点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["codeNumber"].indexOf("S") == 0 || properties["codeNumber"].indexOf("s") == 0) {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					} else { //显示温泉类型不为温泉的点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["codeNumber"].indexOf("S") != 0 || properties["codeNumber"].indexOf("s") != 0) {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					}
					break;
				}
			case "hototherfive":
				{
					if (layercheck) { //显示温泉类型为地热井的点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["codeNumber"].indexOf("DR") == 0 || properties["codeNumber"].indexOf("dr") == 0) {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					} else { //显示温泉类型不为地热井的点
						hotspringslayer.eachLayer(function(layer) {
							var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
							if (properties["codeNumber"].indexOf("DR") != 0 || properties["codeNumber"].indexOf("dr") == 0) {
								map.addLayer(layer);
							}else{
								map.removeLayer(layer);
							}
						});
					}
					break;
				}
			default:
				break;
		}
		form.render('checkbox');
	});


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

	//加载河流
	$.getJSON("jsondata/rivers-line.json", "", function(data) {
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
					"color": '#B2FFFF',
					"weight": 1,
					"opacity": 1,
				}
			}).addTo(riverslayer);

		});
	});

	//加载活性断层
	$.getJSON("jsondata/fault.json", "", function(data) {
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
					"color": '#FF0000',
					"weight": 1.5,
					"opacity": 1
				}
			}).addTo(faultlayer);
		});
	});
	//加载一般断层
	$.getJSON("jsondata/generalfault.json", "", function(data) {
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
					"color": '#FF0000',
					"weight": 1,
					"opacity": 1
				}
			}).addTo(faultlayer);
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
	//加载构造
	$.getJSON("jsondata/structure.json", "", function(data) {
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
					"color": '#0000FF',
					"weight": 1,
					"opacity": 1,
					"dashArray": '5',
					"lineCap": 'butt',
					"lineJoin": 'miter',
				}
			}).addTo(structurelayer);
		});
	});
	//加载向斜数据
	$.getJSON("jsondata/zyxx.json", "", function(data) {
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
					"color": '#99FF7F',
					"weight": 1,
					"opacity": 1
				}
			}).addTo(structure1layer);
		});
	});
	//加载向斜数据
	$.getJSON("jsondata/pzxx.json", "", function(data) {
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
					"color": '#99FF7F',
					"weight": 0.5,
					"opacity": 1
				}
			}).addTo(structure1layer);
		});
	});

	//加载向斜数据
	$.getJSON("jsondata/ptxx.json", "", function(data) {
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
					"color": '#99FF7F',
					"weight": 0.5,
					"opacity": 1
				}
			}).addTo(structure1layer);
		});
	});
	//加载背斜数据
	$.getJSON("jsondata/zybx.json", "", function(data) {
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
					"color": '#53B554',
					"weight": 1,
					"opacity": 1
				}
			}).addTo(structure1layer);
		});
	});

	//加载背斜数据
	$.getJSON("jsondata/ptbx.json", "", function(data) {
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
					"color": '#53B554',
					"weight": 0.5,
					"opacity": 1
				}
			}).addTo(structure1layer);
		});
	});
	//加载乡镇点
	$.getJSON("jsondata/township.json", "", function(data) {
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
				html: item.properties.pname,
				className: 'my-div-icon-name',
				// iconSize: 30,
			});
			var myIcon = L.divIcon({
				className: 'my-div-icon-namepoint',
				html: '·'
			});
			L.Proj.geoJson(item, {
				pointToLayer: function(feature, latlng) {
					return L.marker(latlng, {
						icon: myIcon,
					});
				},
			}).addTo(residentiallayer);
		});
	});



});

//导出所有数据函数
var exportdata = function() {
	tableToExcel(pointtabletitles, allpointdata);
}
