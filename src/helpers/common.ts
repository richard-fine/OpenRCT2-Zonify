/**
 * Returns fake player array when not in a network game for debugging/testing OR returns network.players 
 * @returns Players
 */
export function getPlayers(): Player[] {
    const fakePlayers:
        Player[] = [{
            id: 0,
            name: "brinkofhumor",
            group: 0,
            ping: 100,
            commandsRan: 0,
            moneySpent: 0,
            ipAddress: '',
            publicKeyHash: '',
        }, {
            id: 1,
            name: "Fake Person",
            group: 0,
            ping: 100,
            commandsRan: 0,
            moneySpent: 0,
            ipAddress: '',
            publicKeyHash: '',
        }]
    return network.mode === "none" ? (fakePlayers) : network.players
}

/**
 * Returns zones in storage
 * @returns Zones
 */
export function getZones(): Zone[] {
    const storage = context.getParkStorage();
    return storage.get<Zone[]>('zones') || []
}

/**
 * Adds zones to storage
 * This rewrites the entire 'zones' entry
 * @param zones 
 */
export function setZones(zones: Zone[]): void {
    context.getParkStorage().set('zones', zones)
}

export interface ZoneArgs {
    playerId: number,
    x: number,
    y: number
}

export function setZoneArgs(playerId: number, x: number, y: number,) {
    return { playerId, x, y }
}

export function playerCanBuildHere(event: GameActionEventArgs) {
    console.log(event)

    if (event.result.position) {
        let player: Player
        console.log("Zone executing")

        // Make sure that the player id is not -1

        player = network.getPlayer(event.player)
        if (player == null) {
            return false
        }
        const eventX = event.result.position.x;
        const eventY = event.result.position.y;

        const zones = getZones();
        // If zones exist, loop through them and see if player.id matches zone.ownerId
        if (zones) {
            for (let i = 0; i < zones.length;) {
                const zone = zones[i];
                if (
                    (eventX >= zone.range.leftTop.x && eventX <= zone.range.rightBottom.x) &&
                    (eventY >= zone.range.leftTop.y && eventY <= zone.range.rightBottom.y) &&
                    player.id != zone.ownerId
                ) {
                    console.log("False")
                    return false
                }
                i++
            }

        }
    }

    return true
}