/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0]
	var iadd = ns.args[1]
	var gt=ns.args[2]
	var ht=ns.args[3]
	var growthreads=ns.args[4]
	var hackthreads=ns.args[5]
	var weakenthreads=ns.args[6]
	ns.run('w.js', weakenthreads,target,iadd)
	await ns.sleep(gt)
	ns.run('g.js', growthreads,target,iadd)
	await ns.sleep(ht)
	ns.run('h.js', hackthreads,target,iadd)
}