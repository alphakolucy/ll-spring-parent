proj4.defs("EPSG:2385",
    "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
// proj4.defs("EPSG:2385",
// 	"+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=1500000 +y_0=-3000000 +a=6378140 +b=6356755.288157528 +units=m +no_defs"
// );
var mapcenter = [0.05352918955315693, 115.52501678466798];
var mapzoom = 17;

var map = L.map('map', {
    center: mapcenter,
    zoom: mapzoom,
    minZoom: 15,
    maxZoom: 21,
    // crs: L.CRS.EPSG4326,
    zoomControl: false,
    attributionControl: false,
});

var curpointjson = {};
var allpointdata = {};
var getpointlist;
var showtype = 2; //1 直接点地图点上面显示 2 弹出详情框


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


// L.tileLayer(
// 	'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
// 		maxZoom: 18,
// 		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
// 			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
// 			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
// 		id: 'mapbox.streets'
// 	}).addTo(map);
picturelayer.addTo(map);
provincelayer.addTo(map);
citynamelayer.addTo(map);

// riverslayer.addTo(map);
// structure1layer.addTo(map);
// residentiallayer.addTo(map);
// faultlayer.addTo(map);


trafficlayer.addTo(map);
highspeedlayer.addTo(map);

hotspringslayer.addTo(map);
var printer = L.easyPrint({
    tileLayer: null,
    sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
    filename: 'myMap',
    exportOnly: true,
    tileWait: 200,
    hideControlContainer: true,
    hidden: true
}).addTo(map);

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
        html: "贵州理疗温泉（地热水）调查评价工作布置图",
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
        html: "1:500000",
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

function readdpoint(lat, lng, properties) {
    var relat = lat / pointrotiox;
    var relng = lng / pointrotioy;
    var geojsonMarkerOptions = {
        radius: 1,
        fillColor: "#ff7800",
        color: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };
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
    var pointiconUrl = 'img/default.png';
    if (properties.pointCategory == 30001) {
        pointiconUrl = 'img/hotspring.png'; //天然温泉井
    } else if (properties.pointCategory == 30002) {
        pointiconUrl = 'img/lanhotwell.png'; //地热井
    } else if (properties.pointCategory == 30003) {
        pointiconUrl = 'img/build-drill.png'; //施工中热矿水转孔
    } else if (properties.pointCategory == -30001) {
        pointiconUrl = 'img/hotspring-gray.png'; //不达标温泉
    } else if (properties.pointCategory == -30002) {
        pointiconUrl = 'img/lanhotwell-gray.png'; //不达标地热
    } else if (properties.pointCategory == -30003) {
        pointiconUrl = 'img/default.png'; //不达标地热
    } else if (properties.pointCategory == -30004) {
        pointiconUrl = 'img/hotspring-yellow.png'; //无资料
    } else if (properties.pointCategory == -30005) {
        pointiconUrl = 'img/hotspring-black.png'; //废弃
    }
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
    }).on('click', function(e) {
        var pointproperties = e.layer.feature.properties; //当前点击的物体的名称
        console.log('已经进on')
        if (showtype == 2) {
            console.log(e)
            curpointjson = pointproperties;
            layer.open({
                type: 2,
                title: "温泉点详情",
                area: ['1000px', '800px'],
                shadeClose: true, //点击遮罩关闭
                content: 'html/pointmodify.html'
            });
        } else if (showtype == 1) {
            var popuphtml = [];
            console.log('1')
            console.log(e)
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
layui.use(['layer', 'jquery', 'form'], function() {
    var layer = layui.layer
    $ = layui.jquery;
    var form = layui.form;


    map.on("zoomend", e => {
        //获取当前放大或者缩小的等级
        var zoom = e.target.getZoom();
    var curclassname = "map-name" + zoom;
    var delclassname = "map-name" + (zoom - 1);
    var addclassname = "map-name" + (zoom + 1);
    var mapname = $("."+delclassname);
    console.log(mapname.length);
    if (mapname.length>0) { //缩小
        console.log("放大");
        $(mapname).removeClass(delclassname);
        $(mapname).addClass(curclassname);
    } else { //缩小
        mapname = $("."+addclassname);
        console.log(mapname.length);
        mapname.addClass(curclassname);
        mapname.removeClass(addclassname);
    }

    var curclassscale = "map-scale" + zoom;
    var delclassscale = "map-scale" + (zoom - 1);
    var addclassscale = "map-scale" + (zoom + 1);
    var mapscale = $("."+delclassscale);
    console.log(mapscale.length);
    if (mapscale.length>0) { //缩小
        console.log("放大");
        mapscale.addClass(curclassscale);
        mapscale.removeClass(delclassscale);
    } else { //缩小
        mapscale = $("."+addclassscale);
        console.log(mapscale.length);
        mapscale.addClass(curclassscale);
        mapscale.removeClass(addclassscale);
    }
});

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
                console.log(data);
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
            var curprovice = L.Proj.geoJson(item, {
                style: {
                    "color": '#BEBEBE',
                    "weight": 0.5,
                    "opacity": 0.5
                }
            }).addTo(picturelayer);
        });
    });
    //加载图名
    $.getJSON("jsondata/picturename.json", "", function(data) {
        //each循环 使用$.each方法遍历返回的数据date
        $.each(data.features, function(i, item) {
            item["crs"] = {
                type: "name",
                properties: {
                    name: "EPSG:2385"
                }
            };
            var curprovice = L.Proj.geoJson(item, {
                style: {
                    "color": '#000000',
                    "weight": 0.5,
                    "opacity": 1
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
            var curprovice = L.Proj.geoJson(item, {
                style: {
                    "color": "#BEBEBE",
                    "weight": 1.5,
                    "opacity": 1,
                    "dashArray": '5',
                    "lineCap": 'butt',
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

            var curprovice = L.Proj.geoJson(item, {
                style: {
                    "color": "#BEBEBE", //边界颜色
                    "weight": 2,
                    "opacity": 0.75,
                    "dashArray": '5',
                    "lineCap": 'butt',
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
    //加载zyxx
    $.getJSON("jsondata/zyxx.json", "", function(data) {
        //each循环 使用$.each方法遍历返回的数据date
        $.each(data.features, function(i, item) {
            item["crs"] = {
                type: "name",
                properties: {
                    name: "EPSG:2385"
                }
            };
            var curprovice = L.Proj.geoJson(item, {
                style: {
                    "color": '#99FF7F',
                    "weight": 1,
                    "opacity": 1
                }
            }).addTo(structure1layer);
        });
    });
    //加载pzxx
    $.getJSON("jsondata/pzxx.json", "", function(data) {
        //each循环 使用$.each方法遍历返回的数据date
        $.each(data.features, function(i, item) {
            item["crs"] = {
                type: "name",
                properties: {
                    name: "EPSG:2385"
                }
            };
            var curprovice = L.Proj.geoJson(item, {
                style: {
                    "color": '#99FF7F',
                    "weight": 0.5,
                    "opacity": 1
                }
            }).addTo(structure1layer);
        });
    });

    //加载ptxx
    $.getJSON("jsondata/ptxx.json", "", function(data) {
        //each循环 使用$.each方法遍历返回的数据date
        $.each(data.features, function(i, item) {
            item["crs"] = {
                type: "name",
                properties: {
                    name: "EPSG:2385"
                }
            };
            var curprovice = L.Proj.geoJson(item, {
                style: {
                    "color": '#99FF7F',
                    "weight": 0.5,
                    "opacity": 1
                }
            }).addTo(structure1layer);
        });
    });
    //加载zybx
    $.getJSON("jsondata/zybx.json", "", function(data) {
        //each循环 使用$.each方法遍历返回的数据date
        $.each(data.features, function(i, item) {
            item["crs"] = {
                type: "name",
                properties: {
                    name: "EPSG:2385"
                }
            };
            var curprovice = L.Proj.geoJson(item, {
                style: {
                    "color": '#53B554',
                    "weight": 1,
                    "opacity": 1
                }
            }).addTo(structure1layer);
        });
    });
    //加载pzbx
    // $.getJSON("jsondata/pzbx.json", "", function (data) {
    //     //each循环 使用$.each方法遍历返回的数据date
    //     $.each(data.features, function (i, item) {
    //         item["crs"] = {
    //             type: "name",
    //             properties: {
    //                 name: "EPSG:2385"
    //             }
    //         };
    //         var curprovice = L.Proj.geoJson(item, {
    //             style: {
    //                 "color": '#53B554',
    //                 "weight": 0.5,
    //                 "opacity": 1
    //             }
    //         }).addTo(structure1layer);
    //     });
    // });
    //加载ptbx
    $.getJSON("jsondata/ptbx.json", "", function(data) {
        //each循环 使用$.each方法遍历返回的数据date
        $.each(data.features, function(i, item) {
            item["crs"] = {
                type: "name",
                properties: {
                    name: "EPSG:2385"
                }
            };
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
            var myIcontext = L.divIcon({
                html: item.properties.pname,
                className: 'my-div-icon-name',
                // iconSize: 30,
            });
            var myIcon = L.divIcon({
                className: 'my-div-icon-namepoint',
                html: '·'
            });
            // L.Proj.geoJson(item, {
            // 	pointToLayer: function(feature, latlng) {
            // 		// return L.circleMarker(latlng, geojsonMarkerOptions);
            // 		return L.marker(latlng, {
            // 			icon: myIcontext,
            // 		});
            // 	},
            // }).addTo(residentials);
            L.Proj.geoJson(item, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {
                        icon: myIcon,
                    });
                },
            }).addTo(residentiallayer);
        });
    });


    //图层切换监听
    var changesfeature = ['structure', 'fault', 'rivers', 'traffic', 'structure1'];
    form.on('checkbox(layers)', function(data) {
        var layername = $(data.elem).attr('name');
        var layercheck = data.elem.checked;
        var reallayername = layername + 'layer';
        if (layercheck) {
            switch (layername) {
                case 'layersall':
                {
                    $.each(changesfeature, function(index, item) {
                        $("#" + item).prop("checked", true);
                        eval(item + 'layer').addTo(map);
                    });
                    break;
                }
                default:
                {
                    $("#layersall").prop("checked", true);
                    eval(reallayername).addTo(map);
                    var lengends = $(".legendleft li[name=" + layername + "]");
                    $.each(lengends, function(index, item) {
                        console.log(item);
                        $(item).removeClass("hothide");
                    });
                    break;
                }
            }
        } else {
            switch (layername) {
                case 'layersall':
                {
                    $.each(changesfeature, function(index, item) {
                        $("#" + item).prop("checked", false);
                        map.removeLayer(eval(item + 'layer'));
                    });
                    break;
                }
                default:
                {
                    var isfull = true;
                    $.each(changesfeature, function(index, item) {
                        if ($("#" + item)[0].checked) {
                            isfull = false;
                            return false;
                        }
                    });
                    if (isfull) {
                        $("#layersall").prop("checked", false);
                    }
                    map.removeLayer(eval(reallayername));
                    var lengends = $(".legendleft li[name=" + layername + "]");
                    $.each(lengends, function(index, item) {
                        $(item).addClass("hothide");
                    });
                    break;
                }
            }
        }
        form.render('checkbox');
    });
    //热储单元切换监听
    var heatstores = ["heatstoreone", "heatstoretwo", "heatstorethree", "heatstorefour", "heatstorefive", "heatstoresix",
        "heatstoreseven"
    ];
    form.on('checkbox(heatstore)', function(data) {
        var layername = $(data.elem).attr('name');
        var layertitle = $(data.elem).attr('title');
        var layercheck = data.elem.checked;
        if (layername == "heatstoreall") {
            if (layercheck) {
                Object.keys(heatstores).forEach(function(key) {
                    $("#" + key).prop("checked", true);
                });
                hotspringslayer.eachLayer(function(layer) {
                    map.addLayer(layer);
                });
            } else {
                Object.keys(waterstanard).forEach(function(key) {
                    $("#" + key).prop("checked", false);
                });
                hotspringslayer.eachLayer(function(layer) {
                    map.removeLayer(layer);
                });
            }

        } else {
            if (layercheck) {
                var layerkeys = false;
                Object.keys(waterstanard).forEach(function(key) {
                    if ($("#" + key)[0].checked) {
                        layerkeys = true;
                    }
                });
                if (layerkeys) {
                    $("#heatstoreall").prop("checked", true);
                }
                hotspringslayer.eachLayer(function(layer) {
                    var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                    if (properties["reservoirUnit"] == layertitle) {
                        map.addLayer(layer);
                    }
                });
            } else {
                var layerkeys = false;
                Object.keys(waterstanard).forEach(function(key) {
                    if (key != layername) {
                        if ($("#" + key)[0].checked) {
                            layerkeys = true;
                        }
                    }
                });
                if (!layerkeys) {
                    $("#heatstoreall").prop("checked", false);
                }
                hotspringslayer.eachLayer(function(layer) {
                    var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                    if (properties["reservoirUnit"] == layertitle) {
                        map.removeLayer(layer);
                    }
                });
            }
        }
        form.render('checkbox');
    });
    //其他筛选切换监听
    form.on('checkbox(hotother)', function(data) {
        var layername = $(data.elem).attr('name');
        var layertitle = $(data.elem).attr('title');
        var layercheck = data.elem.checked;
        switch (layername) {
            case "hototherone":
            {
                if (layercheck) {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["epidemiologicalSurvey"] == "是") {
                            map.addLayer(layer);
                        }
                    });
                } else {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["epidemiologicalSurvey"] == "否") {
                            map.addLayer(layer);
                        }
                    });
                }
                break;
            }
            case "hotothertwo":
            {
                if (layercheck) {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["efficacyInterventionExperiment"] == "是") {
                            map.addLayer(layer);
                        }
                    });
                } else {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["efficacyInterventionExperiment"] == "否") {
                            map.addLayer(layer);
                        }
                    });
                }
                break;
            }
            case "hototherthree":
            {
                if (layercheck) {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["geneticDissection"] == "是") {
                            map.addLayer(layer);
                        }
                    });
                } else {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["geneticDissection"] == "否") {
                            map.addLayer(layer);
                        }
                    });
                }
                break;
            }
            case "hototherfour":
            {
                if (layercheck) {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["codeNumber"].indexOf("S") == 0&&properties["codeNumber"].indexOf("s") == 0) {
                            map.addLayer(layer);
                        }
                    });
                } else {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["codeNumber"].indexOf("S") != 0&&properties["codeNumber"].indexOf("s") != 0) {
                            map.addLayer(layer);
                        }
                    });
                }
                break;
            }
            case "hototherfive":
            {
                if (layercheck) {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["codeNumber"].indexOf("DR") == 0&&properties["codeNumber"].indexOf("dr") == 0) {
                            map.addLayer(layer);
                        }
                    });
                } else {
                    hotspringslayer.eachLayer(function(layer) {
                        var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                        if (properties["codeNumber"].indexOf("DR") != 0&&properties["codeNumber"].indexOf("dr") == 0) {
                            map.addLayer(layer);
                        }
                    });
                }
                break;
            }
            default:
                break;
        }
        if (layername == "heatstoreall") {
            if (layercheck) {
                Object.keys(heatstores).forEach(function(key) {
                    $("#" + key).prop("checked", true);
                });
                hotspringslayer.eachLayer(function(layer) {
                    map.addLayer(layer);
                });
            } else {
                Object.keys(waterstanard).forEach(function(key) {
                    $("#" + key).prop("checked", false);
                });
                hotspringslayer.eachLayer(function(layer) {
                    map.removeLayer(layer);
                });
            }

        } else {
            if (layercheck) {
                var layerkeys = false;
                Object.keys(waterstanard).forEach(function(key) {
                    if ($("#" + key)[0].checked) {
                        layerkeys = true;
                    }
                });
                if (layerkeys) {
                    $("#heatstoreall").prop("checked", true);
                }
                hotspringslayer.eachLayer(function(layer) {
                    var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                    if (properties["reservoirUnit"] == layertitle) {
                        map.addLayer(layer);
                    }
                });
            } else {
                var layerkeys = false;
                Object.keys(waterstanard).forEach(function(key) {
                    if (key != layername) {
                        if ($("#" + key)[0].checked) {
                            layerkeys = true;
                        }
                    }
                });
                if (!layerkeys) {
                    $("#heatstoreall").prop("checked", false);
                }
                hotspringslayer.eachLayer(function(layer) {
                    var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                    if (properties["reservoirUnit"] == layertitle) {
                        map.removeLayer(layer);
                    }
                });
            }
        }
        form.render('checkbox');
    });
    //水质切换监听
    form.on('checkbox(waterquality)', function(data) {
        var layername = $(data.elem).attr('name');
        var layercheck = data.elem.checked;
        if (layername == "waterqualityall") {
            if (layercheck) {
                Object.keys(waterstanard).forEach(function(key) {
                    $("#" + key).prop("checked", true);
                });
                hotspringslayer.eachLayer(function(layer) {
                    map.addLayer(layer);
                });
            } else {
                Object.keys(waterstanard).forEach(function(key) {
                    $("#" + key).prop("checked", false);
                });
                hotspringslayer.eachLayer(function(layer) {
                    map.removeLayer(layer);
                });
            }

        } else {
            if (layercheck) {
                var layerkeys = false;
                Object.keys(waterstanard).forEach(function(key) {
                    if ($("#" + key)[0].checked) {
                        layerkeys = true;
                    }
                });
                if (layerkeys) {
                    $("#waterqualityall").prop("checked", true);
                }
                hotspringslayer.eachLayer(function(layer) {
                    var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                    if (properties[layername] > waterstanard[layername]) {
                        map.addLayer(layer);
                    }
                });
            } else {
                var layerkeys = false;
                Object.keys(waterstanard).forEach(function(key) {
                    if (key != layername) {
                        if ($("#" + key)[0].checked) {
                            layerkeys = true;
                        }
                    }
                });
                if (!layerkeys) {
                    $("#waterqualityall").prop("checked", false);
                }
                hotspringslayer.eachLayer(function(layer) {
                    var properties = layer._layers[layer._leaflet_id - 1].feature.properties;
                    if (properties[layername] > waterstanard[layername]) {
                        map.removeLayer(layer);
                    }
                });
            }
        }
        form.render('checkbox');
    });

    $("#clickmenu").on('click', function() {
        $("#menuitem").toggle();
    });

    $('#springPoint').on('click', function() {
        layer.open({
            type: 2,
            title: "添加温泉点",
            area: ['1000px', '800px'],
            shadeClose: true, //点击遮罩关闭
            content: 'html/pointadd.html'
        });
    });
    // $('#springPoint').click();
    $('#searchpoint').on('click', function() {
        var searchpoint = layer.open({
            type: 2,
            title: "基础数据列表",
            area: ['1000px', '600px'],
            shadeClose: true, //点击遮罩关闭
            content: 'html/pointlist.html',
            success: function(layero, index) {
                // console.log(layero);
            },
        });
        layer.full(searchpoint);
    });
    // $('#searchpoint').click();
});

