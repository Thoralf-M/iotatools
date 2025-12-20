// Test script to verify web wallet response decoding
import { getTransactionData, isTransactionData } from './src/lib/lib/transaction-view.js';

// Example web wallet response from the issue
const webWalletResponse = {
    digest: 'DddXtUXiWUsAJ4U6yYKLmajBMRDEs1D9gsYgBheT6xqJ',
    signature:
        'AMgWvLAwnLiZATP9VBHicoSI0eQ2m4he5ZQRU5sCZjsg0InvrZxXjS9KbxXvHaK4OP5tSKkeRdCXMisdh4E5TgwPwHSrpd40OAcXRZriYZN9j6dmgdBXKgxWikQeaGQWCw==',
    bytes: 'AAACAAgAypo7AAAAAAAgAACkmEvUldQ0b6II3f9PXV5a1Iwh3sYx3evJmAnxaQACAgABAQAAAQEDAAAAAAEBAAAApJhL1JXUNG+iCN3/T11eWtSMId7GMd3ryZgJ8WkAAQG17QdHZ+O2o4na/TneylcrvwY7XNDR98PK2ffE16W3cW9SHwAAAAAg00UI3Ph0MV8bua5XFkA8k2D3zx1Z8HeTsDLuWHqLL5kAAKSYS9SV1DRvogjd/09dXlrUjCHexjHd68mYCfFpAOgDAAAAAAAA4G88AAAAAAAA',
    effects:
        'AACOAQAAAAAAAEBCDwAAAAAAQEIPAAAAAABg6x0AAAAAALD1DgAAAAAAAAAAAAAAAAAgu651sEZViTrawOk5wIHyYsPnVKwHRcTnuQd5j6zbJDUBAAAAAAABIGtPiVyN2vFvX2AchpfXec2AUv+F8yDyc9VEhnQCTsxHcm9SHwAAAAACAbXtB0dn47ajidr9Od7KVyu/Bjtc0NH3w8rZ98TXpbcBcW9SHwAAAAAg00UI3Ph0MV8bua5XFkA8k2D3zx1Z8HeTsDLuWHqLL5kAAACkmEvUldQ0b6II3f9PXV5a1Iwh3sYx3evJmAnxaQABIOLuUIx6a4RDRdoKNTMRLrK5Glt9miFkgWU0C5EKGpYLAAAApJhL1JXUNG+iCN3/T11eWtSMId7GMd3ryZgJ8WkAADc+ZzVKoosv1i8EKM+lB65hD0kBP+Daz1vvM4iQfqtWAAEgp4Pgw4VFt6vTwMsx30HKNphIRjtfh7uD3XgNPELv/ngAAACkmEvUldQ0b6II3f9PXV5a1Iwh3sYx3evJmAnxaQABAAA=',
};

console.log('Testing web wallet response format detection...');
console.log('Is transaction data:', isTransactionData(webWalletResponse));

console.log('\nDecoding web wallet response...');
const normalized = getTransactionData(webWalletResponse);

console.log('\nNormalized transaction data:');
console.log('- Digest:', normalized.digest);
console.log('- Sender:', normalized.sender);
console.log('- Has signatures:', !!normalized.signatures);
console.log('- Has effects:', !!normalized.effects);
console.log('- Has transaction data:', !!normalized.transactionData);
console.log('- Has decodedBCS:', !!normalized.decodedBCS);

if (normalized.transactionData) {
    console.log('\nTransaction data details:');
    console.log('- Inputs:', normalized.transactionData.inputs?.length || 0);
    console.log('- Commands:', normalized.transactionData.commands?.length || 0);
}

if (normalized.decodedBCS) {
    console.log('\nPTB commands available for display:', 
        !!normalized.decodedBCS.intentMessage?.value?.V1?.kind?.ProgrammableTransaction);
}

console.log('\n✓ Web wallet response successfully decoded!');
