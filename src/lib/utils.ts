export function newUrl(input: string) {
	try {
		return new URL(input)
	} catch (error) {
		return false
	}
}
