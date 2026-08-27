import { ContactForm } from "@/components/forms/ContactForm";
import { Container, PageHero } from "@/components/ui/Page";
import { school, whatsappUrl } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Bingerville"
        title="Nous trouver, nous écrire"
        lead="Adjamé-Bingerville, lots 1359 à 1362. Secrétariat joignable par téléphone, e-mail ou WhatsApp."
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl text-green-deep">Coordonnées</h2>
            <p className="mt-3">{school.address}</p>
            <p className="text-muted">{school.bp}</p>
            <ul className="mt-4 space-y-2">
              {school.phones.map((phone) => (
                <li key={phone.label}>
                  {phone.href ? (
                    <a href={phone.href} className="font-semibold text-green hover:underline">
                      {phone.display}
                    </a>
                  ) : (
                    <span className="font-semibold text-ink">{phone.display}</span>
                  )}
                  <span className="text-muted"> — {phone.label}</span>
                </li>
              ))}
              <li>
                <a href={`mailto:${school.email}`} className="font-semibold text-green hover:underline">
                  {school.email}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted">
              {school.hours}. {school.hoursNote}
            </p>
            {school.facebook ? (
              <p className="mt-3">
                <a
                  href={school.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-green hover:underline"
                >
                  Page Facebook officielle
                </a>
              </p>
            ) : null}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1f9e4b] px-4 py-2 font-semibold text-white"
              >
                WhatsApp
              </a>
              <a
                href={school.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-green px-4 py-2 font-semibold text-green-deep"
              >
                Itinéraire
              </a>
            </div>
          </div>
          <iframe
            title="Carte Bingerville Adjamé-Bingerville"
            src={school.osmEmbed}
            className="h-72 w-full rounded-3xl border border-line"
            loading="lazy"
          />
        </div>
        <ContactForm kind="contact" />
      </Container>
    </>
  );
}
