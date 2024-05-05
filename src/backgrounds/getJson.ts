import type { RuntimeMessage } from "../background";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getJson = async (message: RuntimeMessage, sendResponse: (response: any) => void) => {
  const response = await fetch(message.url, {
    method: "GET",
    cache: "no-store",
  });
  const json = await response.json();
  sendResponse(json);
};
