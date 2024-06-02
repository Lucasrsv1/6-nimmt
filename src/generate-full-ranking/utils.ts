import { IChildWorker } from "./models/child-worker";

export function sleep (ms: number) {
	return new Promise(res => setTimeout(res, ms));
}

/**
 * Handle the main process exit and kill all child processes.
 * @param childProcesses Array of child processes (workers)
 */
export function handleProcessExit (childProcesses: IChildWorker[]) {
	const terminationSignals = [
		"SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT",
		"SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"
	];

	// Registers application termination handling events to kill all child processes
	for (const sig of terminationSignals) {
		process.on(sig, async () => {
			console.log("Killing the children.");
			for (const { child } of childProcesses)
				child.kill(9);

			childProcesses.splice(0);
			process.exit(1);
		});
	}
}
