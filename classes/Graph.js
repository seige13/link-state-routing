const PriorityQueue = require('./PriorityQueue');

/**
 * Graph to represent shortest path algorithm
 */
class Graph {
    constructor(map) {
        this.vertices = map || {};
    }

    addVertexToGraph(name, edges) {
        this.vertices[name] = edges;
    }

    findShortestPath(start, finish) {
        let nodes = new PriorityQueue();
        let distances = {};
        let previous = {};
        let path = [];
        let smallest, vertex, neighbor, alt;

        for (vertex in this.vertices) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            }
            else {
                distances[vertex] = Infinity;
                nodes.enqueue(Infinity, vertex);
            }

            previous[vertex] = null;
        }

        while (!nodes.isEmpty()) {
            smallest = nodes.dequeue();

            if (smallest === finish) {
                path = [];

                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }

                break;
            }

            if (!smallest || distances[smallest] === Infinity) {
                continue;
            }

            for (neighbor in this.vertices[smallest]) {
                alt = distances[smallest] + this.vertices[smallest][neighbor];

                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            }
        }

        path.push(start);
        path = path.reverse();
        let cost = 0;
        for (let i = 0; i < path.length-1; i++) {
            cost += this.vertices[path[i]][path[i+1]];
        }
        return [path,cost];
        // return path;
    }
}

module.exports = Graph