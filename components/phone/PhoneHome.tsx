import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Lock, Mail, Monitor } from "lucide-react";
import {
  book,
  caseStudies,
  protectedCaseStudies,
  type BookCaseStudySpread,
  type BookComingSoonSpread,
  type BookExperimentsSpread,
  type BookSpread,
  type CaseStudy,
} from "@/data/content";
import { veraai } from "@/data/veraai.server";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import { richText } from "@/components/book/richText";
import PhoneEffects from "./PhoneEffects";
import "./phone.css";

/* The homepage on phones (either way up) and with JavaScript off: a plain scrolling page with
   a card per case study, in place of the 3D book. It is always in the server HTML; phone.css
   shows it only where the book does not (book.settings.desktopOnlyQuery fails). All of its
   text comes from the book's data in data/content.ts. Server only: the case-study question
   on each card is read from the case study itself, VeraAI's included, without sending the
   rest of that case study to the browser. */

const P = book.phone;
const GREEN = book.aboutSpread.settings.colors.accent; // the site's green (name, ID card)
const STUDIES: Record<string, CaseStudy> = { ...caseStudies, veraai };
const CONTACT_ICONS = { email: Mail, linkedin: LinkedinIcon, resume: FileText };

const spreads: BookSpread[] = book.spreads;
const about = spreads.find((s) => s.type === "about");
const cases = spreads.filter((s): s is BookCaseStudySpread => s.type === "case-study");
const playground = spreads.find((s): s is BookExperimentsSpread => s.type === "experiments");
const contact = spreads.find((s): s is BookComingSoonSpread => s.type === "coming-soon");

function CaseCard({ spread, first }: { spread: BookCaseStudySpread; first: boolean }) {
  const study = STUDIES[spread.slug];
  const locked = protectedCaseStudies.includes(spread.slug);
  // small text and the button use the project's darker ink where its accent is too light for
  // small type (Dolby's orange); the top border is always the accent itself
  const ink = spread.keyImpact?.ink ?? spread.accent;
  const image = spread.heroVideo?.poster
    ? { src: spread.heroVideo.poster, alt: "" }
    : study?.hookImage
      ? { src: study.hookImage.src, alt: "" }
      : null;
  return (
    <article
      id={spread.id}
      className="ph-card ph-case ph-reveal"
      aria-labelledby={`${spread.id}-title`}
      style={{ "--ph-accent": spread.accent, "--ph-ink": ink } as CSSProperties}
    >
      <div className="ph-media">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) calc(100vw - 82px), 560px"
            loading="lazy"
            // lazy everywhere, so the hidden page costs nothing on desktop; the first card is
            // fetched first once it is laid out on a phone
            fetchPriority={first ? "high" : "auto"}
          />
        ) : (
          <span className="ph-media-tile" aria-hidden="true">
            {spread.name}
          </span>
        )}
      </div>
      <p className="ph-label ph-label-ink">{spread.label}</p>
      <h2 id={`${spread.id}-title`} className="ph-title">
        {study?.pageTitle ?? spread.title}
      </h2>
      <p className="ph-hook">{spread.hook}</p>
      {spread.results.length > 0 && (
        <ul className="ph-results" aria-label={book.ui.resultsLabel}>
          {spread.results.map((r) => (
            <li key={r}>{richText(r)}</li>
          ))}
        </ul>
      )}
      {locked && (
        <p className="ph-locked">
          <Lock aria-hidden="true" size={14} strokeWidth={1.75} />
          {P.protectedLabel}
        </p>
      )}
      <Link href={spread.href} className="ph-button ph-stretch" data-ph-nav="">
        {spread.cta}
      </Link>
    </article>
  );
}

