/** @param {NS} ns */
export async function main(ns) {
	await ns.hack(ns.args[0])
	ns.tprint('__________')
}