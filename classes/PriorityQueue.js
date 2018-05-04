/**
 * Priority Queue used for shortest path algorithm   
 */
class PriorityQueue {
    constructor() {
        this._nodes = [];
    }

    enqueue(priority, key) {
        this._nodes.push({ key: key, priority: priority });
        this.sort();
    }
    dequeue() {
        return this._nodes.shift().key;
    }
    sort() {
        this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    }
    isEmpty() {
        return !this._nodes.length;
    }
}


module.exports = PriorityQueue;