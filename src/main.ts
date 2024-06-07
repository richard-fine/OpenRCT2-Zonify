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
		storage.set<MapRange[]>("zones",[])
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
		const zones = context.getParkStorage().get<MapRange[]>('zones');
		if(zones){
			zones.forEach((zone)=>{
			
			
				if(
					(e.x >= zone.leftTop.x && e.x <= zone.rightBottom.x) &&
					(e.y >= zone.leftTop.y && e.y <= zone.rightBottom.y)
				){
					console.log(e)
					console.log("No build!");
					buildResult =false
				}
			})
		}

		e.result = buildResult
	
		
	})
}

