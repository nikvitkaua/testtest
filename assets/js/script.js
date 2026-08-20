import { initDomain } from "./api.js";
import { initWheel } from "./wheel.js";
import { showPrizeModal, isModalShown } from "./modal.js";
import { initForm } from "./form.js";

initDomain();

initWheel({
  canSpin: () => !isModalShown(),
  onSpinEnd: showPrizeModal,
});

initForm();
