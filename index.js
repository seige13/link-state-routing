/**
 * Link State Routing
 * 
 * The goal of this assignment is to create a virtual network of routers that send routing data to one another. 
 * This assignment models the way that actual dynamic network routing is performed.
 */

const inquirer = require('inquirer');
const fs = require('fs');

const Router = require('./classes/router');
const Graph = require('./classes/Graph')

class App {

    constructor() {
        this.routers = new Map();
    }

    /**
     * Main function to run the application
     */
    main() {
        // TODO Initialize router
        this.initializeRouterFromFile();

        console.log('Welcome to the Link State Router Application \n');

        this.promtUser();

        // const questions = [
        //     {
        //         type: 'list',
        //         name: 'user_choice',
        //         message: 'What would you like to do?',
        //         choices: ['Continue', 'Print', 'Shutdown', 'Start', 'Quit'],
        //         filter: function (val) {
        //             return val.toLowerCase();
        //         }
        //     }
        // ];

        // console.log('Welcome to the Link State Router Application \n');
        // inquirer.prompt(questions).then(answer => {
        //     switch (answer.user_choice) {
        //         case 'continue':
        //             // If the user chooses to continue, you should call the originatePacket() function on every router 
        //             // in whatever order you choose. Then prompt again.
        //             console.log('continue');
        //             break;
        //         case 'print':
        //             // If the user chooses to print the routing table, display the table
        //             console.log('print');
        //             break;
        //         case 'shutdown':
        //             // If the user shuts down a router, change the router object so that it does not send out any 
        //             // LSP or do anything in response to originatePacket or receivePacket function calls.
        //             this.shutDownRouter();
        //             // console.log('shutdown');
        //             break;
        //         case 'start':
        //             // If the user starts up a router, change the router object so it once again behaves normally.
        //             this.startUpRouter()
        //             // console.log('start');
        //             break;
        //         case 'quit':
        //         default:
        //             console.log('quit');
        //             break;
        //     }
        // });
    }

    promtUser() {
        const questions = [
            {
                type: 'list',
                name: 'user_choice',
                message: 'What would you like to do?',
                choices: ['Continue', 'Print', 'Shutdown', 'Start', 'Quit'],
                filter: function (val) {
                    return val.toLowerCase();
                }
            }
        ];

        // console.log('Welcome to the Link State Router Application \n');
        inquirer.prompt(questions).then(answer => {
            switch (answer.user_choice) {
                case 'continue':
                    // If the user chooses to continue, you should call the originatePacket() function on every router 
                    // in whatever order you choose. Then prompt again.
                    console.log('continue');
                    break;
                case 'print':
                    // If the user chooses to print the routing table, display the table
                    console.log('print');
                    break;
                case 'shutdown':
                    // If the user shuts down a router, change the router object so that it does not send out any 
                    // LSP or do anything in response to originatePacket or receivePacket function calls.
                    this.shutDownRouter();
                    // console.log('shutdown');
                    break;
                case 'start':
                    // If the user starts up a router, change the router object so it once again behaves normally.
                    this.startUpRouter();
                    // console.log('start');
                    break;
                case 'quit':
                default:
                    console.log('quit');
                    break;
            }
        });
    }

    /**
     * Initialize the router from an input file
     */
    initializeRouterFromFile() {
        let input = fs.readFileSync('infile.dat', 'utf8').split('\n');

        let lastRouterId = '';
        input.forEach(function (line) {
            line = line.split(' ');
            if (line[0] !== '') {
                const router = new Router();
                router.id = line[0];
                router.network_name = line[1];
                this.routers.set(line[0], router);
                lastRouterId = line[0];
            } else {
                const router = this.routers.get(lastRouterId);
                let cost = line[2] ? line[2] : 1
                let connectedRouter = {
                    routerId: +line[1],
                    cost: +cost
                }
                router.neighbors[line[1]] = parseInt(line[2]) || 1;
                router.routing_table.push(connectedRouter);
                router.link_cost = line.length > 2 ? line[2] : 1;
            }
        }, this);
    }

