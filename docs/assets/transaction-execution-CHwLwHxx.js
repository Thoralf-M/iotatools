import { n as getClient, aQ as get, ba as sharedTransactionExecution, ag as activeAddress, am as iota_wallets, bb as TransactionExecution, y as toBase64 } from "/iota-utils/assets/index-LSzG6O2x.js";
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
  return (gasSummary == null ? void 0 : gasSummary.totalGas) ?? transaction.getData().gasData.budget;
};
function getGasSummary(transaction) {
  var _a, _b;
  const { effects } = transaction;
  if (!effects) return null;
  const totalGas = getTotalGasUsed(effects);
  let sender = void 0;
  let owner = "";
  let gasData = {};
  if ("transaction" in transaction && ((_a = transaction.transaction) == null ? void 0 : _a.data)) {
    sender = (_b = transaction.transaction) == null ? void 0 : _b.data.sender;
    gasData = transaction.transaction.data.gasData;
  } else if ("input" in transaction) {
    sender = transaction.input.sender;
    gasData = transaction.input.gasData;
  }
  owner = (gasData == null ? void 0 : gasData.owner) ?? "";
  return {
    ...effects.gasUsed,
    ...gasData,
    owner,
    totalGas: totalGas == null ? void 0 : totalGas.toString(),
    isSponsored: !!owner && !!sender && owner !== sender,
    gasUsed: transaction == null ? void 0 : transaction.effects.gasUsed
  };
}
function getTotalGasUsed(effects) {
  const gasSummary = effects == null ? void 0 : effects.gasUsed;
  return gasSummary ? BigInt(gasSummary.computationCost) + BigInt(gasSummary.storageCost) - BigInt(gasSummary.storageRebate) : void 0;
}
export {
  calculateGasFee as c,
  executeTransaction as e
};
