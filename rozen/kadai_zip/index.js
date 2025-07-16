import { init } from "./phisyc.js";
import { rozen_init } from './rozen.js';

export function main(cmd){
	console.log("index main start");
	if(cmd == "plane"){
		console.log("initload");
		init();	
	}else if(cmd == "rozen"){
		console.log("rozen");	
		rozen_init();
	}
}

