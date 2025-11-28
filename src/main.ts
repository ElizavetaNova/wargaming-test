import { setupTooltip } from "./ui/ui";
import { setupCalculator } from "./ui/calculator";
import { tanks } from "./data/tanksData";
import { renderTanks } from "./render";
import {setupSliders} from "./ui/slider";

setupSliders();

renderTanks(tanks);
setupTooltip(tanks);
setupCalculator();
