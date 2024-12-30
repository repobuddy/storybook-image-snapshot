export function isBase64String(value: unknown): value is string {
	return typeof value === 'string' && /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(value)
}
