import { MapPin, Phone, Printer, Mail, Navigation } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getContactLocations, type ContactLocation } from "@/config/contact";
import { getRequestLocale } from "@/i18n/request";
import { translate } from "@/i18n/translations";

export async function ContactSection() {
  const locale = await getRequestLocale();
  const contactLocations = await getContactLocations();
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={translate(locale, "服務據點")}
          title={translate(locale, "各地服務據點")}
          description={translate(locale, "興毅遍布北中南的服務據點，歡迎您就近聯繫。")}
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {contactLocations.map((loc, i) => (
            <Reveal key={loc.id} delay={(i % 2) * 0.08}>
              <LocationCard loc={loc} locale={locale} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function LocationCard({ loc, locale }: { loc: ContactLocation; locale: "tw" | "en" }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    loc.address,
  )}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    loc.address,
  )}&hl=${locale === "en" ? "en" : "zh-TW"}&z=16&output=embed`;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      {/* Google 官方地圖嵌入 */}
      <div className="relative aspect-video w-full bg-mist">
        <iframe
          src={embedUrl}
          title={`${loc.name} ${locale === "en" ? "map" : "地圖"}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      </div>

      {/* 資訊 */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg font-bold text-navy-900">{loc.name}</h3>

        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-navy-400" />
            <span>{loc.address}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <Phone className="size-4 shrink-0 text-navy-400" />
            <a
              href={`tel:${loc.tel.replace(/[^0-9]/g, "")}`}
              className="hover:text-amber-600"
            >
              {loc.tel}
            </a>
          </li>
          {loc.fax && (
            <li className="flex items-center gap-2.5">
              <Printer className="size-4 shrink-0 text-navy-400" />
              <span>{loc.fax}</span>
            </li>
          )}
          <li className="flex items-center gap-2.5">
            <Mail className="size-4 shrink-0 text-navy-400" />
            <a href={`mailto:${loc.email}`} className="hover:text-amber-600">
              {loc.email}
            </a>
          </li>
        </ul>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-amber-600 hover:text-amber-700"
        >
          <Navigation className="size-4" />
          {locale === "en" ? "Open in Google Maps" : "在 Google 地圖開啟"}
        </a>
      </div>
    </div>
  );
}
