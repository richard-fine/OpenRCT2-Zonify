import { MapSelection, toMapRange } from "../helpers/mapSelection";
import { MapSelectionTool } from "../tools/mapSelectionTools";
import { debug } from "../helpers/logger";
import { isDevelopment } from "../helpers/environment";
const windowId = "zonify-window";
const btnAddZone = "zonify-add-btn";
const listZones = "zonify-zones-list"
const widgetLineHeight = 14;

type ToolMode = "add" |"off";

export class ZonifyWindow
{
    _tool = new MapSelectionTool("zonify","path_down")
    _toolMode: ToolMode ="off"

    constructor(){
        this._tool.onSelect = (selection):void=>onUseTool(selection,this._toolMode);
        this._tool.onCancel = ():void=>setTool(this,"off");
    }

    /**
     * Opens the window for the zone tool.
     */
    open():void{
        console.log("open")
      
        const window = ui.getWindow(windowId);
        if(window){
            debug("Zone path is shown");
            window.bringToFront();
        }else{
            let windowTitle = `Zoneify Park`;
            if(isDevelopment){
                windowTitle += "[DEBUG]";
            }
            const columns: ListViewColumn ={
                canSort:true,
                sortOrder:"ascending",
                header:"Zones",
                width:180,
                ratioWidth:4,
                minWidth: 100,
                maxWidth:200,
                headerTooltip:"List of zones"
            }
     
            ui.openWindow({
                classification:windowId,
                title: windowTitle,
                width:260,
                height:500,
                onClose:()=> deactivate(this._tool),
                widgets:[
                    <ButtonWidget>{
                        name:btnAddZone,
                        type:"button",
                        x:30,
                        y:37,
                        width:100,
                        height:30,
                        text:"Add zone",
                        onClick: () => toggle(this, "add"),
                        border:false,
                        isPressed:false,
                        isDisabled:false,
                        isVisible:true,
                        window:window,
                        tooltip:"Add a zone"
                    },
                   <ListViewDesc>{
                    showColumnHeaders:true,
                    columns:[columns],
                    items:createZoneListItems(),
                    isStriped:true,
                    onClick:(item)=>console.log("You clicked!" + item),
                    x:30,
                    y:100,
                    height:100,
                    width:200,
                    name:listZones,
                    type:"listview",
                   },
                   <ButtonWidget>{
                    name:btnAddZone,
                    type:"button",
                    x:30,
                    y:200,
                    width:100,
                    height:30,
                    text:"Delete all zones",
                    onClick: () => deleteZones(),
                    border:false,
                    isPressed:false,
                    isDisabled:false,
                    isVisible:true,
                    window:window,
                    tooltip:"Add a zone"
                },
            ]  
            })
        }
        // setTool(this,"add")
    }
    /**
     * Closes window 
     */
    close():void{
        deactivate(this._tool);
        ui.closeWindows(windowId)
    }
}
function deactivate(tool:MapSelectionTool):void{
    tool.deactivate();
}

function setTool(window:ZonifyWindow,mode:ToolMode):void{
    window._toolMode = mode;
    const instance = ui.getWindow(windowId);
    if(!instance){
        debug("No Window open?")
        return
    }
    const buttonAdd = instance.findWidget<ButtonWidget>(btnAddZone);
    buttonAdd.isPressed = (mode ==="add");
    debug(`Set tool mode set to ${mode}`);
    if (mode === "off")
        {
            window._tool.deactivate();
        }
        else
        {
            window._tool.activate();
        }
}



function onUseTool(selection:MapSelection,toolMode:ToolMode):void{
    const range = toMapRange(selection);
    if(range){
        switch(toolMode){
            case "add":
                {
                    console.log("Need to addzone!");
                    const storage = context.getParkStorage();
                    const zonesArray = storage.get<Zone[]>('zones');
                    if(zonesArray){
                        const zoneObj = {
                            owner: network.currentPlayer,
                            range
                        }
                        zonesArray.push(zoneObj);
                        storage.set<Zone[]>('zones',zonesArray)                        
                    }
                   
        
                    console.log(storage.get('zones'))
                    reloadList()
                    break;
                }
            default:
            {    
                console.log("This should never be hit");
            }
        }
    }
}

function toggle(window:ZonifyWindow,mode:ToolMode):void{
    setTool(window, (window._toolMode != mode) ? mode : "off");
}


function deleteZones(){
    console.log("Deleting all zones!")
    const storage = context.getParkStorage();
    storage.set('zones',[])
    reloadList()
   
}

function createZoneListItems():ListViewItem[]{
    const items: string[] = []
    const storage = context.getParkStorage();
    const zonesArray = storage.get<Zone[]>('zones');
    if(zonesArray){
        for (let i = 0; i < zonesArray.length; i++) {
            items.push(`Zone ${i+1}`)      
        }
        return items
    }
    return []

}

function reloadList():void{
    const zoneList = ui.getWindow(windowId).findWidget<ListViewWidget>(listZones)
    zoneList.items = createZoneListItems()
}