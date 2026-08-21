import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Box,
  Building2,
  CalendarDays,
  Camera,
  Check,
  CircleCheck,
  Clock,
  Globe2,
  Hash,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  Recycle,
  ShieldCheck,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SustainabilityEmailForm } from "@/components/sustainability/SustainabilityEmailForm";
import { getSustainabilityActionContent } from "@/config/sustainability-action";
import { localizeHref } from "@/i18n/config";
import { getRequestLocale } from "@/i18n/request";
import { getSustainabilityPartners } from "@/lib/data/queries";

const recipientIcons = [ShoppingBasket, Building2, Users];
const valueIcons = [Leaf, Recycle, ShieldCheck, Globe2];
const infoIcons = [Box, Hash, CalendarDays, Snowflake, MapPin, Clock, Camera];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const content = getSustainabilityActionContent(locale);
  return { title: content.title, description: content.teaser };
}

export default async function SustainabilityActionPage() {
  const [locale, partners] = await Promise.all([
    getRequestLocale(),
    getSustainabilityPartners(),
  ]);
  const c = getSustainabilityActionContent(locale);

  return (
    <>
      <PageHero
        image="/images/sustainability-action.jpg"
        imageAlt=""
        eyebrow={c.tagline}
        title={c.title}
        align="left"
        overlay="gradient"
      >
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-100/90 sm:text-lg">
          {c.teaser}
        </p>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <SectionHeading title={c.title} className="mb-8" />
              <div className="space-y-5 text-base leading-8 text-ink-soft sm:text-lg">
                {c.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-9 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-7">
                <p className="font-semibold leading-relaxed text-amber-900">{c.scopeNote}</p>
                <p className="mt-3 leading-relaxed text-ink-soft">{c.foodbankNote}</p>
                <Button href={localizeHref("/services/foodbank", locale)} variant="white" size="sm" className="mt-5">
                  {locale === "en" ? "Visit Zhongxin Food Bank" : "前往忠信食物銀行"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-mist/60 py-16 sm:py-20">
        <Container>
          <SectionHeading title={c.suppliesTitle} align="center" className="mb-12" />
          <div className="grid gap-6 lg:grid-cols-2">
            {c.supplies.map((group, index) => {
              const Icon = index === 0 ? ShoppingBasket : Box;
              return (
                <Reveal key={group.title} delay={index * 0.08}>
                  <article className="h-full rounded-3xl border border-navy-100 bg-white p-7 shadow-card sm:p-9">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-navy-700 text-white">
                        <Icon className="size-6" strokeWidth={1.5} />
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-navy-900">{group.title}</h3>
                    </div>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                          <CircleCheck className="mt-0.5 size-4 shrink-0 text-amber-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 space-y-2.5 border-t border-navy-100 pt-6">
                      {group.notes.map((note) => <p key={note} className="text-sm leading-relaxed text-navy-700">{note}</p>)}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionHeading title={c.recipientsTitle} />
                <p className="mt-6 max-w-xl text-base leading-8 text-ink-soft">
                  {c.recipientsIntro}
                </p>
                <div className="mt-8 hidden items-center gap-3 text-sm font-semibold text-amber-700 lg:flex">
                  <span className="h-px w-12 bg-amber-400" />
                  {locale === "en" ? "Three distribution networks" : "三個主要分享網絡"}
                </div>
              </div>
            </Reveal>

            <div className="relative space-y-4 before:absolute before:bottom-10 before:left-[2.45rem] before:top-10 before:w-px before:bg-navy-100 sm:before:left-[3.45rem]">
              {c.recipients.map((item, index) => {
                const Icon = recipientIcons[index];
                return (
                  <Reveal key={item.title} delay={index * 0.08}>
                    <article className="group relative grid grid-cols-[3.5rem_1fr] overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-soft sm:grid-cols-[5.5rem_1fr]">
                      <div className="relative z-10 flex flex-col items-center justify-center gap-2 bg-navy-50 px-2 py-6 text-navy-700 transition-colors group-hover:bg-amber-50 group-hover:text-amber-700 sm:py-8">
                        <Icon className="size-6 sm:size-7" strokeWidth={1.5} />
                        <span className="font-serif text-xs font-black tracking-[0.16em]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="p-5 sm:p-7">
                        <h3 className="font-serif text-xl font-bold text-navy-900 sm:text-2xl">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy-800 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.06)_1px,transparent_0)] bg-size-[28px_28px]" />
        <Container className="relative">
          <SectionHeading title={c.flowTitle} invert align="center" className="mb-12" />
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
            {c.flow.map((step, index) => (
              <div key={step} className="contents">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-center text-sm font-semibold leading-relaxed text-navy-50 backdrop-blur-sm">
                  <span className="mb-2 block font-serif text-lg text-amber-300">{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </div>
                {index < c.flow.length - 1 && <ArrowDown className="mx-auto size-5 text-amber-400 lg:-rotate-90" />}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-9 max-w-3xl text-center leading-relaxed text-navy-100/75">{c.flowNote}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title={c.valuesTitle} align="center" className="mb-12" />
          <div className="grid gap-px overflow-hidden rounded-3xl border border-navy-100 bg-navy-100 sm:grid-cols-2 lg:grid-cols-4">
            {c.values.map((value, index) => {
              const Icon = valueIcons[index];
              return (
                <article key={value.title} className="bg-white p-7">
                  <Icon className="size-8 text-amber-500" strokeWidth={1.5} />
                  <h3 className="mt-5 font-serif text-xl font-bold text-navy-900">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{value.description}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-mist/60 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading title={c.situationsTitle} description={c.situationsNote} />
            <div className="grid gap-3 sm:grid-cols-2">
              {c.situations.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-navy-100 bg-white p-4 text-sm leading-relaxed text-ink-soft shadow-card">
                  <Check className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title={c.infoTitle} align="center" className="mb-12" />
          <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.infoItems.map((item, index) => {
              const Icon = infoIcons[index];
              return (
                <div key={item} className="group rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-serif text-2xl font-black text-amber-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600 transition-colors group-hover:bg-amber-50 group-hover:text-amber-700">
                      <Icon className="size-5" strokeWidth={1.6} />
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-navy-800">{item}</p>
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-4xl rounded-2xl bg-amber-50 p-6 text-sm leading-relaxed text-amber-900">{c.infoNote}</p>
        </Container>
      </section>

      <section className="bg-navy-50 py-16 sm:py-20">
        <Container>
          <SectionHeading title={c.partnersTitle} description={c.partnersText} align="center" className="mb-10" />
          {partners.length > 0 ? (
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((partner) => {
                const name = locale === "en" ? partner.nameEn || partner.name : partner.name;
                const logo = (
                  <>
                    <div className="relative h-20 w-full sm:h-24">
                      <Image
                        src={partner.logoUrl}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                        className="object-contain"
                      />
                    </div>
                    <span className="mt-3 line-clamp-2 text-center text-xs font-semibold leading-relaxed text-navy-700">
                      {name}
                    </span>
                  </>
                );

                return partner.websiteUrl ? (
                  <a
                    key={partner.id}
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-36 flex-col items-center justify-center rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-soft"
                  >
                    {logo}
                  </a>
                ) : (
                  <div key={partner.id} className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                    {logo}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto flex min-h-40 max-w-5xl items-center justify-center rounded-3xl border border-dashed border-navy-200 bg-white/70 p-8 text-center">
              <div>
                <HeartHandshake className="mx-auto size-10 text-navy-300" strokeWidth={1.25} />
                <p className="mt-3 text-sm text-ink-muted">{locale === "en" ? "Partner logos coming soon" : "合作夥伴 LOGO 將陸續更新"}</p>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="overflow-hidden rounded-[2rem] bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 p-7 shadow-glow sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div className="text-navy-950">
                <span className="inline-flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4" />{locale === "en" ? "Take action today" : "現在就加入"}</span>
                <h2 className="mt-4 font-serif text-3xl font-black sm:text-4xl">{c.joinTitle}</h2>
                <p className="mt-5 leading-relaxed text-navy-900/75">{c.joinText}</p>
                <Button href={localizeHref("/about/contact", locale)} variant="secondary" size="md" className="mt-7">
                  <Mail className="size-4" />{c.contact}
                </Button>
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                <SustainabilityEmailForm
                  title={c.provide}
                  fields={[
                    { name: "name", label: c.fields.name },
                    { name: "phone", label: c.fields.phone },
                    { name: "contactEmail", label: c.fields.email, type: "email" },
                    { name: "item", label: c.fields.item },
                    { name: "quantity", label: c.fields.quantity },
                    { name: "expiry", label: c.fields.expiry },
                    { name: "storage", label: c.fields.storage },
                    { name: "location", label: c.fields.location },
                    { name: "available", label: c.fields.available },
                  ]}
                  photoLabel={c.fields.photo}
                  note={c.formNote}
                  submitLabel={c.submit}
                  type="supplies"
                  locale={locale}
                />
                <SustainabilityEmailForm
                  title={c.cooperate}
                  fields={[
                    { name: "name", label: c.fields.name },
                    { name: "phone", label: c.fields.phone },
                    { name: "contactEmail", label: c.fields.email, type: "email" },
                  ]}
                  messageLabel={c.fields.message}
                  note={c.partnershipFormNote}
                  submitLabel={c.submit}
                  type="partnership"
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
