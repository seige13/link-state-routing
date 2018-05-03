/**
 * Link State Routing
 * 
 * The goal of this assignment is to create a virtual network of routers that send routing data to one another. 
 * This assignment models the way that actual dynamic network routing is performed.
 */

const inquirer = require('inquirer');
const fs = require('fs');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const Router = require('./classes/router');

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

        console.log('Welcome to the Link State Router Application \n');
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
                    // rl.question('Please enter ID number of the router that you want to shut down: ', (answer) => {
                        
                    //     console.log(`Router ${answer} is now shut down`);      
                    //     rl.close();
                    //   });
                    this.shutDownRouter();
                    // console.log('shutdown');
                    break;
                case 'start':
                    // If the user starts up a router, change the router object so it once again behaves normally.
                    console.log('start');
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

        // console.log(input);

        let lastRouterId = '';
        input.forEach(function (line) {
            if (line.indexOf('\r')) {
                line = line.split('\r')[0];
            }
            line = line.split(' ');
            console.log(line);
            if (line[0] !== '') {
                const router = new Router();
                router.id = line[0];
                router.network_name = line[1];
                this.routers.set(line[0], router);
                lastRouterId = line[0];
            } else {
                const router = this.routers.get(lastRouterId);
                router.neighbors[line[1]] = parseInt(line[2]) || 1;
                router.routing_table.push(line[1]);
                console.log(router.neighbors);
                router.link_cost = line.length > 2 ? line[2] : 1;
            }
        }, this);

        console.log(this.routers);
    }

    shutDownRouter() {
        let question = [
            {
                type: 'input',
                name: 'router_id',
                message: 'Please enter ID of the router that you would like to shut down',
            }
        ];

        inquirer.prompt(question).then(answer => {
            console.log(answer.router_id);
        });
        // console.log('shutDownRouter');
    }
}

// Run the application
const application = new App();
application.main();

// rl.question('Please enter ID number of the router that you want to shut down: ', (answer) => {
                        
//     console.log(`Router ${answer} is now shut down`);      
//     rl.close();
//   });

// const uuid = require('uuid/v4');
// let i = uuid();
// console.log(i);

