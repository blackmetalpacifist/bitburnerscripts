/** @param {NS} ns */
export async function main(ns) {
	/*	lvl1 bestimmt zu hackenden server, oeffnet ports und startet lvl2 fuer jeden server mit genuegend ram:dauer
		lvl2 bestimmt, wie viel platz auf dem server vorhanden ist und startet entsprechend viele lvl3er:single
		lvl3 startet wgh scripts:single
	
		lvl1 2 versionen(ohne f und mit?)(wechselt automatisch zwischen beiden?)*/
	while (true) {
		var name = 'hacknet-server-'
		var n = ns.hacknet.maxNumNodes()
		var purser = ns.getPurchasedServers()
		var hacknetservers = []
		var server = ['home']
		var serverdata = []
		var scps = []
		var id = []
		var times = []
		var wt = []
		var gt = []
		var ht = []
		var wgt = []
		var ght = []
		var extra=[]
		for (var i = 0; i < n; i++) {
			hacknetservers[i] = name + i
		}
		var purser = ns.getPurchasedServers()
		for (var i = 0; i < server.length; i++) {
			var temp = ns.scan(server[i]);
			for (var j = 0; j < temp.length; j++) {
				if (server.includes(temp[j]) == false && hacknetservers.includes(temp[j]) == false && purser.includes(temp[j]) == false) {
					server.push(temp[j]);
				}
			}
		}
		server.shift()
		for (var i = 0; i < server.length; i++) {
			serverdata.push(ns.getServer(server[i]))
			//			serverdata[i].hackchance = ns.hackAnalyzeChance(serverdata[i].hostname)
		}
		for (var i = 0; i < purser.length; i++) {
			if (scps[i] != true) {
				ns.scp('lvl1f.js', purser[i])
				ns.scp('w.js', purser[i])
				ns.scp('g.js', purser[i])
				ns.scp('h.js', purser[i])
				scps[i] = true
			}
		}
		serverdata = serverdata.filter(serverdata => serverdata.requiredHackingSkill <= ns.getHackingLevel())
		serverdata = serverdata.filter(serverdata => serverdata.hasAdminRights == true)
		serverdata = serverdata.filter(serverdata => serverdata.moneyMax != 0)
		serverdata = serverdata.sort(function (a, b) { return b.moneyMax - a.moneyMax })
		var serv = serverdata
		for (var i = 0; i < serv.length; i++) {
			serv[i].moneyAvailable = 0
			serv[i].hackDifficulty = serv[i].minDifficulty
			serverdata[i].growthneed = ns.formulas.hacking.growThreads(serv[i], ns.getPlayer(), serv[i].moneyMax)
			serverdata[i].growthneed = Math.ceil(serverdata[i].growthneed)
			serverdata[i].neededram = ns.getScriptRam('lvl1f.js') + (ns.getScriptRam('g.js') * serverdata[i].growthneed)
			serv[i].moneyAvailable = serv[i].moneyMax
			serverdata[i].hackneed = (100 / ns.formulas.hacking.hackPercent(serv[i], ns.getPlayer()))
			serverdata[i].hackneed = Math.floor(serverdata[i].hackneed)
			serverdata[i].neededram = serverdata[i].neededram + (ns.getScriptRam('h.js') * serverdata[i].hackneed)
			serverdata[i].weakenneed = ((serverdata[i].growthneed * 0.002) + (serverdata[i].hackneed * 0.004)) / 0.005 + 100
			serverdata[i].weakenneed = Math.ceil(serverdata[i].weakenneed)
			serverdata[i].neededram = serverdata[i].neededram + (ns.getScriptRam('w.js') * serverdata[i].weakenneed)
			serverdata[i].cps=serverdata[i].moneyMax/ns.formulas.hacking.hackTime(serv[i],ns.getPlayer())
		}
		serverdata = serverdata.sort(function (a, b) { return b.cps - a.cps })
		for (var i = 0; i < purser.length; i++) {
			for (var j = 0; j < serverdata.length; j++) {
				if (serverdata[j].neededram <= ns.getServerMaxRam(purser[i])) {
					id[i] = j
					times[i] = ns.getServerMaxRam(purser[i]) / serverdata[j].neededram
					times[i] = Math.floor(times[i])
					extra[i]=(ns.getServerMaxRam(purser[i])-(times[i]*serverdata[j].neededram))/(ns.getScriptRam('w.js')*times[i])
					extra[i]=Math.floor(extra[i])
					wt[i] = ns.getWeakenTime(serverdata[j].hostname)
					gt[i] = ns.getGrowTime(serverdata[j].hostname)
					ht[i] = ns.getHackTime(serverdata[j].hostname)
					wgt[i] = wt[i] - gt[i] - 100
					ght[i] = gt[i] - ht[i] - 1
					break
				}
			}
		}
		for (var i = 0; i < purser.length; i++) {
			for (var j = 0; j < times[i]; j++) {
				ns.exec('lvl1f.js', purser[i], 1, serverdata[id[i]].hostname, j, wgt[i], ght[i], serverdata[id[i]].growthneed, serverdata[id[i]].hackneed, (serverdata[id[i]].weakenneed+extra[i]))
				await ns.sleep(101)
			}
		}
		var x=0
		for(var i=0;i<wt.length;i++){
			if(wt[i]>x){x=wt[i]}
		}
		await ns.sleep((x + 100))
	}
}
