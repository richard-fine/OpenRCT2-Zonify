import { debug } from "./helpers/logger";
import { isUiAvailable } from "./helpers/environment";
import { ZonifyWindow } from "./ui/window";

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

	if (!isUiAvailable || network.mode != "none")
	{
		return;
	}


	ui.registerMenuItem("Zonify", () => zoneWindow.open());
	context.subscribe('action.location',(e)=>{
		let buildResult = true;
		const zones = context.getParkStorage().get<Zone[]>('zones');
		if(zones){
			zones.forEach((zone)=>{
			
			
				if(
					(e.x >= zone.range.leftTop.x && e.x <= zone.range.rightBottom.x) &&
					(e.y >= zone.range.leftTop.y && e.y <= zone.range.rightBottom.y)&&
					network.currentPlayer.id != zone.owner.id
				){
					buildResult =false
				}
			})
		}

		e.result = buildResult
	
		
	})
}

