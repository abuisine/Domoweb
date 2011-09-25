Ext.setup({
    icon: 'img/icon.png',
    tabletStartupScreen: 'img/tablet_startup.png',
    phoneStartupScreen: 'img/phone_startup.png',
    glossOnIcon: true,
    onReady: function() {

        var DomoWeb = new Ext.TabPanel({
		id: 'DomoWeb',
            tabBar: {
                dock: 'bottom',
                layout: {
                    pack: 'center'
                }
            },
            fullscreen: true,
	    layout: 'fit',
            ui: 'dark',
            cardSwitchAnimation: {
		type: 'slide',
                direction: 'up',
                cover: true
            },
            
            defaults: {
                scroll: 'vertical'
            },
            items: [
		DomoList, 
		DomoTemp,
		DomoLog,
		DomoAuto,
		DomoSet
            ]
        });
    }
});
