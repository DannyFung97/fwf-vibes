import { ImageResponse } from "next/og";
import Card from "@/app/components/Card";
import { NextRequest } from "next/server";
import { formatEther } from "viem";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  {
    params: { mintCost, burnProceeds, amount },
  }: { params: { mintCost: string; burnProceeds: string; amount: string } }
) {
  return new ImageResponse(
    (
      <Card>
        <div
          style={{
            color: "white",
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            width: "100%",
            height: "100vh",
          }}
        >
          <img
            src={"https://www.unlonely.app/icons/icon-192x192.png"}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 36,
                padding: 20,
                position: "absolute",
              }}
            >
              <div style={{ display: "flex", color: "#ffffff" }}>
                Entered $VIBES: {amount}
              </div>
              <div style={{ display: "flex", color: "#bababa" }}>
                what would you like to do?
              </div>
              <div style={{ display: "flex" }}>
                Buy Price for {amount}: {formatEther(BigInt(mintCost))} ETH
              </div>
              <div style={{ display: "flex" }}>
                Sell Price for {amount}: {formatEther(BigInt(burnProceeds))} ETH
              </div>
            </div>
          </img>
        </div>
      </Card>
    ),
    {
      width: 800,
      height: 420,
    }
  );
}
