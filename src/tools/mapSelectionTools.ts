import { debug } from "../helpers/logger"
import { MapSelection, toMapRange } from "../helpers/mapSelection"

/**
 * Tool that can select an area
 */
export class MapSelectionTool {

    /**
     * Event that triggers when an area is selected
     */
    onSelect?: (selection: MapSelection) => void;

    /**
     * Event that triggers when the tool is cancelled via 'esc' key or when another tool is activated
     */
    onCancel?: () => void;

    _isDragging = false;
    _selection: (MapSelection | null) = null;

    /**
     * Tool that allows selecting an area.
     * @param name the name of the tool, used as the identifier.
     * @param cursor The Cursor to use for the selection
     */
    constructor(readonly name: string, readonly cursor: CursorType) { }

    /**
     * Sets this as the currently activated tool
     */
    activate(): void {
        const tool = ui.tool;
        if (tool && tool.id === this.name) {
            debug('Tool is activated already');
            return
        }
        toggleGridOverlay(true)
        ui.activateTool({
            id: this.name,
            cursor: this.cursor,
            onDown: (a) => down(this, a),
            onUp: (a) => up(this, a),
            onMove: (a) => move(this, a),
            onFinish: () => finish(this.onCancel)
        })
        debug('Tool activated')
    }
    deactivate(): void {
        const tool = ui.tool;
        if (tool && tool.id === this.name) {
            tool.cancel();
            debug(`Tool: deactivated.`);
        }
        else {
            debug(`Tool: already deactivated.`);
        }
    }

}

function move(tool: MapSelectionTool, args: ToolEventArgs): void {
    if (!tool._isDragging || !tool._selection) {
        return;
    }

    const location = args.mapCoords;
    if (!location) {
        return;
    }

    tool._selection.end = location;
    const range = toMapRange(tool._selection);

    if (range) {
        ui.tileSelection.range = range;
    }
}
// The flag for gridlines on the map.
const viewportFlagGridlines = (1 << 7);
/**
 * Toogles the map grid overlay on or off.
 * @param value True for on, false for off.
 */
function toggleGridOverlay(value: boolean): void {
    if (value) {
        ui.mainViewport.visibilityFlags |= viewportFlagGridlines;
    }
    else {
        ui.mainViewport.visibilityFlags &= ~(viewportFlagGridlines);
    }
}

function finish(callback?: () => void): void {
    toggleGridOverlay(false);
    if (callback) {
        callback();
    }
}
/**
 * Starts selecting when user presses down
 * @param tool 
 * @param args 
 * @returns 
 */
function down(tool: MapSelectionTool, args: ToolEventArgs): void {
    const location = args.mapCoords;
    if (!location) {
        debug("Tool: Down at unknown location");
        return;
    }
    debug(`Tool: down at ${JSON.stringify(location)}`);
    tool._isDragging = true;
    tool._selection = { start: location };
}

function up(tool: MapSelectionTool, args: ToolEventArgs): void {
    const location = args.mapCoords;
    if (!location) {
        debug(`Tool: Up at unknown location`);
        return
    }
    debug(`Tool: up at ${JSON.stringify(location)}`);
    if (tool._selection && tool.onSelect) {
        tool.onSelect(tool._selection);
    }
    tool._selection = null;
    ui.tileSelection.range = null;
}

