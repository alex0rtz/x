const os = require('os');
const ifaces = os.networkInterfaces();

const ip = _ => {
    for (let ifname in ifaces) {
        let alias = 0;
    
        for (let iface of ifaces[ifname]) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                continue;
            }
    
            if (alias >= 1) {
                // console.log(ifname + ':' + alias, iface.address);
            } else {
                // console.log(ifname, iface.address);
                
                if (iface.address.includes('192.168.1')) {
                    return iface.address;
                }
            }
    
            ++alias;
        }
    }
};

module.exports = {
    ip
}