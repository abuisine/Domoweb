        Ext.regModel('Registers', {
        	fields: ['id', 'value']
        });

	var updateDomoList = function(){
		Ext.getCmp('DomoWeb').getTabBar().items.first().setBadge('!');
		DomoStatus.load({
			scope: this,
			callback: domoStatusLoaded
		})
	}; 

	var domoStatusLoaded = function(operation) {
		ids = DomoStatus.collect('id');
		records = new Array();
		for (var i = 0, ln = ids.length; i < ln; i++) {
			id = ids[i];
			record = DomoList.getStore().findRecord('id', id);
			if (record) {
				records.push(record);
			}
		} 
		DomoList.getSelectionModel().select(records);
		Ext.getCmp('DomoWeb').getTabBar().items.first().setBadge('');
	};

	var DomoListUpdater = new Ext.util.TaskRunner();
	var DomoListUpdaterTask = {
		run: updateDomoList,
		interval: 30000 
	};

	var DomoStatus = new Ext.data.Store({
        	model: 'Registers',
		filters: [{
			property: 'value',
			value: 1
		}],
                getGroupString : function(record) {
                	return record.get('Category');
                },
                proxy: {
                	type: 'ajax',
                	url : 'modbus/readregister.php?ip=192.168.0.200&base=0x8880&function=0x03&offset=0&length=16',
                	reader: {
                        	type: 'json',
                        }
                }
	});


        Ext.regModel('HouseElement', {
        	fields: ['id', 'Name', 'Category']
        });

	var LightRooms = new Ext.data.Store({
        	model: 'HouseElement',
                getGroupString : function(record) {
                	return record.get('Category');
                },
                proxy: {
                	type: 'ajax',
                        url : 'json/LightRooms.json',
                        reader: {
				type: 'json'
			}
                },
                autoLoad: true
        });

        var DomoList = new Ext.List({
			id: 'domolist',
                	title: 'Le Verger',
                	iconCls: 'more',
			fullscreen: true,
			selModel: {
				mode: 'SIMPLE'
			},
			itemTpl: '{Name}',
			clearSelectionOnDeactivate: false,
			grouped: true,
			listeners: {
				activate: function(container) {
					DomoListUpdater.start(DomoListUpdaterTask);
				},
				deactivate: function(container) {
					DomoListUpdater.stop(DomoListUpdaterTask);
				},
				orientationchange: updateDomoList,
				itemtap: function(container, index, item, e) {
					original = DomoList.getNode(item).innerHTML;
					container.getNode(item).innerHTML = original + '<div class="houseelementloading"><img src="img/loading-balls.gif"/></div>';
					itemid = container.getStore().getAt(index).getId()
					if (container.getSelectionModel().isSelected(index)) {
						Ext.Ajax.request({
							url: 'modbus/writesimpleregister.php',
							method: 'POST',
							params: {
								id: itemid,
								value: 0
							},
							success: function(response, opts) {
								DomoList.getSelectionModel().deselect(index);
								DomoList.getNode(item).innerHTML = original;
							}
						});
					} else {
						Ext.Ajax.request({
							url: 'modbus/writesimpleregister.php',
							method: 'POST',
							params: {
								id: itemid,
								value: 1
							},
							success: function(response, opts) {
								DomoList.getSelectionModel().select(index, true);
								DomoList.getNode(item).innerHTML = original;
							}
						});
					}
				},
			},
			store: LightRooms
		});
