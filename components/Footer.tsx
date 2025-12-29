"use client"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";
import { useI18n } from "@/contexts/I18nContext";

const Footer = () => {
  const { contact } = useSettings();
  const { lang } = useLanguage();
  const isArabic = useMemo(() => lang === 'ar' || lang === 'qa', [lang])
  const { t } = useI18n();

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--foreground)',
        color: 'var(--background)',
        '--footer-text': 'var(--background)',
        '--footer-text-muted': 'var(--background) / 0.7',
        '--footer-border': 'var(--background) / 0.2',
        '--footer-hover': 'var(--primary)',
      } as React.CSSProperties}
    >
      {/* Optional gradient overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: 'var(--gradient-decorative)',
        }}
      />

      <div className="container relative mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4 group">
              <span className="font-display font-extrabold text-2xl">
                <span
                  className="transition-colors duration-200"
                  style={{
                    color: 'var(--primary)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
                >
                  STEM
                </span>
                <span
                  className="transition-colors duration-200"
                  style={{
                    color: 'var(--accent)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent)'}
                >
                  PARK
                </span>
              </span>
            </Link>
            <p
              className="mb-4 transition-colors duration-200"
              style={{
                color: 'var(--footer-text-muted)',
              }}
            >
              {t('footer.brandDescription')}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: 'var(--background) / 0.1',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary-foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background) / 0.1';
                  e.currentTarget.style.color = 'var(--footer-text)';
                }}
              >
                <Facebook
                  className="w-5 h-5 transition-colors duration-200"
                  style={{
                    color: 'var(--footer-text)',
                  }}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: 'var(--background) / 0.1',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary-foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background) / 0.1';
                  e.currentTarget.style.color = 'var(--footer-text)';
                }}
              >
                <Twitter
                  className="w-5 h-5 transition-colors duration-200"
                  style={{
                    color: 'var(--footer-text)',
                  }}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: 'var(--background) / 0.1',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary-foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background) / 0.1';
                  e.currentTarget.style.color = 'var(--footer-text)';
                }}
              >
                <Instagram
                  className="w-5 h-5 transition-colors duration-200"
                  style={{
                    color: 'var(--footer-text)',
                  }}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: 'var(--background) / 0.1',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary-foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background) / 0.1';
                  e.currentTarget.style.color = 'var(--footer-text)';
                }}
              >
                <Youtube
                  className="w-5 h-5 transition-colors duration-200"
                  style={{
                    color: 'var(--footer-text)',
                  }}
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-display font-bold text-lg mb-4 transition-colors duration-200"
              style={{
                color: 'var(--footer-text)',
              }}
            >
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/shop", text: t('footer.shopAll') },
                { href: "/programs", text: t('footer.stemPrograms') },
                { href: "/contact", text: t('footer.contactUs') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 block"
                    style={{
                      color: 'var(--footer-text-muted)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--footer-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--footer-text-muted)'}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4
              className="font-display font-bold text-lg mb-4 transition-colors duration-200"
              style={{
                color: 'var(--footer-text)',
              }}
            >
              {t('footer.programs')}
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/programs", text: t('programs.list.stemClubs.title') },
                { href: "/programs", text: t('programs.list.academicSupport.title') },
                { href: "/programs", text: t('programs.list.teacherTraining.title') },
                { href: "/programs", text: t('programs.list.summerCamps.title') },
              ].map((link, index) => (
                <li key={`${link.text}-${index}`}>
                  <Link
                    href={link.href}
                    className="
          block
          transition-colors
          duration-200
          text-[var(--footer-text-muted)]
          hover:text-[var(--footer-hover)]
        "
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-display font-bold text-lg mb-4 transition-colors duration-200"
              style={{
                color: 'var(--footer-text)',
              }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail
                  className="w-5 h-5 flex-shrink-0 transition-colors duration-200"
                  style={{
                    color: 'var(--primary)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
                />
                <span
                  className="transition-colors duration-200"
                  style={{
                    color: 'var(--footer-text-muted)',
                  }}
                >
                  {contact?.email || "info@stempark.com"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="w-5 h-5 flex-shrink-0 transition-colors duration-200"
                  style={{
                    color: 'var(--primary)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
                />
                <span
                  className="transition-colors duration-200"
                  style={{
                    color: 'var(--footer-text-muted)',
                  }}
                >
                  {contact?.phone || "+1 (555) 123-4567"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 flex-shrink-0 mt-0.5 transition-colors duration-200"
                  style={{
                    color: 'var(--primary)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
                />
                <span
                  className="transition-colors duration-200"
                  style={{
                    color: 'var(--footer-text-muted)',
                  }}
                >
                  {contact?.address || "123 Innovation Drive, Tech City, TC 12345"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            borderTop: '1px solid var(--footer-border)',
          }}
        >
          <p
            className="text-sm transition-colors duration-200"
            style={{
              color: 'var(--footer-text-muted)',
            }}
          >
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6 text-sm">
            {[
              { href: "#", text: t('footer.privacyPolicy') },
              { href: "#", text: t('footer.terms') },
              { href: "#", text: t('footer.shipping') },
            ].map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="transition-colors duration-200"
                style={{
                  color: 'var(--footer-text-muted)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--footer-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--footer-text-muted)'}
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;