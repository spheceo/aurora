import { router } from "@/lib/orpc/router";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { RouterClient } from "@orpc/server";

const rpcLink = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("This client is not available on the server side.");
    }
    return `${window.location.origin}/rpc`;
  },
});

export const api: RouterClient<typeof router> = createORPCClient(rpcLink);