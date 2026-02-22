import { useState } from 'react';

const desktopScreenshots = [
  { src: '/screenshots/desktop-2.png', alt: 'Tableau de bord — KPIs et graphiques en temps réel' },
  { src: '/screenshots/desktop-3.png', alt: 'Tableau de bord — Top préoccupations et quartiers' },
  { src: '/screenshots/desktop-4.png', alt: 'Carte interactive — Zones d\'action et marqueurs' },
  { src: '/screenshots/desktop-1.png', alt: 'Actions — Suivi des porte-à-porte par quartier' },
  { src: '/screenshots/desktop-5.png', alt: 'Actions — Détail et statistiques' },
];

const mobileScreenshots = [
  { src: '/screenshots/mobile-11.jpg', alt: 'Carte mobile — Vue d\'ensemble' },
  { src: '/screenshots/mobile-2.jpg', alt: 'Création d\'action — Zone sur la carte' },
  { src: '/screenshots/mobile-9.jpg', alt: 'Actions — Résultats par quartier' },
  { src: '/screenshots/mobile-5.jpg', alt: 'Visite — Formulaire terrain' },
  { src: '/screenshots/mobile-4.jpg', alt: 'Visites — Liste détaillée' },
  { src: '/screenshots/mobile-3.jpg', alt: 'Équipe — Gestion des membres' },
];