/** The contact heading, with its handwritten aside pinned above the end of one word. */
function ContactHeading({ spread }: { spread: BookComingSoonSpread }) {
  const { heading, headingAside: aside, headingAsideAfter: after } = spread;
  const m = after ? new RegExp(`\\b${after}\\b`).exec(heading) : null;
  if (!m || !aside) {
    return (
      <h2 className="ph-contact-heading">
        {heading}
        {aside ? <span className="ph-aside">{` ${aside}`}</span> : null}
      </h2>
    );
  }
  return (
    <h2 className="ph-contact-heading">
      {heading.slice(0, m.index)}
      <span className="ph-pin">
        {after}
        <span className="ph-aside is-pinned">
          <span>{aside}</span>
        </span>
      </span>
      {heading.slice(m.index + m[0].length)}
    </h2>
  );
}

export default function PhoneHome() {
  return (
    <div className="ph-home" style={{ "--ph-green": GREEN } as CSSProperties}>
      <PhoneEffects />
      <section className="ph-intro ph-reveal" aria-labelledby="ph-role">
        <h1 id="ph-role" className="ph-role">
          {P.role}
        </h1>
        {about ? <p className="ph-intro-text">{about.intro}</p> : null}
        <p className="ph-screen-note">
          <Monitor aria-hidden="true" size={14} strokeWidth={1.75} />
          <span>{P.screenNote}</span>
        </p>
      </section>

      <section aria-labelledby="ph-cases">
        <p id="ph-cases" className="ph-label ph-section-label">
          {P.caseStudiesLabel}
        </p>
        <div className="ph-stack">
          {cases.map((s, i) => (
            <CaseCard key={s.id} spread={s} first={i === 0} />
          ))}

          {playground && (
            <article
              id={playground.id}
              className="ph-card ph-reveal"
              aria-labelledby={`${playground.id}-title`}
              style={{ "--ph-accent": GREEN, "--ph-ink": GREEN } as CSSProperties}
            >
              <h2 id={`${playground.id}-title`} className="ph-label ph-label-ink">
                {playground.label}
              </h2>
              <p className="ph-intro-text">{playground.intro}</p>
              {/* the same photos and clips as the book's My Playground pages */}
              <ul className="ph-pg-photos">
                {playground.photos.map((p) => (
                  <li key={p.src}>
                    <figure>
                      <div className="ph-pg-photo">
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          sizes="(max-width: 640px) calc(50vw - 47px), 270px"
                          loading="lazy"
                        />
                      </div>
                      <figcaption>{p.caption}</figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
              <ul className="ph-pg-videos">
                {playground.videos.map((v) => (
                  <li key={v.src}>
                    <figure>
                      {/* tap to play; #t=0.1 makes phones show a first frame instead of a blank box.
                          preload is raised to metadata in phone mode only (PhoneEffects), so the
                          hidden page fetches nothing on desktop */}
                      <video
                        src={`${v.src}#t=0.1`}
                        controls
                        playsInline
                        preload="none"
                        aria-label={v.caption}
                      />
                      <figcaption>
                        <span className="ph-pg-caption">{v.caption}</span>
                        <span className="ph-pg-made">{v.madeWith}</span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </article>
          )}

          <p className="ph-soon ph-reveal">{P.comingSoon}</p>
        </div>
      </section>

      {contact && (
        <section id={contact.id} className="ph-contact ph-reveal" aria-label={contact.name}>
          <ContactHeading spread={contact} />
          <ul className="ph-contact-links">
            {contact.links.map((l) => {
              const Icon = CONTACT_ICONS[l.kind];
              const external = l.kind !== "email";
              const inner = (
                <>
                  <Icon className="ph-contact-icon" aria-hidden="true" />
                  <span className="ph-contact-name">{l.label}</span>
                  <span className="ph-contact-value">{l.value}</span>
                  <ArrowUpRight className="ph-contact-arrow" aria-hidden="true" />
                </>
              );
              return (
                <li key={l.kind}>
                  {l.href ? (
                    <a
                      href={l.href}
                      className="ph-contact-link"
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {inner}
                    </a>
                  ) : (
                    <span className="ph-contact-link is-pending">{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
