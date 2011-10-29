var dummyRooms = ['dehors','veranda','sejour','parents','bebe'];
var moreRooms = dummyRooms.concat(['request']); 

var buildSeries = function (list) {
        series = [];
         for(var i = 0; i < list.length; i++) {
		if (list[i] == "dehors")
			fill_value = true
		else
			fill_value = false
		if (list[i] == "request")
			style_val = {
				opacity: 0.3,
				stroke: 'grey'
			}
		else
			style_val = false
	        series = series.concat({
	                type: 'line',
	                highlight: false,
	                showMarkers: false,
	                fill: fill_value,
	                smooth: true,
	                axis: 'right',
			style: style_val,
	                xField: 'name',
	                yField: list[i],
	                title: [list[i]]
                })
        }
         return series;
}

Ext.regModel('RRD',{
        fields: ['name','timestamp'].concat(moreRooms)
});



var GaugeStore = new Ext.data.Store({          
        model: 'RRD',                         
	proxy: {
		type: 'ajax',                 
		url : 'json/rrd.php?step=300&backlog=h&fields=' + dummyRooms,
		reader: {                                           
			type: 'json',                               
		}                                                   
	},
	sorters: [{
		property: 'timestamp',
		direction: 'DESC'
	}],
	autoLoad: false,                                             
});

var urlStore = ['json/rrd.php?step=3600&backlog=d&fields=' + dummyRooms,
	'json/rrd.php?step=21600&backlog=w&fields=' + dummyRooms];

var urlBool = 1;

var TempStore = new Ext.data.Store({          
	listeners: {
		beforeload: function (store, operation) {
			urlBool = Math.abs(urlBool - 1);
			store.setProxy({
				type: 'ajax',                 
				url : urlStore[urlBool],
				reader: {                                           
					type: 'json',                               
				}                                                   
			});
		}
	},
        model: 'RRD',
	sorters: [{
		property: 'timestamp',
		direction: 'ASC'
	}],
	autoLoad: false,                                             
});


var gaugeSeries = function(list) {
        series = [];
        for(var i = 0; i < list.length; i++) {
		if (list[i] == "request") {
			needle_value = true;
			colorset_value = ['#ddd'];
			style_value = {
				opacity: 0,
			};
			donut_value = false;
		} else {
			needle_value = false;
			colorset_value = ['rgb('+ Math.round(Math.random()*180) +', '+ Math.round(Math.random()*180) +', '+ Math.round(Math.random()*180) +')', '#ddd'];
			style_value = false;
			donut_value = 100 - (list.length - 1 - i) * 100/(list.length);
		}
	        series = series.concat({
			type: 'gauge',
       			angleField: list[i],
			needle: needle_value,
			colorSet: colorset_value,
			style: style_value,
			donut: donut_value,
                })
        }
	return series;
};

var TempGauge = new Ext.chart.Chart({
	listeners: {
		activate: function(container) {
			GaugeStore.load();
		}
	},
	store: GaugeStore,
        animate: true,
	shadow: false,
        axes: [{
		type: 'gauge',
		position: 'gauge',
		minimum: 0,
		maximum: 25,
		steps: 25,
		margin: 7
               }],
        series: gaugeSeries(moreRooms),
	showInLegend: true,
});

var DailyTemp = new Ext.chart.Chart({                                
       	listeners: {
		activate: function(container) {
			TempStore.load();
		},
		itemtap: function(series, item, event) {
			TempStore.load();
		}
	},
	selectionTolerance: 10,
	animate: false,
        store: TempStore,                                           
        theme: 'Energy',
        series: buildSeries(moreRooms),
	axes: [{
		type: 'Numeric',
		grid: true,
		position: 'right',
		fields: dummyRooms,
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
		TempGauge,
		DailyTemp
	]
});
