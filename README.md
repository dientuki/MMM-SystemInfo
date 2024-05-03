# MMM-SystemInfo
Magic Mirror Module that displays a lot of useful info as:
- CPU load
- RAM usage
- Disk usage
- CPU temperature
- Volume
- Internet status
- Private ip
- Wifi network to share

Note that if you have special characters in your password, the QR code will not work.  This is because I haven't done the work required to escape the special characters properly.

**Disclaimer:**
- The WifiPassword is mostly [this module](https://github.com/TeraTech/MMM-WiFiPassword), I just add it to this module.
- Internet status is "bassed" on [this module](https://github.com/sheyabernstein/MMM-connection-status)

## Screenshot
![MMM-SystemInfo Screenshot Compact](https://raw.githubusercontent.com/dientuki/MMM-SystemInfo/master/screenshots/screenshot-compact.png)
Full example

## Installation
1. In your terminal, change to your Magic Mirror module directory

`cd ~/MagicMirror/modules`

2. Clone this repository `git clone https://github.com/dientuki/MMM-SystemInfo.git`

3. Make changes to your `config.js` file.  
  
## How to use this module
As with other MM modules, add this array to the `config/config.js` file
``` 
modules:[
  {
    module: 'MMM-SystemInfo',
    position: "bottom_right",
      config: {
        //See 'Configuration options' for more information.
      }
  },
]
```

## Configuration Options 

### Wifi

| Option | Description | Default |
| ------------- | ------------- | ------------- |
| `qrSize`  | The width and height of QRCode in pixels. <br>**Type:** `int` | 125 |
| `authType`  | Your authentication type. <br>**Options:** `WPA` `WEP` `NONE` | WPA |
| `network`  | Your network SSID.<br>**Type:** `string` | REQUIRED |
| `password`  | Your network Password.<br>**Type:** `string` | REQUIRED |
| `hiddenId`  | Whether your SSID is hidden.<br>**Type:** `boolean` | false |
| `wifiDataCompact`  | How to display your netkwork info, full (several lines) or compact (one line, just the data).<br>**Type:** `boolean` | false |
| `showNetwork`  | Show network SSID.<br>**Type:** `boolean` | true |
| `showPassword`  | Show your network password.<br>**Type:** `boolean` | true |
| `showAuthType`  | Show your authentication type.<br>**Type:** `boolean` | true |

### Stats

There are several ways to get the stats, it may vary according to your SO or custom instalattion... so, here is the catch. Just add the command thats works for you buddy.
I put as example the commands that im using on my ubunut linux on my old pc, but check every command in your enviroment.
Addionally, you can set showSTAT to false and omit the stat to show, it is usefull is any value is wrong and you want to avoid dealing with that stat

| Option | Description | Default |
| ------------- | ------------- | ------------- |
| `showCpuUsage`  | Show your CPU usage.<br>**Type:** `boolean` | true |
| `cpuUsageCommand`  | Command to get the cpu usage.<br>**Example:**`awk '/^%Cpu/{gsub(/,/, ".", $8); print 100 - $8}' <(top -b -n 1)`<br>**Type:** `string` | |



### Design

| Option | Description | Default |
| ------------- | ------------- | ------------- |
| `layout`  | The order of the QR and table, usefull is you want to use it at right or left corners <br> `ltr`: QR box \| Stats <br> `rtl`: Stats \| QR box <br />**Options:** `ltr` `rtl` | ltr |
| `connectedColor`  | Color to use as ok status. <br>**Type:** `string` | #008000 |
| `disconnectedColor`  | Color to use as fail status. <br>**Type:** `string` | #ff0000 |
| `wifiDataCompact`  | How to display your netkwork info, full (several lines) or compact (one line, just the data).<br>**Type:** `boolean` | false |
| `units`  | Use either 'metric' or 'imperial' to display the temperature.<br>**Options:** `metric` `imperial` | Inherit from config.js |
| `updateInterval`  | How often does the content needs to be fetched? (Milliseconds) <br>**Type:** `int` | 2000 |
| `decimal`  | How much decimal numbers want to show <br>**Type:** `int` | 1 |


