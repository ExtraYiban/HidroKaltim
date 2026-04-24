"use client";

import dynamic from "next/dynamic";
import type { ApexAxisChartSeries, ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ApexChartProps = {
  type: "line" | "area" | "bar";
  options: ApexOptions;
  series: ApexAxisChartSeries;
  height: number;
  width?: string | number;
};

export function ApexChart({ type, options, series, height, width = "100%" }: ApexChartProps) {
  return <ReactApexChart type={type} options={options} series={series} height={height} width={width} />;
}