function imgexport() {
    var loadindex = layer.load(2, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    if (map.getZoom() == mapzoom) {
        layer.msg('地图开始导出中', {
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
        }, function() {
            setTimeout(function() {
                layer.close(loadindex);
            }, 2000);
        });
        printer.printMap('CurrentSize', '导出地图');
        // var modeToUse = L.control.browserPrint.mode.auto();
        // map.printControl.print(modeToUse);
    } else {
        map.setView(mapcenter);
        map.setZoom(mapzoom);
        var interval = setInterval(function() {
            layer.msg('地图开始导出中', {
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function() {
                setTimeout(function() {
                    layer.close(loadindex);
                }, 2000);
            });
            printer.printMap('CurrentSize', '导出地图');
            // var modeToUse = L.control.browserPrint.mode.auto();
            // map.printControl.print(modeToUse);

            clearInterval(interval);
        }, 200);
    }
}

function func_map(type) {
    switch (type) {
        case 0:
        {
            map.setView(mapcenter);
            map.setZoom(mapzoom);
            break;
        }
        case 1:
        {
            map.zoomIn();
            break;
        }
        case 2:
        {
            map.zoomOut();
            break;
        }
        case 3:
        {
            if (map.getZoom() == mapzoom) {
                layer.msg('地图开始导出中');
                printer.printMap('CurrentSize', '导出地图');
                // var modeToUse = L.control.browserPrint.mode.auto();
                // map.printControl.print(modeToUse);
            } else {
                map.setView(mapcenter);
                map.setZoom(mapzoom);
                var interval = setInterval(function() {
                    layer.msg('地图开始导出中');
                    printer.printMap('CurrentSize', '导出地图');
                    // var modeToUse = L.control.browserPrint.mode.auto();
                    // map.printControl.print(modeToUse);

                    clearInterval(interval);
                }, 200);
            }
            break;
        }
    }
}

var exportdata = function() {
    tableToExcel(pointtabletitles, allpointdata);
}

// const resolutions = [ // 所有的分辨率复制到这里
// 	86.03597249425798, 43.01798624712899,
// 	21.508993123564494, 10.754496561782247,
// 	5.3772482808911235, 2.6886241404455617,
// 	1.3443120702227809, 0.6721560351113904,
// 	0.3360780175556952, 0.1680390087778476,
// 	0.0840195043889238, 0.0420097521944619,
// 	0.02100487609723095, 0.010502438048615476,
// 	0.005251219024307738, 0.002625609512153869
// ];

// const CRS_4610 = new L.Proj.CRS('EPSG:2385',
// 	'+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs', {
// 		resolutions: resolutions
// 	}
// );
// .setView([26.655132, 106.637155], 7);

// var shpfile = new L.Shapefile('hotspring.zip', {
// 	onEachFeature: function(feature, layer) {
// 		if (feature.properties) {
// 			console.log(feature);
// 			layer.bindPopup(Object.keys(feature.properties).map(function(k) {
// 				return k + ": " + feature.properties[k];
// 			}).join("<br />"), {
// 				maxHeight: 200
// 			});
// 		}
// 	}
// });
// shpfile.addTo(map);
// shpfile.once("data:loaded", function() {
// 	console.log("finished loaded shapefile");
// });

// bindPopup(function(layer) {
// 	// console.log(this._latlng);
// 	if (layer.feature.properties) {
// 		var keys = [];
// 		Object.keys(layer.feature.properties).forEach(function(key) {
// 			keys.push(layer.feature.properties[key]);
// 		});
// 		var popup = L.popup()
// 			.setLatLng(this._latlng)
// 			.setContent(keys.join(','))
// 			.openOn(map);
// 		return false;
// 	}
// }).addTo(map);