const features = [
  {
    title: 'Tableau de bord temps réel',
    desc: 'KPIs clés, évolution quotidienne des visites, taux de soutien par quartier, top préoccupations citoyennes.',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    title: 'Carte interactive',
    desc: 'Visualisation géographique des zones d\'action, marqueurs colorés par sentiment, carte de chaleur, couches personnalisables.',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
  {
    title: 'Gestion des actions terrain',
    desc: 'Planification des porte-à-porte, découpage en secteurs et groupes, attribution des bénévoles, suivi en temps réel.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7',
  },
  {
    title: 'Saisie rapide sur le terrain',
    desc: 'Formulaire optimisé mobile : sentiment, préoccupations multiples, coordonnées citoyen avec consentement, géolocalisation automatique.',
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    title: 'Gestion d\'équipe',
    desc: 'Rôles différenciés (admin, direction, coordinateur, bénévole), création de comptes, validation des inscriptions, permissions granulaires.',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    title: 'Mode hors-ligne',
    desc: 'Les visites sont sauvegardées localement et synchronisées automatiquement dès le retour en ligne. Aucune donnée perdue.',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

const parcours = [
  { period: '2016 — présent', role: 'GREEN BIRD — Logistique export', detail: 'Assistant logistique puis responsable logistique export. Gestion de 100+ conteneurs/mois vers l\'international, coordination fournisseurs et transitaires.' },
  { period: '2026', role: 'Créateur de SEALOG', detail: 'Conception et développement d\'un SaaS complet de gestion logistique maritime (React, TypeScript, Node.js, Supabase). De l\'idée au produit, en totale autonomie.' },
  { period: '2026', role: 'Création d\'Écoute Citoyenne', detail: 'Conception de cet outil de campagne terrain pour la #TeamJMD. Cartographie, analytics, gestion d\'équipe — un outil sur-mesure pour Saint-Louis.' },
];

const competences = [
  'React / TypeScript', 'Node.js', 'PostgreSQL / Supabase', 'Cartographie (Leaflet)',
  'Logistique internationale', 'Gestion de projet', 'Analyse de données', 'UX / UI',
];

export default function PresentationPage() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#1B2A4A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E91E8C] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#E91E8C] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#E91E8C] font-semibold text-sm uppercase tracking-wider mb-3">Outil de campagne terrain</p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Écoute Citoyenne
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-lg">
              L'outil numérique qui transforme le porte-à-porte en données exploitables.
              Conçu pour la <span className="text-[#E91E8C] font-semibold">#TeamJMD</span>, pensé pour Saint-Louis.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="/login" className="inline-flex items-center px-6 py-3 bg-[#E91E8C] text-white font-semibold rounded-lg hover:bg-[#d1177d] transition-colors">
                Accéder à l'outil
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              <a href="#fonctionnalites" className="inline-flex items-center px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Découvrir
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src="/screenshots/desktop-2.png"
              alt="Aperçu du tableau de bord"
              className="rounded-xl shadow-2xl border border-white/10 max-w-[500px] w-full"
            />
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B2A4A] mb-3">Fonctionnalités</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Un outil complet pour piloter la campagne terrain, du porte-à-porte à l'analyse des résultats.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#E91E8C]/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#E91E8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1B2A4A] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots Desktop */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B2A4A] mb-3">L'outil en images</h2>
            <p className="text-gray-500">Interface desktop — pensée pour les coordinateurs et la direction de campagne</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {desktopScreenshots.map((s) => (
              <button
                key={s.src}
                onClick={() => setLightbox(s)}
                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 bg-white"
              >
                <img src={s.src} alt={s.alt} className="w-full" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm font-medium">{s.alt}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <p className="text-gray-500">Interface mobile — optimisée pour le terrain</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {mobileScreenshots.map((s) => (
                <button
                  key={s.src}
                  onClick={() => setLightbox(s)}
                  className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 bg-white"
                >
                  <img src={s.src} alt={s.alt} className="w-full" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* À propos — Jérémy ROPAULD */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Photo + Identité */}
          <div className="flex-shrink-0 w-full md:w-80">
            <div className="sticky top-8">
              <img
                src="/screenshots/jeremy-ropauld.jpg"
                alt="Jérémy ROPAULD"
                className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover object-top shadow-lg mx-auto md:mx-0"
              />
              <div className="mt-4 text-center md:text-left">
                <h3 className="text-xl font-bold text-[#1B2A4A]">Jérémy ROPAULD</h3>
                <p className="text-[#E91E8C] font-medium text-sm">Développeur & Logisticien</p>
                <p className="text-gray-500 text-sm mt-1">31 ans — Saint-Louis, La Réunion</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {competences.map((c) => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-[#1B2A4A]/5 text-[#1B2A4A] font-medium">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio + Parcours */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B2A4A] mb-6">Le créateur de l'outil</h2>

            <div className="prose prose-gray max-w-none mb-10">
              <p className="text-gray-600 leading-relaxed">
                Né et grandi à <strong>La Chapelle, Saint-Louis</strong>, Jérémy est un Saint-Louisien attaché à son territoire.
                Après un Bac Sciences au Lycée de Bois d'Olive et une classe préparatoire PTSI-PT au Lycée Lislet Geoffroy,
                il poursuit en Licence de Mathématiques à l'Université de La Réunion. Les circonstances de la vie
                l'amènent à découvrir le monde du travail plus tôt que prévu.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                Depuis <strong>2016 chez GREEN BIRD</strong>, il gravit les échelons de la logistique internationale —
                d'assistant à responsable logistique export, gérant plus de 100 conteneurs par mois vers l'international.
                Cette expérience lui forge une rigueur opérationnelle et une capacité à gérer la complexité au quotidien.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                En parallèle, il se forme au développement web et crée <strong>SEALOG</strong>,
                un logiciel SaaS complet de gestion logistique maritime (React, TypeScript, Node.js, PostgreSQL).
                Un projet ambitieux mené en totale autonomie, de la conception à la mise en production.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                Propriétaire à Saint-Louis, il souhaite aujourd'hui <strong>mettre ses compétences au service de sa ville</strong>.
                L'outil Écoute Citoyenne en est la preuve concrète : un outil professionnel, développé bénévolement,
                pour aider la #TeamJMD à mieux comprendre et servir les Saint-Louisiens.
              </p>
            </div>

            {/* Parcours timeline */}
            <h3 className="font-semibold text-[#1B2A4A] mb-4 text-lg">Parcours</h3>
            <div className="space-y-4">
              {parcours.map((p) => (
                <div key={p.period} className="flex gap-4">
                  <div className="flex-shrink-0 w-2 rounded-full bg-gradient-to-b from-[#E91E8C] to-[#1B2A4A]" />
                  <div>
                    <p className="text-xs font-semibold text-[#E91E8C] uppercase tracking-wider">{p.period}</p>
                    <p className="font-semibold text-[#1B2A4A]">{p.role}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1B2A4A] mb-4">Prêt à passer à l'action ?</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Écoute Citoyenne est déjà utilisé par la #TeamJMD pour les campagnes terrain à Saint-Louis.
          Connectez-vous pour accéder à l'outil.
        </p>
        <a href="/login" className="inline-flex items-center px-8 py-3 bg-[#E91E8C] text-white font-semibold rounded-lg hover:bg-[#d1177d] transition-colors text-lg">
          Se connecter
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <p>Développé par Jérémy ROPAULD — 2026</p>
          <p className="text-[#E91E8C] font-medium">#TeamJMD — Saint-Louis</p>
        </div>
      </footer>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
