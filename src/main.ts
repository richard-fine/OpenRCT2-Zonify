import { debug } from "./helpers/logger";
import { isUiAvailable } from "./helpers/environment";
import { ZonifyWindow } from "./ui/window";
import { ACTION_ZONE, playerCanBuildHere, setZoneArgs } from "./helpers/zones";
import { initActions } from "./helpers/initActions";
// function onClickMenuItem()
// {
// 	// Write code here that should happen when the player clicks the menu item under the map icon.

// 	console.log("Hello world!");
// }

const zoneWindow = new ZonifyWindow()
/**
 * Entry point of the plugin.
 */
export function main(): void
{
	const networkMode = network.mode;
	switch(networkMode){
		case 'server':
			console.log("Zonify is running!")
			initActions()
	
			/**
			 * Makes sure that zones is initilized in storage
			 */
			const storage = context.getParkStorage();
			const zones = storage.has('zones');
			if(!zones){
				storage.set<Zone[]>("zones",[])
			}else{
				debug("Zones entry already exists")
			}
			debug("Plugin started.");
		
			if (!isUiAvailable )
			{
				return;
			}
			console.log("I'm a server!");
			ui.registerMenuItem("Zonify", () => zoneWindow.open());

			context.subscribe('action.query',(event)=>{
				if(!playerCanBuildHere(event)){
					event.result = {
						error:1,
						errorTitle:"You can't build here",
						errorMessage:"The admin has set zones using zonify plugin"
					}
					network.sendMessage('{RED}ERROR: {WHITE} You are not a owner of that zone!', [event.player]);

				}
			})
			break;
		case 'client':
			console.log("I'm a client");
			break;
		default:
			console.log("Offline!");
	}




}

