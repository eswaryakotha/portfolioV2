import { Fragment, type ReactNode } from "react";

/** Plain text where **a phrase** is shown in bold. */
export function richText(text: string): ReactNode {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
  );
}
