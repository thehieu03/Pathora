declare module "react-apexcharts" {
  import { ComponentType } from "react";

  interface ApexOptions {
    [key: string]: any;
  }

  interface Props {
    options?: ApexOptions;
    series?: any[];
    type?:
      | "line"
      | "area"
      | "bar"
      | "pie"
      | "donut"
      | "radialBar"
      | "scatter"
      | "bubble"
      | "heatmap"
      | "candlestick"
      | "boxPlot"
      | "radar"
      | "polarArea"
      | "rangeBar"
      | "treemap";
    width?: string | number;
    height?: string | number;
    [key: string]: any;
  }

  const ReactApexChart: ComponentType<Props>;
  export default ReactApexChart;
}
