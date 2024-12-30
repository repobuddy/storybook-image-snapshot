type Task = {
	name: string
	suite?: Task | undefined
}

export function toTaskId(task: Task) {
	const l: any[] = []
	let t = task
	while (t?.suite) {
		l.unshift(t.suite.name.replace(/[^a-z0-9]/gi, '-').toLowerCase())
		t = t.suite
	}

	l.push(task.name.replace(/[^a-z0-9]/gi, '-').toLowerCase())
	return l.join('/')
}
