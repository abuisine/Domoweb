//Workaround for 1.0.1 checkbox bug
Ext.form.Checkbox.prototype.onChange = function(e) {
	if (e) {
		if (e.browserEvent) {
        		e = e.browserEvent;
        	}
        	if (this.isChecked()) {
          		this.fireEvent('check',this);
        	} else {
          		this.fireEvent('uncheck', this);
        	}
      	}
};

//Settings menu, domoset.js
var heaterFields = [
	'heateractive',
	'leavestart',
	'leaveduration',
	'presencestart',
	'presenceduration',
	'presenceschedule',
	'tempout',
	'tempoutmargin',
	'templow',
	'templowmargin',
	'temphigh',
	'temphighmargin',
	'temphighday1schedule',
	'temphighday2schedule',
	'temphighday3schedule',
	'temphighday4schedule',
	'temphighday5schedule',
	'temphighday6schedule',
	'temphighday7schedule'
];

Ext.regModel('RequestedTemp', {
	fields: heaterFields
});

var RequestedTemp = new Ext.data.Store({
	model: 'RequestedTemp',
	proxy: {
		type: 'ajax',
		url: 'json/TempConfiguration.json',
		reader: {
			type: 'json',
			root: 'general'
		}
	},
	autoLoad: false 
});

Ext.regModel('RequestedTempRooms', {
	fields: ['id', 'status']
});

var RequestedTempRooms = new Ext.data.Store({
	model: 'RequestedTempRooms',
	filters: [{
		property: 'status',
		exactMatch: true,
		value: 'selected'
	}],
	proxy: {
		type: 'ajax',
		url: 'json/TempConfiguration.json',
		reader: {
			type: 'json',
			root: 'rooms'
		}
	},
	autoLoad: false 
});

Ext.regModel('TempRooms', {
	fields: ['id', 'Name', 'Category']
});

var TempRooms = new Ext.data.Store({
	model: 'TempRooms',
	filters: [{
		property: 'Category',
		exactMatch: true,
		value: 'In'
	}],
	proxy: {
		type: 'ajax',
		url: 'json/TempRooms.json',
		reader: {
			type: 'json'
		}
	},
	autoLoad: false 
});

var RequestedTempLoaded = function(records, operation, success) {
	general = RequestedTemp.first();
	for(var i = 0, ln = heaterFields.length; i < ln; i++) {
		if (heaterFields[i] == "heateractive") {
			gha = Ext.getCmp('general_heateractive');
			if (gha.getValue() != parseInt(general.get("heateractive")))
				gha.toggle();
		} else if (heaterFields[i] == "leavestart"
				|| heaterFields[i] == "presencestart")  {
			Ext.getCmp('general_' + heaterFields[i]).setValue(Date.parseDate(general.get(heaterFields[i]), "c"));
		} else {
			Ext.getCmp('general_' + heaterFields[i]).setValue(general.get(heaterFields[i]));
		}
	} 
};

var RequestedTempRoomsLoaded = function(records, operation, success) {
	RequestedTempRooms.each(function () {
		Ext.getCmp('rooms_' + this.get('id')).check();
	});
};

var buttonHeatHandler = function() {
	TempRooms.load({
		scope: this,
		callback: TempRoomsLoaded
	});
};

