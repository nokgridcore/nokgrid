import { Icon, type IconName, type IconSize } from "@nokgridcore/ui/icon";

const shown = "scale-100 opacity-100 blur-0";
const hidden = "scale-icon-out opacity-0 blur-icon-out";
const motion =
  "motion-safe:transition-[opacity,filter,transform] motion-safe:duration-icon motion-safe:ease-emphasized";

/**
 * Cross-fades between two icons for a state change (copy → copied, sun → moon).
 * Both stay in the DOM so the swap animates in both directions; the inactive
 * icon sets the size and the active one overlays it.
 */
export function IconSwap({
  active,
  activeIcon,
  inactiveIcon,
  size = "md",
}: {
  active: boolean;
  activeIcon: IconName;
  inactiveIcon: IconName;
  size?: IconSize;
}) {
  return (
    <span className="relative inline-flex" aria-hidden>
      <span
        className={`absolute inset-0 flex items-center justify-center ${motion} ${active ? shown : hidden}`}
      >
        <Icon name={activeIcon} size={size} />
      </span>
      <span className={`flex ${motion} ${active ? hidden : shown}`}>
        <Icon name={inactiveIcon} size={size} />
      </span>
    </span>
  );
}
