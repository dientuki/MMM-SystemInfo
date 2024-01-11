const NodeHelper = require("node_helper");
const {execSync} = require('child_process');
const Log = require("logger");

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
            cpuTemperature: this.getCpuTemperature()
        }

        this.stats = JSON.parse(JSON.stringify(this.stats));
        this.sendSocketNotification("STATS", this.stats);

        setTimeout(function () {
            self.getStats();
        }, this.config.updateInterval);        
    },

    getCpuUsage: function() {
        return parseFloat(this.exec(this.config.cpuUsageCommand));
    },
    getRamUsage: function() {
        return parseFloat(this.exec(this.config.ramUsageCommand));
    },    
    getAvailableSpacePercentage: function() {
        return this.exec(this.config.diskUsageCommand);
    },    
    getCpuTemperature: function() {
        const t = this.exec(this.config.cpuTemperatureCommand);
        return this.convertTemperature(t);
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
            convertedTemp = ((temperature / 1000) * 1.8 + 32).toFixed(0) + '°F';
            break;
          case "metric":
          default:
            convertedTemp = (temperature / 1000).toFixed(0) + '°C';
        }
      
        return convertedTemp;
    },
          
});