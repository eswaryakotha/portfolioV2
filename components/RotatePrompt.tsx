import { Smartphone } from "lucide-react";
import { siteContent } from "@/data/content";
import "./rotatePrompt.css";

/** On a phone held upright, a full-screen note asking to turn it sideways; the site itself is
    made for landscape. Pure CSS (rotatePrompt.css), so it shows from the first paint and goes
    the moment the phone is turned. Hidden everywhere else. */
export default function RotatePrompt() {
  return (
    <div className="rotate-prompt" role="dialog" aria-modal="true" aria-labelledby="rotate-prompt-title">
      <span className="rotate-prompt-phone" aria-hidden="true">
        <Smartphone size={44} strokeWidth={1.4} />
      </span>
      <p id="rotate-prompt-title" className="rotate-prompt-title">
        {siteContent.rotatePrompt.title}
      </p>
      <p className="rotate-prompt-sub">{siteContent.rotatePrompt.sub}</p>
    </div>
  );
}
