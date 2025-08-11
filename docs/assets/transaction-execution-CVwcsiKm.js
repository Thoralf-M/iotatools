import { n as getClient, aG as get, aH as sharedTransactionExecution, a1 as activeAddress, a3 as iota_wallets, aI as TransactionExecution, M as toB64 } from "/iota-utils/assets/index-BnYhK8oQ.js";
async function executeTransaction(transaction, options = {
  showEffects: true,
  showObjectChanges: true,
  showBalanceChanges: true
}) {
  const client = getClient();
  const executionMode = get(sharedTransactionExecution);
  const senderAddress = get(activeAddress);
  const wallet = get(iota_wallets);
  transaction.setSenderIfNotSet(senderAddress);
  switch (executionMode) {
    case TransactionExecution.DevInspect:
      return client.devInspectTransactionBlock({
        sender: senderAddress,
        transactionBlock: transaction
      });
    case TransactionExecution.DryRun:
      let transactionBlock = await transaction.build({ client });
      return client.dryRunTransactionBlock({ transactionBlock });
    case TransactionExecution.Send:
      return wallet[0].signAndExecuteTransaction({
        transaction,
        options,
        account: { address: senderAddress }
      });
    case TransactionExecution.Prepare:
      let json = JSON.parse(await transaction.toJSON());
      let transactionBytes = toB64(await transaction.build({ client }));
      return { json, transactionBytes };
    default:
      throw new Error(`Unknown transaction execution mode: ${executionMode}`);
  }
}
export {
  executeTransaction as e
};
