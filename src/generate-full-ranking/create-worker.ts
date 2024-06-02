import { fork } from "child_process";
import { resolve } from "path";

import { IChildWorker } from "./models/child-worker";
import { IFinishMessageFromWorker, MessagesHandler, WorkerMessage } from "./models/worker-messages";

const workerPath = resolve(__dirname, "worker");

/**
 * Creates new workers and adds them to the array of child processes.
 * @param childProcesses Array of child processes (workers)
 * @param messagesHandler Callback to handle messages received from workers
 * @param qty Amount of workers to spawn
 */
export function createWorker (childProcesses: IChildWorker[], messagesHandler: MessagesHandler, qty: number = 1): void {
	for (let id = 0; id < qty; id++) {
		console.log("Spawning worker", id);

		const childEnv = process.env;
		childEnv.CHILD_ID = id.toString();

		const child = fork(workerPath, {
			cwd: __dirname,
			detached: false,
			env: childEnv
		});

		child.on("message", (message: WorkerMessage) => {
			messagesHandler(child, message);
		});

		child.on("exit", code => {
			console.error("Worker exited! Code:", code);

			try {
				const childIdx = childProcesses.findIndex(c => c.child === child);
				if (childIdx === -1)
					return;

				if (code !== 0) {
					const errorMessage: IFinishMessageFromWorker = {
						finished: true,
						failure: true
					};

					messagesHandler(child, errorMessage);
				}

				childProcesses.splice(childIdx, 1);
			} catch (error) {
				console.error("Error managing workers:", error);
			}
		});

		childProcesses.push({ child, id, isDone: false, isReady: false });
	}
}
