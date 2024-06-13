import { getZones,setZones } from "./common"

export interface ZoneArgs {
    playerId: number,
    x:number,
    y:number
}

export interface GameActionZoneArgs extends GameActionEventArgs {
    args:ZoneArgs
}
export const ACTION_ZONE = 'zonify'
/**
 * Query function for zones
 * @param args
*/
	
export function zoneActionQuery(args:GameActionZoneArgs):GameActionResult{
    // Whats the difference between the query/execute?
    let player:Player
    console.log("Zone executing")

    if(args.args.playerId != -1){
        player = network.getPlayer(args.args.playerId);
    }else{
        console.log("user is a host")
        player = network.currentPlayer
    }
    const eventX = args.args.x;
    const eventY = args.args.y;
    const zones = getZones();
    let result:GameActionResult = {
        cost: 0,
    }
    
	if(zones){
        for (let i = 0; i < zones.length;) {
            const zone = zones[i];
            if(
				(eventX >= zone.range.leftTop.x && eventX <= zone.range.rightBottom.x) &&
				(eventY >= zone.range.leftTop.y && eventY <= zone.range.rightBottom.y)&&
				player.id != zone.ownerId
			){
				console.log("False Query!")
                result = {
                    error:1,
                    errorTitle:"You can't build here",
                    errorMessage:"The admin has set zones using zonify plugin"
                }
                
			}
            i++
        }

	}
    return result

	}

export function zoneActionExecute(actionZoneArgs:GameActionZoneArgs):GameActionResult{
    let player:Player
    console.log("Zone executing")

    if(actionZoneArgs.args.playerId != -1){
        player = network.getPlayer(actionZoneArgs.args.playerId);
    }else{
        console.log("user is a host")
        player = network.currentPlayer
    }
    const eventX = actionZoneArgs.args.x;
    const eventY = actionZoneArgs.args.y;
    const zones = getZones();
    let result:GameActionResult = {
        cost: 0,
    }
    
	if(zones){
        for (let i = 0; i < zones.length;) {
            const zone = zones[i];
            if(
				(eventX >= zone.range.leftTop.x && eventX <= zone.range.rightBottom.x) &&
				(eventY >= zone.range.leftTop.y && eventY <= zone.range.rightBottom.y)&&
				player.id != zone.ownerId
			){
				console.log("False")
                result = {
                    error:1,
                    errorTitle:"You can't build here",
                    errorMessage:"The admin has set zones using zonify plugin"
                }
                
			}
            i++
        }

	}
    
    return result

	}



function addZone(zone:Zone){
    const zones = getZones();
    zones.push(zone);
    setZones(zones);      
}

export function setZoneArgs(playerId:number,x:number,y:number,){
    return{playerId,x,y}
}