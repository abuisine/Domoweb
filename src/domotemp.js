var dummyRooms = ['bebe', 'parents', 'sejour', 'veranda', 'dehors'];
var moreRooms = dummyRooms.concat(['request','heatermode']); 

var buildSeries = function (list) {
        series = [];
        for(var i = 0; i < list.length; i++) {
	        series = series.concat({
	                type: 'line',
	                highlight: false,
	                showMarkers: false,
	                fill: true,
	                smooth: true,
	                axis: 'left',
	                xField: 'name',
	                yField: list[i],
	                title: [list[i]]
                })
        }
//        series = series.concat({
//                type: 'line',
//                highlight: false,
//                showMarkers: false,
//                fill: true,
//                smooth: true,
//                axis: 'left',
//                xField: 'name',
//                yField: 'request',
//                title: ['request']
//         },{
//                type: 'line',
//                highlight: false,
//                showMarkers: false,
//                fill: false,
//                smooth: true,
//                axis: 'left',
//                xField: 'name',
//                yField: 'heatermode',
//                title: ['chauffage']
//         })
          return series;
}

Ext.regModel('RRD',{
        fields: ['name'].concat(moreRooms)
});


var urlStore = ['json/rrd.php?step=3600&backlog=d&fields=' + dummyRooms,
	'json/rrd.php?step=86400&backlog=w&fields=' + dummyRooms];
var storeCount = 0;

var tempStore = new Ext.data.Store({          
        model: 'RRD',                         
        proxy: {                              
                type: 'ajax',                 
                url : urlStore[storeCount],
                reader: {                                           
                        type: 'json',                               
                }                                                   
        },                                                          
        autoLoad: true,                                             
});

var updateStore = function() {
	storeCount = Math.abs(storeCount - 1);
	tempStore.setProxy({
		type: 'ajax',                 
		url : urlStore[storeCount],
		reader: {                                           
			type: 'json',                               
		}                                                   
	});
	tempStore.load();
}; 

var DailyTemp = new Ext.chart.Chart({                                
        animate: false,
        store: tempStore,                                           
        theme: 'Energy',
        series: buildSeries(dummyRooms),
	listeners: {
		itemtap: function(series, item, event) {
			updateStore();
		}
	},
	axes: [{
		type: 'Numeric',
		grid: true,
		position: 'right',
		fields: moreRooms,
		grid: {
			odd: {
		        	opacity: 1,
            			fill: '#edd',
            			stroke: '#cbb',
            			'stroke-width': 1
        		}
    		},
		label: {
			renderer: function(v) { return v+"°"; },
		},
	},{
		type: 'Category',
		grid: false,
		position: 'bottom',
		fields: ['name'],
	}],
	legend: {
		position: 'left',
		dock: true,
	},
});      

	var DomoTemp = new Ext.Carousel({
                id: 'temp',
                title: 'Températures',
                iconCls: 'download',
		direction: 'horizontal',
		draggable: false,
		scroll: false,
		indicator: false,
		defaults: {
			scroll: false,
			layout: {pack: 'center'},
		},
		items: [
		DailyTemp
		]
            });
