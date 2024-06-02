import { ChildProcess, Serializable } from "child_process";

import { IStats } from "./stats";

export interface IMessageToWorker {
	possibilities: number[][];
	gamesToPlay: number;
	logging: boolean;
}

export interface IStartMessageFromWorker {
	started: boolean;
}

export interface IFinishMessageFromWorker {
	finished: boolean;
	failure: boolean;
	results?: {
		totalPoints: number;
		stats: Record<string, IStats>;
	}
}

export type WorkerMessage = Serializable | IStartMessageFromWorker | IFinishMessageFromWorker;

export type MessagesHandler = (child: ChildProcess, message: WorkerMessage) => void;
