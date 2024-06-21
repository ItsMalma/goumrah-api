export function pascalCase(str: string): string {
	return str
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
}

export function camelCase(str: string): string {
	const pascal = pascalCase(str);
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function camelCaseFromPascal(str: string): string {
	return str.charAt(0).toLowerCase() + str.slice(1);
}
