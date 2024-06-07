/**
 * Returns fake player array when not in a network game for debugging/testing OR returns network.players 
 * @returns Players
 */
export function getPlayers(): Player[]{
    const fakePlayers:
    Player[] = [{
        id: 0,
        name:"brinkofhumor",
        group:0,
        ping:100,
        commandsRan:0,
        moneySpent:0,
        ipAddress:'',
        publicKeyHash:'',
    },{
        id: 1,
        name:"Fake Person",
        group:0,
        ping:100,
        commandsRan:0,
        moneySpent:0,
        ipAddress:'',
        publicKeyHash:'',
    }]
   return network.mode === "none" ?  (fakePlayers) : network.players 
}

/**
 * Returns zones in storage
 * @returns Zones
 */
export function getZones():Zone[]{
    const storage = context.getParkStorage();
    return storage.get<Zone[]>('zones') || []
}

/**
 * Adds zones to storage
 * This rewrites the entire 'zones' entry
 * @param zones 
 */
export function setZones(zones:Zone[]):void{
    context.getParkStorage().set('zones',zones)
}