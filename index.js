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
        this.graph = new Graph();
    }

    /**
     * Main function to run the application
     */
    main() {
        // TODO Initialize router
        this.initializeRouterFromFile();

        console.log('Welcome to the Link State Router Application \n');
        this.promtUser();

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

        inquirer.prompt(questions).then(answer => {
            switch (answer.user_choice) {
                case 'continue':
                    // If the user chooses to continue, you should call the originatePacket() function on every router 
                    // in whatever order you choose. Then prompt again.
                    console.log('continue');
                    break;
                case 'print':
                    // If the user chooses to print the routing table, display the table
                    this.printRoutingTable();
                    // console.log('print');
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
            if (line.indexOf('\r')) {
                line = line.split('\r')[0];
            }
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
                router.routing_table_1.push(connectedRouter);
                router.neighbors[line[1]] = parseInt(line[2]) || 1;
                this.graph.addVertexToGraph(router.id, router.neighbors);
                router.link_cost = line.length > 2 ? line[2] : 1;
            }
        }, this);

        console.log(this.graph);
        this.generateRoutingTables();
    }

    /**
     * 
     */
    generateRoutingTables() {
        for (let router of this.routers.values()) {
            this._generateRoutingTable(router.id);
        } 
    }


    /**
     * 
     * @param {*} router_id 
     */
    _generateRoutingTable(router_id) {
        const router = this.routers.get(router_id);
        for (let node of this.routers.values()) {
            if (node.id != router_id && node.status == 'start') {
                let network = node.network_name;
                let shortestPath = this.graph.findShortestPath(router_id, node.id);
                let link = shortestPath[0][1];
                let cost = shortestPath[1];

                router.routing_table.push({network, link, cost});
            }
        } 
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
    printRoutingTable() {
        let that = this;

        let question = [
            {
                type: 'input',
                name: 'router_id',
                message: 'Please enter ID of the router to print routing table',
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
            router.printRoutingTable();
            this.promtUser();
        });
    }

}

// Run the application
const application = new App();
application.main();

// // Test for shortest path
// const graph = {
//     start: { A: 5, B: 2 },
//     A: { C: 4, D: 2 },
//     B: { A: 8, D: 7 },
//     C: { D: 6, finish: 3 },
//     D: { finish: 1 },
//     finish: {}
// };

// let spf1 = new Graph();
// spf1.addVertexToGraph('A', {B: 3, F: 15});
// spf1.addVertexToGraph('B', {F: 7, G: 8});
// spf1.addVertexToGraph('F', {H: 7, K: 8});

// console.log(spf1.findShortestPath('A', 'F'))

