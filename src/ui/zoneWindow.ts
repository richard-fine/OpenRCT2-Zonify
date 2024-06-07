import { isDevelopment } from "../helpers/environment";
import { getPlayers, getZones, setZones } from "../helpers/common";
import { debug } from "../helpers/logger";

const labelZone = "label-zone"
const labelOwnerName = "label-owner-name"
const dropdownPlayers = "dropdown-players"
const storage = context.getParkStorage();
const widgetMargins = 37
export class ZoneWindow {
    zoneIndex: number;
    windowId: string;
    _zone: Zone | undefined
    

    constructor(zoneIndex:number){
        this.zoneIndex = zoneIndex
        this.windowId = `zone-window-${zoneIndex}`
        this._zone = getZones()[zoneIndex]
        
    }

    /**
     * Open Zone window
     */
    open():void{
        console.log("Opening Zone window");
        const window = ui.getWindow(this.windowId);
        if(window){
            debug("Window is already open for "+this.windowId);
        }else{
            let windowTitle = "Zone properties";
            if(isDevelopment){
                windowTitle += ["[DEBUG]"];
            }
            ui.openWindow({
                classification:this.windowId,
                title: windowTitle,
                width:260,
                height:300,
                onClose:()=>console.log("Close"),
                widgets:[
                    <LabelDesc>{
                        type:"label",
                        x:30,
                        y:widgetMargins,
                        width:200,
                        height:20,
                        name:labelZone,
                        text:"Zone information",
                        textAlign:"centred"
                    },
                    <LabelDesc>{
                        type:"label",
                        x:30,
                        y:widgetMargins * 2,
                        width:200,
                        height:20,
                        name:labelOwnerName,
                        text:`Owner: ${this._zone?.owner.name}`,
                        textAlign:"left"
                    },
                    <LabelDesc>{
                        type:"label",
                        x:30,
                        y:widgetMargins * 4.5,
                        width:200,
                        height:20,
                        name:labelOwnerName,
                        text:`Change Owner`,
                        textAlign:"left"
                    },
                    <DropdownDesc>{
                        name:dropdownPlayers,
                        x:30,
                        y:widgetMargins*5,
                        width:200,
                        height:20,
                        type:"dropdown",
                        items:createListFromPlayers(getPlayers()),
                        onChange:(index)=>{changeOwner(index,this.zoneIndex,this.windowId)}
                    }
                  
                ]
            })
        }
    }

}
function createListFromPlayers(players:Player[]):string[]{
    const arrayOfNames :string[] = []
    players.forEach((player)=>{
        arrayOfNames.push(player.name)
    })
    return arrayOfNames
}

function changeOwner(index:number,zoneIndex:number,windowId:string):void{
    debug("Changing owner!");
    const newOwner = getPlayers()[index]
    let zones = getZones()
    const editedZone = zones[zoneIndex];
    editedZone.owner = newOwner;
    zones = zones.map(zone=>zone.range !== editedZone.range ? zone : editedZone);
    setZones(zones)
    const window = ui.getWindow(windowId)
    const label = window.findWidget<LabelWidget>(labelOwnerName)
    label.text = editedZone.owner.name

}

