import { debug } from "./helpers/logger";
import { isUiAvailable } from "./helpers/environment";
import { ZonifyWindow } from "./ui/window";
import { ACTION_ZONE, setZoneArgs } from "./helpers/zones";
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
				console.log(event)
				if (event.result.position){
					const playerId = event.player
					context.executeAction(ACTION_ZONE,setZoneArgs(playerId,event.result.position.x,event.result.position.y),(result)=>{
						if(result.error){
							console.log("Send message!")
							network.sendMessage('{RED}ERROR: {WHITE} You are not a owner of that zone!', [event.player]);

						}
						event.result = result
					})
				}
			})
			break;
		case 'client':
			console.log("I'm a client");
			initActions()
	
			break;
		default:
			console.log("Offline!");
	}




}

