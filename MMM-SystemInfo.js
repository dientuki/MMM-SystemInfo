Module.register("MMM-SystemInfo", {
    // Default module config.
    defaults: {
        tableClass: 'small',
        /* wifi */
        qrSize: 125,
        network: 'network',
        password: 'pass',
        authType: 'WPA',
        hiddenId: false,
        showNetwork: true,
        showPassword: true,
        showAuthType: true,
        wifiDataCompact: false,
        /* stats */
        units: config.units,
        updateInterval: 2000,
        showCpuUsage: true,
        cpuUsageCommand: "awk '/^%Cpu/{gsub(/,/, \".\", $8); print 100 - $8}' <(top -b -n 1)",
        showRamUsage: true,
        ramUsageCommand: 'free | awk \'/Mem:/ { printf("%.1f\\n", (($3 + $5) / $2) * 100) }\'',
        showDiskUsage: true,
        diskUsageCommand: "df -P /dev/sda3 | awk 'NR==2 {print $5}'",
        showCpuTemperature: true,
        cpuTemperatureCommand: "echo \"$(( ($(cat /sys/class/thermal/thermal_zone1/temp) + $(cat /sys/class/thermal/thermal_zone2/temp)) / 2 ))\"",
        showInternet: true,
	    connectedColor: "#008000",
	    disconnectedColor: "#ff0000",
    },

    getTranslations() {
        return {
          en: "translations/en.json",
          es: "translations/es.json"
        };
      },    

    // Override dom generator.
    getDom: function () {
        const wrapper = document.createElement("div");
        const wifiDiv = this.createWifiDiv();
        const systemDiv = this.createSystemDiv();
        const cssClass = [
            'SI-container',
            this.config.tableClass
        ]

        wrapper.className = cssClass.join(' ');
        wrapper.appendChild(systemDiv);
        wrapper.appendChild(wifiDiv);

        return wrapper;
    },  

    createSystemDiv: function () {
        const table = document.createElement("table");
        table.className = 'SI-system-info';

        const conditionsAndFunctions = [
            {
                condition: this.config.showCpuUsage,
                func: this.cpuUsage.bind(this)
            },
            {
                condition: this.config.showRamUsage,
                func: this.ramUsage.bind(this)
            },
            {
                condition: this.config.showDiskUsage,
                func: this.diskUsage.bind(this)
            },
            {
                condition: this.config.showCpuTemperature,
                func: this.cpuTemperature.bind(this)
            },
            {
                condition: this.config.showInternet,
                func: this.internet.bind(this)
            }  
        ];
          
        conditionsAndFunctions.forEach(({ condition, func }) => {
            if (condition) {
                table.appendChild(func());
            }
        });

        return table;
    },

    cpuUsage: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
        
        icon.classList.add('fa-tachometer');
        key.innerHTML = this.translate("CPU_USAGE_PERCENT");
        value.innerHTML = this.stats.cpuUsage.toFixed(1) + '%';

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;
    },
    ramUsage: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
                
        icon.classList.add('fa-microchip');
        key.innerHTML = this.translate("RAM_USAGE_PERCENT");
        value.innerHTML = this.stats.ramUsage.toFixed(1) + '%';

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;
    }, 
    diskUsage: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
        
        icon.classList.add('fa-hard-drive');
        key.innerHTML = this.translate("DISK_USAGE_PERCENT");
        value.innerHTML = parseFloat(this.stats.diskUsage).toFixed(1) + '%';

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;        
    },
    cpuTemperature: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.value();
        
        icon.classList.add('fa-thermometer');
        key.innerHTML = this.translate("TEMPERATURE");
        value.innerHTML = this.stats.cpuTemperature;

        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;    
    }, 

    internet: function () {
        const tr = this.html.tr();
        const td1 = this.html.td();
        const td2 = this.html.td();
        const icon = this.html.icon();
        const key = this.html.key();
        const value = this.html.icon();
        tr.classList.add('internet');
        
        icon.classList.add('fa-wifi');
        key.innerHTML = this.translate("INTERNET");
        value.className += window.navigator.onLine ? ' bold online fa-check' : ' bold offline fa-times';
        
        td1.appendChild(icon);
        td1.appendChild(key);
        tr.appendChild(td1);

        td2.classList.add('align-center');
        td2.appendChild(value);
        tr.appendChild(td2);
        
        return tr;           
    },            

    createWifiDiv: function() {
        const wrapper = document.createElement("div");
        const textDiv = document.createElement("div");
        const qrDiv = document.createElement("div");
        const networkNameP = document.createElement("p");
        const networkPassP = document.createElement("p");
        const networkTypeP = document.createElement("p");

        wrapper.className = 'SI-wifi';
        
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

        qrCode = new QRCode(qrDiv, this.qrOptions);
        
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
            cpuTemperature: this.config.units == "imperial" ? '0°F' : '0°C' 
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
            correctLevel: QRCode.CorrectLevel.H
        };        
        
        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STATS") {
            this.stats = payload;
            this.updateDom();
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
