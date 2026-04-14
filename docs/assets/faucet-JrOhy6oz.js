class FaucetRateLimitError extends Error {
}
async function faucetRequest({ host, path, body, headers, method }) {
  const endpoint = new URL(path, host).toString();
  const res = await fetch(endpoint, {
    method,
    body: body ? JSON.stringify(body) : void 0,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
  if (res.status === 429) {
    throw new FaucetRateLimitError(
      `Too many requests from this client have been sent to the faucet. Please retry later`
    );
  }
  try {
    const parsed = await res.json();
    if (parsed.error) {
      throw new Error(`Faucet returns error: ${parsed.error}`);
    }
    return parsed;
  } catch (e) {
    throw new Error(
      `Encountered error when parsing response from faucet, error: ${e}, status ${res.status}, response ${res}`
    );
  }
}
async function requestIotaFromFaucetV0(input) {
  return faucetRequest({
    host: input.host,
    path: "/gas",
    body: {
      FixedAmountRequest: {
        recipient: input.recipient
      }
    },
    headers: input.headers,
    method: "POST"
  });
}
async function requestIotaFromFaucetV1(input) {
  return faucetRequest({
    host: input.host,
    path: "/v1/gas",
    body: {
      FixedAmountRequest: {
        recipient: input.recipient
      }
    },
    headers: input.headers,
    method: "POST"
  });
}
async function getFaucetRequestStatus(input) {
  return faucetRequest({
    host: input.host,
    path: `/v1/status/${input.taskId}`,
    headers: input.headers,
    method: "GET"
  });
}
export {
  requestIotaFromFaucetV0 as a,
  getFaucetRequestStatus as g,
  requestIotaFromFaucetV1 as r
};
