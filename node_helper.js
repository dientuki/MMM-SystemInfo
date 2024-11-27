const NodeHelper = require("node_helper");
const {execSync} = require('child_process');
const Log = require("logger");
const os = require('os');

module.exports = NodeHelper.create({
    start: function () {
        Log.log("Starting node helper: " + this.name);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            this.getStats();
        }
    },    

    getStats: function () {
        const self = this;
        this.stats = {
            cpuUsage: this.getCpuUsage(),
            ramUsage: this.getRamUsage(),
            diskUsage: this.getAvailableSpacePercentage(),
            cpuTemperature: this.getCpuTemperature(),
            privateIp: this.getPrivateIP(),
            volume: this.getVolume()
        }

        this.stats = JSON.parse(JSON.stringify(this.stats));
        this.sendSocketNotification("STATS", this.stats);

        setTimeout(function () {
            self.getStats();
        }, this.config.updateInterval);        
    },

    getCpuUsage: function() {
        return this.config.showCpuUsage ? parseFloat(this.exec(this.config.cpuUsageCommand)) : '';
    },
    getRamUsage: function() {
        return this.config.showRamUsage ? parseFloat(this.exec(this.config.ramUsageCommand)) : '';
    },    
    getAvailableSpacePercentage: function() {
        return this.config.showDiskUsage ? this.exec(this.config.diskUsageCommand) : '';
    },    
    getCpuTemperature: function() {
        if (this.config.showCpuTemperature) {
            const t = this.exec(this.config.cpuTemperatureCommand);
            return this.convertTemperature(t);
        }
    },    
    getPrivateIP() {
        if (this.config.showPrivateIp) { 
            const interfaces = os.networkInterfaces();
            for (const iface in interfaces) {
            for (const addr of interfaces[iface]) {
                if (!addr.internal && addr.family === 'IPv4') {
                return addr.address;
                }
            }
            }
            return null; // Return null if no private IP found
        }
    },
    getVolume() {
        return this.config.showVolume ? parseFloat(this.exec(this.config.showVolumeCommand)) : '0';   
    },

    exec: function(cmd){
        try {
            const result = execSync(cmd);
            return result.toString();
        } catch (error) {
            Log.error(`${this.name} - Error getting data. Command: ${cmd}`)
        }        
    },
    
    convertTemperature: function(temperature) {
        let convertedTemp;
        
        switch(this.config.units) {
          case "imperial":
            convertedTemp = ((temperature / 1000) * 1.8 + 32).toFixed(this.config.decimal);
            break;
          case "metric":
          default:
            convertedTemp = (temperature / 1000).toFixed(this.config.decimal);
        }
      
        return convertedTemp;
    },
          
});
