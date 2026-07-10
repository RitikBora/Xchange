import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

async function loadInterBold() {
  const css = await (
    await fetch("https://fonts.googleapis.com/css2?family=Inter:wght@800")
  ).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype|woff)'\)/);
  if (!match) throw new Error("failed to resolve font url");
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

export default async function Icon() {
  const fontData = await loadInterBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 27,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#16A34A",
            fontFamily: "Inter",
          }}
        >
          X
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: fontData, weight: 800, style: "normal" }],
    }
  );
}
