const findShortestPath = (graph, start, end) => {
    const distances = {};
    const previous = {};
    const queue = new PriorityQueue(); // Using a priority queue for better performance

    for (let node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
        queue.enqueue(node, Infinity);
    }

    distances[start] = 0;
    queue.enqueue(start, 0);

    while (!queue.isEmpty()) {
        let minNode = queue.dequeue();
        if (minNode.value === end) {
            let path = [];
            while (previous[minNode.value]) {
                path.push(minNode.value);
                minNode.value = previous[minNode.value];
            }
            path.push(start);
            return path.reverse();
        }

        if (!graph[minNode.value]) continue;
        for (let neighbor in graph[minNode.value]) {
            let alt = distances[minNode.value] + graph[minNode.value][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = minNode.value;
                queue.enqueue(neighbor, alt);
            }
        }
    }

    return [];
};

class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(item, priority) {
        this.collection.push({ item, priority });
        this.sort();
    }

    dequeue() {
        return this.collection.shift();
    }

    sort() {
        this.collection.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
        return this.collection.length === 0;
    }
}

module.exports = findShortestPath;