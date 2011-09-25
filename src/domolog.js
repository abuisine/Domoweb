Ext.regModel('Logs', {
	fields: [ 'id', 'category_id', 'utc', 'category', 'desc' ]
});

var DomoLogStore = new Ext.data.Store({
	model: 'Logs',
	proxy: {
		type: 'ajax',
		url: 'logs/logs.pjson',
		reader : {
			type: 'json',
		}
	},
	autoLoad: false
});


var DomoLog = new Ext.TabPanel({
	title: 'Evènements',
	tabBar: {
		layout: {
			pack: 'center'
		}
	},
	iconCls: 'search',
	items: [{
		title: 'Lumière',
		items: [{
			xtype: 'list',
			store: DomoLogStore,
			itemTpl: '{category_id} {desc}',
			listeners: {
				activate: function(list) {
					DomoLogStore.load({
						scope: this,
						callback: function () {
							this.refresh()
						}
					})
				}
			}
		}]
	},{
		title: 'Accès',
	},{
		title: 'Chauffage',
	}]
});
