function ownershipMain() {
    if (network.mode === 'server') {
        let storage = context.getParkStorage();
        rideOwners = storage.get(PARK_STORAGE_KEY, {});
        storage.set(PARK_STORAGE_KEY, rideOwners);
        context.subscribe('action.query', (e) => {
            if (e.action !== 'ridecreate') {
                fixAction(e);
                if ('ride' in e.args && e.player >= 0) {
                    let player = getPlayer(e.player);
                    if (player == null) {
                        e.result = {
                            error: 1,
                            errorTitle: 'UNKNOWN USER',
                            errorMessage: `Could not find user with ID ${e.player}`
                        };
                    }
                    else if (rideOwners[<number>e.args['ride']] !== player.publicKeyHash && !isPlayerAdmin(player)) {
                        e.result = {
                            error: 1,
                            errorTitle: 'NOT OWNED',
                            errorMessage: 'That ride belongs to another player.'
                        }
                        network.sendMessage('{RED}ERROR: {WHITE}That ride/stall doesn\'t belong to you!', [e.player]);
                    }
                }
            }
        });

        context.subscribe('action.execute', (e) => {
            if (e.action === 'ridecreate' &&
                'ride' in e.result) {

                var setName = (name, num) => {
                    context.executeAction('ridesetname', {
                        ride: ride.id,
                        name: `${name} ${num}`
                    }, function (result) {
                        if (result.error === 1 && num < 50) {
                            setName(name, num + 1);
                        }
                    });
                }

                if (e.player >= 0 && e.player < network.numPlayers) {
                    var ride = getRide(<number>e.result['ride']);
                    var player = getPlayer(e.player);
                    rideOwners[ride.id] = player.publicKeyHash;

                    setName(`${player.name} ${ride.name.replace(/[0-9]/g, '').trim()}`, 1);
                }
            }
            else if (e.action === 'ridedemolish' && 'ride' in e.args && (!('modifyType' in e.args) || e.args['modifyType'] === 0)) {
                delete rideOwners[<number>e.args['ride']];
            }
        });
    }
    // @ts-ignore
    else if (typeof FFAPLUGINMSG === 'undefined') {
        // @ts-ignore
        FFAPLUGINMSG = true;
        console.log(
            '\n' +
            '    This server uses one or more plugins from the FFA plugin suite.\n' +
            '    https://github.com/CorySanin/Openrct2-ffa-plugin-suite\n' +
            '    Found a bug? Please create an issue on GitHub with reproducible steps. Please and thank you!' + 
            '\n');
    }
}