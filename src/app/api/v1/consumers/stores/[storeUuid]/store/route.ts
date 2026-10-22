import { NextRequest } from "next/server";
import { StorefrontStorePayloadSchema } from "@/modules/storefront/schemas/StorefrontStorePayloadSchema";
import { proxyStorefront } from "@/modules/storefront/server/proxyStorefront";

interface RouteContext {
  params: Promise<{ storeUuid: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { storeUuid } = await params;
  return proxyStorefront(
    request,
    `/stores/${encodeURIComponent(storeUuid)}/store`,
    StorefrontStorePayloadSchema,
  );
}
