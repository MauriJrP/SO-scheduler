class Queue {
	constructor() {
		this.elements = {};
		this.head = 0;
		this.tail = 0;
	}
	enqueue(element) {
		this.elements[this.tail] = element;
		this.tail++;
	}
	dequeue() {
		const item = this.elements[this.head];
		delete this.elements[this.head];
		this.head++;
		return item;
	}
	peek() {
		return this.elements[this.head];
	}
	get length() {
		return this.tail - this.head;
	}
	get isEmpty() {
		return this.length === 0;
	}
}

//* First Come First Serve
const FCFS = async (queue) => {
	const process = queue.dequeue();
	await setTimeout(() => {
		postMessage({ process: process.process, time: process.time });
		if (!queue.isEmpty) {
			FCFS(queue);
		}
	}, process.time * 1000);
};

//* Round Robin
const RR = async (queue, quantum) => {
	const process = queue.dequeue();
	let time;
	if (process.time > quantum) {
		time = quantum;
		const newProcess = {
			...process,
			time: process.time - quantum,
		};
		queue.enqueue(newProcess);
	} else {
		time = process.time;
	}

	await setTimeout(() => {
		postMessage({ process: process.process, time });
		if (!queue.isEmpty) {
			RR(queue, quantum);
		}
	}, time * 1000);
};

onmessage = async (e) => {
	const queue = new Queue();

	e.data.processes.map((process) => {
		queue.enqueue(process);
	});

	if (e.data.algorithm === 'FCFS') FCFS(queue);
	else if (e.data.algorithm === 'RR') RR(queue, e.data.quantum);
};
