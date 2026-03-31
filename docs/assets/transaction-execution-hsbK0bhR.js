import { B as getClient, aY as get, aD as sharedTransactionExecution, aq as activeAddress, az as TransactionExecution, L as toBase64, aA as getActiveWallet, aB as requireMainnetTransactionConfirmation, aC as getSelectedChain } from "./index-IFv0428Q.js";
async function executeTransaction(transaction, options = {
  showEffects: true,
  showObjectChanges: true,
  showBalanceChanges: true
}) {
  const client = getClient();
  const executionMode = get(sharedTransactionExecution);
  const senderAddress = get(activeAddress);
  transaction.setSenderIfNotSet(senderAddress);
  const txSenderAddress = transaction.getData().sender ?? senderAddress;
  switch (executionMode) {
    case TransactionExecution.DevInspect:
      return client.devInspectTransactionBlock({
        sender: txSenderAddress,
        transactionBlock: transaction
      });
    case TransactionExecution.DryRun:
      let transactionBlock = await transaction.build({ client });
      return client.dryRunTransactionBlock({ transactionBlock });
    case TransactionExecution.Send:
      const wallet = getActiveWallet();
      if (!wallet) {
        throw new Error("No active wallet available");
      }
      await requireMainnetTransactionConfirmation(transaction);
      return wallet.signAndExecuteTransaction({
        transaction,
        options,
        // @ts-ignore
        chain: getSelectedChain(),
        account: { address: txSenderAddress }
      });
    case TransactionExecution.Prepare:
      let json = JSON.parse(await transaction.toJSON());
      if (transaction.getData().gasData.price == 0) {
        let referenceGasPrice = await client.getReferenceGasPrice();
        transaction.setGasPrice(referenceGasPrice);
      }
      if (transaction.getData().gasData.budget == 0) {
        let gas = await calculateGasFee(transaction);
        transaction.setGasBudget(BigInt(gas));
      }
      let transactionBytes = toBase64(await transaction.build({ client }));
      return { json, transactionBytes };
    default:
      throw new Error(`Unknown transaction execution mode: ${executionMode}`);
  }
}
const calculateGasFee = async (transaction) => {
  const client = getClient();
  const txBytes = await transaction.build({ client });
  const txDryRun = await client.dryRunTransactionBlock({
    transactionBlock: txBytes
  });
  const gasSummary = getGasSummary(txDryRun);
  return gasSummary?.totalGas ?? transaction.getData().gasData.budget;
};
function getGasSummary(transaction) {
  const { effects } = transaction;
  if (!effects) return null;
  const totalGas = getTotalGasUsed(effects);
  let sender = void 0;
  let owner = "";
  let gasData = {};
  if ("transaction" in transaction && transaction.transaction?.data) {
    sender = transaction.transaction?.data.sender;
    gasData = transaction.transaction.data.gasData;
  } else if ("input" in transaction) {
    sender = transaction.input.sender;
    gasData = transaction.input.gasData;
  }
  owner = gasData?.owner ?? "";
  return {
    ...effects.gasUsed,
    ...gasData,
    owner,
    totalGas: totalGas?.toString(),
    isSponsored: !!owner && !!sender && owner !== sender,
    gasUsed: transaction?.effects.gasUsed
  };
}
function getTotalGasUsed(effects) {
  const gasSummary = effects?.gasUsed;
  return gasSummary ? BigInt(gasSummary.computationCost) + BigInt(gasSummary.storageCost) - BigInt(gasSummary.storageRebate) : void 0;
}
export {
  calculateGasFee as c,
  executeTransaction as e
};
