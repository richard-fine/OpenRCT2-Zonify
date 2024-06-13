import { isDevelopment } from "../helpers/environment";
import { getPlayers, getZones, setZones } from "../helpers/common";
import { debug } from "../helpers/logger";

const labelZone = "label-zone"
const labelOwnerName = "label-owner-name"
const dropdownPlayers = "dropdown-players"
const btnDeleteZone = "delete-zone"
const widgetMargins = 37
export class ZoneWindow {
    zoneIndex: number;
    windowId: string;
    _zone: Zone 
    

    constructor(zoneIndex:number){
        this.zoneIndex = zoneIndex
        this.windowId = `zone-window-${zoneIndex}`
        this._zone = getZones()[zoneIndex]        
    }
    

    /**
     * Open Zone window
     */
    open():void{
        const players = network.players;
        const player = network.getPlayer(this._zone?.ownerId)

        const selectedIndex = players.map(p=>p.id).indexOf(player.id)
        console.log(selectedIndex)
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
                        text:`Owner: ${player.name}`,
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
                        selectedIndex:selectedIndex,
                        items:createListFromPlayers(getPlayers()),
                        onChange:(index)=>{changeOwner(index,this.zoneIndex,this.windowId)}
                    },
                    <ButtonWidget>{
                        name:btnDeleteZone,
                        width:100,
                        height:30,
                        onClick:()=>{deleteZone(this._zone,this.windowId)},
                        x:30,
                        type:'button',
                        y:widgetMargins*6,
                        border:false,
                        window:window,
                        tooltip:"Delete Zone",
                        isDisabled: false,
                        isVisible:true,
                        toolTip:"Delete a zone",
                        isPressed:false,
                        text:'Delete Zone'
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
    editedZone.ownerId = newOwner.id;
    zones = zones.map(zone=>zone.range !== editedZone.range ? zone : editedZone);
    setZones(zones)
    const window = ui.getWindow(windowId)
    const label = window.findWidget<LabelWidget>(labelOwnerName)
    label.text = `Owner: ${newOwner.name}`

}

function deleteZone(deletedZone:Zone,windowId:string){
    const zones = getZones();
    const newZones = zones.filter((zone)=>{
        return zone !== deletedZone
    })
    setZones(newZones)
    ui.getWindow(windowId).close()

}
