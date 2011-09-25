var DomoAuto = new Ext.chart.Chart({
	title: 'Automates',
	cls: 'card4',
	iconCls: 'time',
	animate: true,
	theme: 'Energy',
	axes: [{
	        type: 'Numeric',
        position: 'bottom',
        fields: ['dehors', 'parents'],
        title: 'Sample Values',
        grid: true,
    }, {
        type: 'Category',
        position: 'left',
        fields: ['name'],
        title: 'Sample Metrics'
    }],
});
