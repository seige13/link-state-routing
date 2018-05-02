// Link State Packet class
const uuid = require('uuid/v4');

class LinkStatePacket {
    constructor() {
        // ID of the router that originates the LSP
        // Making this a random id for now
        this.id = uuid();
        this.router_id = '';
        // A sequence number indicating how many LSPs have been sent by the originating router; 
        // i.e., each newly originated LSP has a higher sequence number than all previous LSPs.
        this.sequence = 1;
        // Time to live, decremented each time the LSP is forwarded; with an initial value of 10
        this.ttl = 10;
        // A list that indicates each reachable network (indicated by the network name stored in the router's string).
        // A list that indicates each directly connected router, the network behind each one, and the cost to get to that router.
        this.list = {};
        // The id of the router that the packet is sent from
        this.sent_from = '';
    }
}

module.exports = LinkStatePacket