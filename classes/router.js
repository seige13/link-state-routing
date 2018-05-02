const LinkStatePacket = require('./linkStatePacket');

/**
 * Each router should maintain a data structure that stores references to other "directly" connected routers, 
 * which can be referenced by id, along with the cost of the link. 
 * These routers will exchange information necessary to build a routing table. 
 * Each router will be advertising access to a particular named network, 
 * which is a string that should be stored in the router class.
 */
class Router {

    constructor() {
        this.id = '';
        this.tick = 0;
        this.network_name = '';
        this.link_cost = 1;
        this.neighbors = {}; //data structure that stores references to other "directly" connected routers, which can be referenced by id, along with the cost of the link.
        this.routing_table = []; //Each router should maintain a "routing table" consisting of <network, outgoing link, cost> triples
        this.received_lsps = {}; //the receiving router has already seen an LSP from the same originating router with a sequence number higher than or equal to the sequence number in the received LSP.
    }

    /**
     * A router that receives an LSP should first decrement the LSP's TTL. 
     * Next, the receiving router should discard the LSP and not use its information if either:
     *  (1) the TTL has reached zero, or 
     *  (2) the receiving router has already seen an LSP from the same originating router with a sequence number higher than 
     *  or equal to the sequence number in the received LSP. 
     * 
     * If the LSP is not discarded, its information should be compared to the receiving router’s 
     * connectivity graph and the LSP should be sent out (in the form of function calls) to 
     * all directly connected routers except the one on which it was received.
     * @param {LinkStatePacket} lsp 
     * @param {Int} router_id 
     */
    receivePacket(lsp, router_id) {
        lsp.ttl--;  //A router that receives an LSP should first decrement the LSP's TTL

        if (lsp.ttl == 0 || (lsp.router_id in this.received_lsps && this.received_lsps[lsp.router_id] >= lsp.sequence) ) {
            //discard the LSP and not use its information
        }
        else {
            this.received_lsps[lsp.router_id] = lsp.sequence;

            //If the LSP is not discarded, its information should be compared to the receiving 
            //router’s connectivity graph and the LSP should be sent out (in the form of function calls) 
            //to all directly connected routers except the one on which it was received.
        }
    }

    /**
     * It should cause the router to generate an LSP packet based on the current state of the network as it understands it, 
     * and send it to all directly connected routers. Before it sends the packet, however, it should also increment a "tick" 
     * counter and consider if there are any directly connected routers from which it has not received a packet in 2 ticks. 
     * If that occurs, the router should alter its graph to reflect that the cost of the link to the other router is now 
     * infinity (or some arbitrarily huge number that you choose to represent infinity, if your language does not have a 
     * special infinity value.).
     */
    originatePacket() {
        let lsp = new LinkStatePacket();
        this.tick++;
    }

    /**
     * If connectivity has changed (as indicated by a received link state packet), the receiving router should run 
     * Dijkstra’s all-pairs shortest-path algorithm on its updated connectivity graph to re-compute its routing 
     * table of <network, outgoing link, cost> triples. 
     */
    shortestPath() {

    }
}

module.exports = Router