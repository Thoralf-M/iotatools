/** Allow importing any file as a raw string via Vite's `?raw` suffix. */
declare module '*?raw' {
    const content: string;
    export default content;
}
