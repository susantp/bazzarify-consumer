import { describe, expect, it } from "bun:test";
import { ProductSchema } from "@/modules/product/schemas/ProductSchema";

describe("product content fields", () => {
  it("accepts the string values emitted by the backend product detail route", () => {
    expect(ProductSchema.shape.description.parse("Product description")).toBe(
      "Product description",
    );
    expect(ProductSchema.shape.highlights.parse("Product highlights")).toBe(
      "Product highlights",
    );
  });

  it("continues to accept object-shaped JSON content", () => {
    expect(
      ProductSchema.shape.description.parse({ summary: "Product" }),
    ).toEqual({ summary: "Product" });
    expect(ProductSchema.shape.highlights.parse({ points: ["One"] })).toEqual({
      points: ["One"],
    });
  });
});
