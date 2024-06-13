import { zoneActionExecute, zoneActionQuery,ACTION_ZONE,ZoneArgs } from "./zones"



export function initActions():void{
    context.registerAction<ZoneArgs>(ACTION_ZONE,(args)=>zoneActionQuery(args),(args)=>zoneActionExecute(args))
}
