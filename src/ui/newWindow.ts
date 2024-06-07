import { MapSelection, toMapRange } from "../helpers/mapSelection";
import { MapSelectionTool } from "../tools/mapSelectionTools";
import { debug } from "../helpers/logger";
import { isDevelopment } from "../helpers/environment";
import { window,button, groupbox, horizontal,label } from "openrct2-flexui";
const windowId = "zonify-window";
const btnAddZone = "zonify-add-btn";
const listViewZones = "zonify-list-zones";
const widgetLineHeight = 14;

type ToolMode = "add" |"off";

export class NewZonifyWindow
{
    _tool = new MapSelectionTool("zonify","path_down")
    _toolMode: ToolMode ="off"
    _zonesArray: MapRange[] = context.getParkStorage().get<MapRange[]>('zones') || []

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

           zoneWindow.open()
        }
        // setTool(this,"add")
    }
    /**
     * Closes window 
     */
    close():void{
        deactivate(this._tool);
        zoneWindow.close()
    }
}

const zoneWindow = window({
    title:"Zonify Park",
    height:200,
    width:{value:500,min:465,max:550},
    spacing:5,
    onOpen:()=>console.log("Should open"),
    onClose:()=>console.log("Should close"),
    content:[
        groupbox([
            horizontal([
                label({
                    text:"Zones!"
                }),
                button({
                    text:"Add a zone",
                    tooltip:"Should eventually add a zone",
                    width:50,
                    height:14,
                    onClick: () =>toggle(zoneWindow,"add")
                })
            ])
        ])
    ]
})


function deactivate(tool:MapSelectionTool):void{
    tool.deactivate();
}

function setTool(window:NewZonifyWindow,mode:ToolMode):void{
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
                    const zonesArray = storage.get<MapRange[]>('zones');
                    if(zonesArray){
                        zonesArray.push(range);
                        storage.set<MapRange[]>('zones',zonesArray)                        
                    }
                   
        
                    console.log(storage.get('zones'))
                    
                    break;
                }
            default:
            {    
                console.log("This should never be hit");
            }
        }
    }
}

function toggle(window:NewZonifyWindow,mode:ToolMode):void{
    setTool(window, (window._toolMode != mode) ? mode : "off");
}

function createColumnsFromRanges(ranges:MapRange[]):ListViewColumn[]{
    const columns:ListViewColumn[] = [];
    ranges.forEach((range,key)=>{
        const columnObj = {
            canSort:false,
            sortOrder:"none" as SortOrder,
            header:`Zone- ${key}`,
            headerTooltip:"",
            width:40,
            ratioWidth:1,
            minWidth:20,
            maxWidth:100,
        }
        columns.push(columnObj)
    })
  return columns
}