var TempRoomsLoaded = function() {
	heaterForm.removeAll();
	heaterForm.add({
		xtype: 'fieldset',
		title: 'Chauffage',
		items: [{
			xtype: 'togglefield',
			id: 'general_heateractive',
			label: 'Actif'
		}]
	});
	heaterForm.add({
		xtype: 'fieldset',
		title: 'Reglages',
		items: [{
			xtype: 'spinnerfield',
			id: 'general_templow',
			minValue: 5,
			incrementValue: 0.5,
			label: 'Température de nuit'
		},{
			xtype: 'sliderfield',
			id: 'general_templowmargin',
			minValue: 0,
			maxValue: 2,
			increment: 0.5,
			label: 'Marge autorisée'
		},{
			xtype: 'spinnerfield',
			id: 'general_temphigh',
			minValue: 5,
			incrementValue: 0.5,
			label: 'Température de jour'
		},{
			xtype: 'sliderfield',
			id: 'general_temphighmargin',
			minValue: 0,
			maxValue: 2,
			increment: 0.5,
			label: 'Marge autorisée'
		},{
			xtype: 'spinnerfield',
			id: 'general_tempout',
			minValue: 5,
			incrementValue: 0.5,
			label: 'Température à vide'
		},{
			xtype: 'sliderfield',
			id: 'general_tempoutmargin',
			minValue: 0,
			maxValue: 2,
			increment: 0.5,
			label: 'Marge autorisée'
		},{
			xtype: 'selectfield',
			id: 'general_temphighday1schedule',
			name: 'general_temphighday1schedule', //FIXME workaround
			label: 'Chauffage Lundi',
			options: daySchedule 
		},{
			xtype: 'selectfield',
			id: 'general_temphighday2schedule',
			name: 'general_temphighday2schedule', //FIXME workaround
			label: 'Chauffage Mardi',
			options: daySchedule 
		},{
			xtype: 'selectfield',
			id: 'general_temphighday3schedule',
			name: 'general_temphighday3schedule', //FIXME workaround
			label: 'Chauffage Mercredi',
			options: daySchedule 
		},{
			xtype: 'selectfield',
			id: 'general_temphighday4schedule',
			name: 'general_temphighday4schedule', //FIXME workaround
			label: 'Chauffage Jeudi',
			options: daySchedule 
		},{
			xtype: 'selectfield',
			id: 'general_temphighday5schedule',
			name: 'general_temphighday5schedule', //FIXME workaround
			label: 'Chauffage Vendredi',
			options: daySchedule 
		},{
			xtype: 'selectfield',
			id: 'general_temphighday6schedule',
			name: 'general_temphighday6schedule', //FIXME workaround
			label: 'Chauffage Samedi',
			options: daySchedule 
		},{
			xtype: 'selectfield',
			id: 'general_temphighday7schedule',
			name: 'general_temphighday7schedule', //FIXME workaround
			label: 'Chauffage Dimanche',
			options: daySchedule 
		}]
	});
	ret = new Array();
	records = TempRooms.getRange();
	for (var i = 0, ln = records.length; i < ln; i++) {
		ret.push({
			xtype: 'checkboxfield',
			id: 'rooms_' + records[i].get('id'),
			label: records[i].get('Name'),
			value: 'selected'
		});
	}
	heaterForm.add({
		xtype: 'fieldset',
		title: 'Reglages manuel',
		items: [ret]});
	heaterForm.add({
		xtype: 'fieldset',
		title: 'Absence',
		items: [{
			xtype: 'datepickerfield',
			id: 'general_leavestart',
			slotOrder: ['day', 'month', 'year'],
			yearFrom: 2000,
			yearTo: 2020,
			label: 'A partir de'
		},{
			xtype: 'spinnerfield',
			id: 'general_leaveduration',
			minValue: 1,
			label: 'pendant (jours)'
		}]
	});
	heaterForm.add({
		xtype: 'fieldset',
		title: 'Présence forcée',
		items: [{
			xtype: 'datepickerfield',
			id: 'general_presencestart',
			slotOrder: ['day', 'month', 'year'],
			yearFrom: 2000,
			yearTo: 2020,
			label: 'A partir de'
		},{
			xtype: 'spinnerfield',
			id: 'general_presenceduration',
			minValue: 1,
			label: 'pendant (jours)'
		},{
			xtype: 'selectfield',
			id: 'general_presenceschedule',
			name: 'general_presenceschedule', //FIXME workaround
			label: 'horaire à forcer',
			options: daySchedule 
		}]
	});
	heaterForm.show();
	DomoSet.doLayout();
};

var buttonsGroupTemp = [{
	xtype: 'segmentedbutton',
	items: [{
		id: 'buttonHeat',
		text: 'Chauffage',
		handler: buttonHeatHandler
	},{
		id: 'buttonHumidite',
		text: 'Humidité',
		handler: function() {
			heaterForm.hide();
		}
	},{
		id: 'buttonEau',
		text: 'Eau',
		handler: function() {
			heaterForm.hide();
		}
	}]
}];

var settoolbar = new Ext.Toolbar({ 
	dock: 'top',
	cardSwitchAnimation: {
		type: 'slide',
               	direction: 'down',
               	cover: true
           	},
	layout: {pack: 'center'},
	items: [{ xtype: 'spacer' },
		buttonsGroupTemp,
		{ xtype: 'spacer' },
		{
			id: 'buttonSave',
			ui: 'action',
			text: 'Confirmer',
			handler: function() {
				heaterForm.submit({
					//waitMsg: {message:'Submitting', cls: 'action-loading'}
				});
			}
		}]
       });

var daySchedule = [{
	text: '06:50-23:30',
	value: '06:50-23:30'
},{
	text: '06:50-08:25,18:00-23:30',
	value: '06:50-08:25,18:00-23:30'
},{
	text: '08:00-23:30',
	value: '08:00-23:30'
}];


var heaterForm = new Ext.form.FormPanel({
	id: 'chauffage',
	hidden: true,
	url: 'json/postTempConfiguration.php',
	listeners: {
		submit: function(form, result) {
			Ext.Msg.alert('Configuration sauvegardée');
		},
		exception: function(form, result) {
			Ext.Msg.alert('Erreur');
		},
		show: function(form) {
			RequestedTemp.load({
				scope: this,
				callback: RequestedTempLoaded});
			RequestedTempRooms.load({
				scope: this,
				callback: RequestedTempRoomsLoaded});
		}
	}
});
 
var DomoSet = new Ext.Panel({
	id: 'set',
	title: 'Réglages',
	iconCls: 'settings',
	cls: 'card2',
	dockedItems: [settoolbar],
	fullscreen: true,
	scroll: 'vertical',
	items: [heaterForm]
});
