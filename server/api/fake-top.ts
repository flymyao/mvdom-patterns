
// STILL BEING IMPLEMENTED.

interface MemStat {
	total: number,
	used: number
}

interface CpuStat {
	user: number,
	sys: number
}

interface Process {
	name: string,
	cpu: number,
	mem: number
}

export function memStat() {
	return {
		total: 16000000,
		used: 12000000
	}
}

export function CpuStat() {
	return {
		user: 4.6,
		sys: 2.3
	}
}

export function processes(): Process[] {
	return [];
}


const processes_names = ['node', 'agetty', 'ata_sff', 'atd', 'auditd', 'bash', 'bioset', 'crond', 'crypto', 'dbus-daemon', 'deferwq', 'dhclient', 'ext4-rsv-conver', 'fsnotify_mark', 'init', 'ipv6_addrconf',
	'jbd2/xvda1-8', 'jbd2/xvdb-8', 'kauditd', 'kblockd', 'kdevtmpfs', 'khelper', 'khugepaged', 'khungtaskd', 'kintegrityd', 'kpsmoused', 'ksmd', 'ksoftirqd/0', 'kswapd0', 'kthreadd', 'kthrotld', 'kworker/u30:2', 'md', 'migration/0', 'mingetty', 'netns', 'node', 'npm', 'npm', 'ntpd', 'perf',
	'postmaster', 'rcu_bh', 'rcu_sched', 'rngd', 'rpc.statd', 'rpcbind', 'rsyslogd', 'screen', 'screen', 'screen', 'scsi_eh_0', 'scsi_eh_1', 'scsi_tmf_0', 'scsi_tmf_1', 'ssh-agent', 'sshd', 'top', 'udevd', 'udevd', 'udevd', 'writeback', 'xenbus', 'xenwatch'];