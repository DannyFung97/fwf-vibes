import { Metadata } from "next";

const HOST = process.env["HOST"] ?? "https://floor-sweep-frame.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const postUrl = `${HOST}/api/vibes`;

  const imageUrl = `${process.env["HOST"]}/api/images/vibes`;

  return {
    title: "Vibes",
    description: "A frame for trading Vibes",
    openGraph: {
      title: "Vibes",
      images: [imageUrl],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl,
      "fc:frame:post_url": postUrl,
      "fc:frame:input:text": "Type amount to buy or sell...",
      "fc:frame:button:1": "Continue",
    },
  };
}
