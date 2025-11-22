// Allow importing image files in TypeScript (png, jpg, jpeg, svg, gif)
declare module '*.png' {
	const value: string;
	export default value;
}
declare module '*.jpg' {
	const value: string;
	export default value;
}
declare module '*.jpeg' {
	const value: string;
	export default value;
}
declare module '*.svg' {
	const value: string;
	export default value;
}
declare module '*.gif' {
	const value: string;
	export default value;
}

export {};
