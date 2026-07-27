"use client";

import dynamic from "next/dynamic";

const HeroBanner = dynamic(() => import("./HeroBanner"), {
  ssr: true,
  loading: () => <div style={{ height: "600px", background: "#000" }} />,
});

export default HeroBanner;
