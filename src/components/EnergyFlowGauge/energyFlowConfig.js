import { PiSolarPanelFill, PiBatteryHighBold } from "react-icons/pi";
import { GiWatchtower } from "react-icons/gi";
import { IoBulb } from "react-icons/io5";

export const ENERGY_NODES = {
  solar: {
    label: "Solar",
    color: "#F59E0B",
    Icon: PiSolarPanelFill,
    angle: [315, 405]
  },
  load: {
    label: "Load",
    color: "#0a3ead",
    Icon: IoBulb,
    angle: [45, 135]
  },
  battery: {
    label: "Battery",
    color: "#6B7280",
    Icon: PiBatteryHighBold,
    angle: [135, 225]
  },
  grid: {
    label: "Grid",
    color: "#2c5324",
    Icon: GiWatchtower,
    angle: [225, 315]
  }
};
