import { setupTooltip } from "./ui/ui";
import { setupCalculator } from "./ui/calculator";
import { tanks } from "./data/tanksData";
import { renderTanks } from "./render";

renderTanks(tanks);
setupTooltip();
setupCalculator();