        /**
     * shutDownRouter - shuts down a router
     */
    shutDownRouter() {

        let that = this;

        let question = [
            {
                type: 'input',
                name: 'router_id',
                message: 'Please enter ID of the router that you would like to shut down',
                validate: function (value) {
                    if (that.routers.has(value)) {
                        return true;
                    }
                    else {
                        return 'Router ID is not recognized, please enter a valid router ID';
                    }
                }
            }
        ];

        inquirer.prompt(question).then(answer => {
            const router = this.routers.get(answer.router_id);
            router.status = 'Stop';
            console.log(`Router ${answer.router_id} is shut down`);
            this.promtUser();
        });
    }


    /**
     * startUpRouter - starts up a router
     */
    startUpRouter() {

        let that = this;

        let question = [
            {
                type: 'input',
                name: 'router_id',
                message: 'Please enter ID of the router that you would like to start up',
                validate: function (value) {
                    if (that.routers.has(value)) {
                        return true;
                    }
                    else {
                        return 'Router ID is not recognized, please enter a valid router ID';
                    }
                }
            }
        ];

        inquirer.prompt(question).then(answer => {
            const router = this.routers.get(answer.router_id);
            router.status = 'Start';
            console.log(`Router ${answer.router_id} is started up`);
            this.promtUser();
        });
    }


    /**
     * 
     */
    shortestPaths() {
        for (let node of this.routers.values()) {
            console.log(node.id, node.neighbors);
            const router = this.routers.get(node.id);
            let shortest_path = this.Dijkstra(router.id);
            console.log(shortest_path);
            router.distances = shortest_path['dist'];
            // this.routing_table = []; //Each router should maintain a "routing table" consisting of <network, outgoing link, cost> triples
            console.log(router);
            for (let temp_node of this.routers.values()) {
                console.log(temp_node);
                if (temp_node.id != node.id) {
                    let network = temp_node.network_name;
                    console.log(network);
                    let cost = router.distances[temp_node.id];
                    console.log(cost);
                    let n = temp_node.id;
                    console.log(n);
                    while (n != node.id) {
                        n = shortest_path['prev'][n];
                    }
                }
            }
        }
    }

    /**
     *  Dijkstra's algorithm
     *  reference: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
     */
    Dijkstra(source) {
        let Q = []; //vertex set
        let dist = {};  //distance from source to v
        let prev = {};  //Previous node in optimal path from source
        let u;

        for (let node of this.routers.keys()) {
            dist[node] = Infinity;
            prev[node] = undefined;
            Q.push(node);
        }
        dist[source] = 0;

        // console.log('Q', Q);
        while(Q.length > 0) {   //while Q is not empty
            // console.log('dist', dist);
            u = this._findMin(dist, Q);
            // console.log('u', u);
            let u_index = Q.indexOf(u.toString());
            // console.log(u_index);
            Q.splice(u_index,1);
            // console.log('Q', Q);
            // console.log();
            // console.log(this.routers.get(u.toString()));
            let neighbors = this.routers.get(u.toString()).neighbors;
            for (let v in neighbors) {
                // console.log('V', v.toString());
                if (Q.includes(v.toString())) {
                    // console.log('v', v);
                    // console.log;
                    let alt = dist[u] + neighbors[v];
                    // console.log('alt', alt);
                    if (alt < dist[v]) {
                        dist[v] = alt;
                        prev[v] = u;
                    }
                }
            }
            // delete dist[u];
        }

        // console.log(u);
        console.log('dist', dist);
        console.log('prev', prev);
        return {'dist' : dist, 'prev': prev};
    }

    _findMin(set, arr) {
        let min = 0;
        for (let i in set) {
            if (set[i] < set[min] && arr.includes(i)) {
                min = i;
            }
        }
        return min;
    }

}

// Run the application
const application = new App();
application.main();

// Test for shortest path
const graph = {
    start: { A: 5, B: 2 },
    A: { C: 4, D: 2 },
    B: { A: 8, D: 7 },
    C: { D: 6, finish: 3 },
    D: { finish: 1 },
    finish: {}
};

let spf1 = new Graph(graph);
///spf1.addVertex('A', {B: 7, C: 8});

console.log(spf1.findShortestPath('start', 'finish'))

