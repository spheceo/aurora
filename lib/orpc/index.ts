import { router } from "@/lib/orpc/router";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { RouterClient } from "@orpc/server";
import { env } from "../env/web";

const rpcLink = new RPCLink({
  url: `${env.NEXT_PUBLIC_BASE_URL}/rpc`,
});

export const api: RouterClient<typeof router> = createORPCClient(rpcLink);