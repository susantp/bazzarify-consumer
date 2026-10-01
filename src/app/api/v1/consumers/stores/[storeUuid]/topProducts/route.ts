import { NextRequest } from "next/server";
import { ProductSearchPayloadSchema } from "@/modules/product/schemas/responsePayloads/ProductSearchPayloadSchema";
import { proxyStorefront } from "@/modules/storefront/server/proxyStorefront";

interface RouteContext {
  params: Promise<{ storeUuid: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { storeUuid } = await params;
  return proxyStorefront(
    request,
    `/stores/${encodeURIComponent(storeUuid)}/topProducts`,
    ProductSearchPayloadSchema,
  );
}
