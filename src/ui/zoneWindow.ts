import { isDevelopment } from "../helpers/environment";
import { debug } from "../helpers/logger";

const labelZone = "label-zone"
const labelOwnerId = "label-owner-id"
const labelOwnerName = "label-owner-name"
const dropdownPlayers = "dropdown-players"
const storage = context.getParkStorage();
const zonesArray = storage.get<Zone[]>('zones') || []
const widgetMargins = 37
export class ZoneWindow {
    id: Number;
    windowId: string;
    _zone: Zone | undefined
    

    constructor(id:number){
        this.id = id
        this.windowId = `zone-window-${id}`
        this._zone = zonesArray[id] 
        
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
            console.log(network)
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
                        width:100,
                        height:20,
                        name:labelZone,
                        text:"Zone information",
                        textAlign:"centred"
                    },
                    <LabelDesc>{
                        type:"label",
                        x:30,
                        y:widgetMargins * 2,
                        width:100,
                        height:20,
                        name:labelOwnerId,
                        text:`Owner id: ${this._zone?.owner.id}`,
                        textAlign:"left"
                    },
                    <LabelDesc>{
                        type:"label",
                        x:30,
                        y:widgetMargins * 3,
                        width:100,
                        height:20,
                        name:labelOwnerName,
                        text:`Owner name: ${this._zone?.owner.name}`,
                        textAlign:"left"
                    },
                    <LabelDesc>{
                        type:"label",
                        x:30,
                        y:widgetMargins * 4.5,
                        width:100,
                        height:20,
                        name:labelOwnerName,
                        text:`Change Owner`,
                        textAlign:"left"
                    },
                    <DropdownDesc>{
                        x:30,
                        y:widgetMargins*5,
                        width:100,
                        height:20,
                        type:"dropdown",
                        items:["Player 1","Player 2"],
                        onChange:(index)=>{console.log(index)}
                    }
                  
                ]
            })
        }
    }

}