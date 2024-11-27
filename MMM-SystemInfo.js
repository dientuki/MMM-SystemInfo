"use strict";

Module.register("MMM-SystemInfo", {
    // Default module config.
    defaults: {
        tableClass: 'small',
        /* wifi */
        showqr: true,
        qrSize: 125,
        network: 'network',
        password: 'pass',
        authType: 'WPA',
        hiddenId: false,
        showNetwork: true,
        showPassword: true,
        showAuthType: true,
        /* stats */
        showCpuUsage: false,
        cpuUsageCommand: "top -b -n 1 | awk '/^%Cpu/{gsub(/,/, \".\", $8); print 100 - $8}'",
        showRamUsage: false,
        ramUsageCommand: 'free | awk \'/Mem:/ { printf("%.1f\\n", (($3 + $5) / $2) * 100) }\'',
        showDiskUsage: false,
        diskUsageCommand: "df --output=pcent / | tail -n 1 | tr -d '% '",
        showCpuTemperature: false,
        cpuTemperatureCommand: "cat /sys/class/thermal/thermal_zone0/temp",
        showInternet: true,
        showPrivateIp: true,
        showVolume: false,
        showVolumeCommand: "amixer get Master | grep 'Front Left:' | awk -F '[][]' '{ print $2 }' | tr -d '%'",
        /* design */
        //ltr: qr box | stats
        //rtl: stats | qr box
        layout: "ltr",
        connectedColor: "#008000",
        disconnectedColor: "#ff0000",  
        wifiDataCompact: false,      
        units: config.units,
        updateInterval: 2000,
        decimal: 1,
    },

    getTranslations() {
        return {
          en: "translations/en.json",
          es: "translations/es.json",
          tr: "translations/tr.json"
        };
      },    

    // Override dom generator.
    getDom: function () {
        this.root = document.createElement("div");
        const systemDiv = this.createSystemDiv();
        this.root.classList.add(
            'SI-container',
            this.config.tableClass,
            'layout-' + this.config.layout
        );
        
        if (this.config.showqr) {
            const wifiDiv = this.createWifiDiv();
            wifiDiv.classList.add('SI-wifi');
            this.root.appendChild(wifiDiv);
        }
        
        systemDiv.classList.add('SI-system-info');
        this.root.appendChild(systemDiv);

        return this.root;
    },  

    createSystemDiv: function () {
        const table = document.createElement("table");

        const conditionsAndFunctions = [
            {
                condition: this.config.showCpuUsage,
                func: this.showCpuUsage.bind(this)
            },
            {
                condition: this.config.showRamUsage,
                func: this.showRamUsage.bind(this)
            },
            {
                condition: this.config.showDiskUsage,
                func: this.showDiskUsage.bind(this)
            },
            {
                condition: this.config.showCpuTemperature,
                func: this.showCpuTemperature.bind(this)
            },
            {
                condition: this.config.showVolume,
                func: this.showVolume.bind(this)
            },            
            {
                condition: this.config.showInternet,
                func: this.showInternet.bind(this)
            },
            {
                condition: this.config.showPrivateIp,
                func: this.showPrivateIp.bind(this)
            },    
        ];
          
        conditionsAndFunctions.forEach(({ condition, func }) => {
            if (condition) {
                table.appendChild(func());
            }
        });

        return table;
    },

    showCpuUsage: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
        
        tr.classList.add('cpuUsage');
        icon.classList.add('fa-tachometer');
        key.innerHTML = this.translate("CPU_USAGE_PERCENT");

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;
    },
    showRamUsage: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
                
        tr.classList.add('ramUsage');        
        icon.classList.add('fa-microchip');
        key.innerHTML = this.translate("RAM_USAGE_PERCENT");

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;
    }, 
    showDiskUsage: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
        
        tr.classList.add('diskUsage');
        icon.classList.add('fa-hard-drive');
        key.innerHTML = this.translate("DISK_USAGE_PERCENT");

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;        
    },
    showCpuTemperature: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
        
        tr.classList.add('cpuTemperature');
        icon.classList.add('fa-thermometer');
        key.innerHTML = this.translate("TEMPERATURE");

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;    
    }, 

    showInternet: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.icon();
        
        tr.classList.add('internet');
        icon.classList.add('fa-wifi');
        key.innerHTML = this.translate("INTERNET");
        value.classList.add('status')
        
        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.classList.add('align-right');
        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;           
    },   

    showPrivateIp: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.icon();
        
        tr.classList.add('privateIp');
        icon.classList.add('fa-network-wired');
        value.classList.add('status')
        
        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.classList.add('align-right');
        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;             
    }, 
    showVolume: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
        
        tr.classList.add('volume');
        key.innerHTML = this.translate("VOLUME");

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.classList.add('align-center');
        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;             
    },

    volumeStatus(number) {
        let volume;
    
        if (number >= 0 && number <= 10) {
            volume = "fa-volume-off";
        } else if (number >= 80 && number <= 100) {
            volume = "fa-volume-up";
        } else {
            volume = "fa-volume-down";
        }
    
        return volume;
    },           

    createWifiDiv: function() {
        const wrapper = document.createElement("div");
        const textDiv = document.createElement("div");
        const qrDiv = document.createElement("div");
        const networkNameP = document.createElement("p");
        const networkPassP = document.createElement("p");
        const networkTypeP = document.createElement("p");
        new qrCode(qrDiv, this.qrOptions);
        
        qrDiv.id = "qrdiv";
        qrDiv.className = "SI-qrimage";
        
        wrapper.appendChild(qrDiv);   

        textDiv.classList.add(
            'bright', //MM default class
            this.config.wifiDataCompact ? 'compact' : false
        )

        networkNameP.className = "network";
        networkNameP.innerHTML = '<b>' + this.translate("NETWORK") +'</b>' + this.config.network;
        if (this.config.showNetwork) {
            textDiv.appendChild(networkNameP);
        }

        networkPassP.className = "password";
        networkPassP.innerHTML = '<b>' + this.translate("PASSWORD") +'</b>' + this.config.password;
        if (this.config.showPassword) {
            textDiv.appendChild(networkPassP);
        }

        networkTypeP.className = "auth-type";
        networkTypeP.innerHTML = '<b>' + this.translate("AUTHENTICATION") +'</b>' + this.config.authType.toUpperCase();
        if (this.config.showAuthType) {
            textDiv.appendChild(networkTypeP);
        }
        
        wrapper.appendChild(textDiv);
        return wrapper;
    },

    start: function() {
        this.root = document.querySelector(":root");
        let auth;

        this.root.style.setProperty('--qr-width', this.config.qrSize + 'px');
        this.root.style.setProperty('--internet-on', this.config.connectedColor);
        this.root.style.setProperty('--internet-off', this.config.disconnectedColor);
        this.stats = {
            cpuUsage: 0,
            ramUsage: 0,
            diskUsage: 0,
            cpuTemperature: 0,
            privateIp: null,
            volume: -1
        }

        this.html = {
            tr: function() {
                const tr = document.createElement("tr");
                tr.className = 'tr';
                return tr;
            },            
            td: function() {
                const td = document.createElement("td");
                td.className = 'td';
                return td;
            },                        
            icon: function() {
                const i = document.createElement("i");
                i.className = 'fa';
                return i;
            },
            key: function() {
                const span = document.createElement("span");
                span.className = 'key';
                return span;
            },
            value: function() {
                const span = document.createElement("div");
                span.className = 'value';
                return span;
            },
        }
	  
        switch(this.config.authType.toUpperCase()) {
          case "WPA":
          case "WEP":
              auth = this.config.authType.toUpperCase();
              break;
          case "none":
              auth = "nopass";
              break;
          default:
              auth = "nopass";
              break;
        }
        
        //TODO: Allow for special characters
        this.qrText = "WIFI:" +
        "T:"  + auth +
        ";S:" + this.config.network +
        ";P:" + this.config.password +
        ";H:" + this.config.hiddenId +
        ";";   

        this.qrOptions = {
            text: this.qrText,
            width: this.config.qrSize,
            height: this.config.qrSize,
            colorDark: "#000",
            colorLight: "#FFF",
            correctLevel: qrCode.CorrectLevel.H
        };        
        
        this.sendSocketNotification("CONFIG", this.config);
    },

    smartUpdate: function(payload) {
        const conditionsAndFunctions = [
            {
                condition: this.config.showCpuUsage,
                func: this.updateCpuUsage.bind(this)
            },
            {
                condition: this.config.showRamUsage,
                func: this.updateRamUsage.bind(this)
            },
            {
                condition: this.config.showDiskUsage,
                func: this.updateDiskUsage.bind(this)
            },
            {
                condition: this.config.showCpuTemperature,
                func: this.updateCpuTemperature.bind(this)
            },
            {
                condition: this.config.showVolume,
                func: this.updateVolume.bind(this)
            },            
            {
                condition: this.config.showInternet,
                func: this.updateInternet.bind(this)
            },
            {
                condition: this.config.showPrivateIp,
                func: this.updatePrivateIp.bind(this)
            },    
        ];
          
        conditionsAndFunctions.forEach(({ condition, func }) => {
            if (condition) {
                func(payload);
            }
        });
    },

    updateCpuUsage: function(payload) {
        if (payload.cpuUsage != this.stats.cpuUsage) {
            const value =  this.root.querySelector('.cpuUsage .value');
            if (value != undefined) {
                value.innerHTML = payload.cpuUsage.toFixed(this.config.decimal) + '%';
            }
        }
    },

    updateRamUsage: function(payload) {
        if (payload.ramUsage != this.stats.ramUsage ) {
            const value =  this.root.querySelector('.ramUsage .value');
            if (value != undefined) {
                value.innerHTML = payload.ramUsage.toFixed(this.config.decimal) + '%';
            }
        }
    },    

    updateDiskUsage: function(payload) {
        if (payload.diskUsage != this.stats.diskUsage) {
            const value =  this.root.querySelector('.diskUsage .value');
            if (value != undefined) {
                value.innerHTML = parseFloat(payload.diskUsage).toFixed(this.config.decimal) + '%';
            }
        }
    },     

    updateCpuTemperature: function(payload) {
        if (payload.cpuTemperature != this.stats.cpuTemperature ) {
            const value =  this.root.querySelector('.cpuTemperature .value');
            if (value != undefined) {
                value.innerHTML = this.config.units == "imperial" ? payload.cpuTemperature +'°F' : payload.cpuTemperature + '°C' ;
            }
        }
    },     
    
    updateInternet: function(payload) {
        const value =  this.root.querySelector('.internet .status');
        if (value != undefined) {
            value.className = `fa status bold ${window.navigator.onLine ? ' online fa-check' : ' offline fa-times'}`;
        }
    },     

    updatePrivateIp: function(payload) {
        if (payload.privateIp != this.stats.privateIp ) {
            const wrapper =  this.root.querySelector('.privateIp');
            if (wrapper != undefined) {
                wrapper.querySelector('.key').innerHTML = payload.privateIp;
                wrapper.querySelector('.status').className = `fa status bold ${payload.privateIp == null ? 'offline fa-times' : 'online fa-check'}`;
            }
        }
    },

    updateVolume: function(payload) {
        if (payload.volume != this.stats.volume ) {
            const wrapper =  this.root.querySelector('.volume');
            if (wrapper != undefined) {
                wrapper.querySelector('.fa').className = 'fa ' + this.volumeStatus(payload.volume);
                wrapper.querySelector('.value').innerHTML = payload.volume + '%';
            }
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STATS") {
            this.smartUpdate(payload);
            this.stats = payload;
        }
    },    

    getScripts: function() {
        return [
          this.file('utils/qrcode.min.js'), // library that creates qrcode. Thanks to https://github.com/davidshimjs/qrcodejs
        ];
    },    

    getStyles: function() {
        return [
            this.file('css/MMM-SystemInfo.css'), // this file will be loaded straight from the module folder.
        ]
    },    
});
