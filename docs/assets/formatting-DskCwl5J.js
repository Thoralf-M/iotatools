function formatAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.error("Failed to copy", e);
  }
}
export {
  copyToClipboard as c,
  formatAddress as f
};
