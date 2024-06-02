import { ChildProcess } from "child_process";

export interface IChildWorker {
	child: ChildProcess;
	id: number;
	isDone: boolean;
	isReady: boolean;
}
