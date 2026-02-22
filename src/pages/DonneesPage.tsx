export default function DonneesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B2A4A] text-white py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Données utiles</h1>
          <p className="text-white/60">Saint-Louis (97450) — Chiffres clés pour la campagne</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 space-y-10">

        {/* Chiffres clés */}
        <section>
          <h2 className="text-xl font-bold text-[#1B2A4A] mb-4">Population & Démographie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '54 478', label: 'Habitants', sub: 'INSEE 2022' },
              { value: '62%', label: '< 45 ans', sub: 'Population jeune' },
              { value: '43%', label: 'Taux de pauvreté', sub: 'Très au-dessus de la moyenne nationale' },
              { value: '33,2%', label: 'Taux de chômage', sub: 'Parmi les plus élevés de La Réunion' },
            ].map((d) => (
              <div key={d.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <p className="text-2xl font-bold text-[#1B2A4A]">{d.value}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{d.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.sub}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-[#1B2A4A] mb-3">Autres indicateurs</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Revenu médian mensuel', value: '~870 €' },
                  { label: 'Part des 18-25 ans', value: '~12%' },
                  { label: 'Part des + de 60 ans', value: '~15%' },
                  { label: 'Nombre de ménages', value: '~18 000' },
                ].map((i) => (
                  <div key={i.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{i.label}</span>
                    <span className="font-semibold text-[#1B2A4A]">{i.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-[#1B2A4A] mb-3">Corps électoral</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Inscrits sur les listes (2020)', value: '42 851' },
                  { label: 'Abstention — 1er tour', value: '44,92%' },
                  { label: 'Abstention — 2nd tour', value: '34,68%' },
                  { label: 'Participation 2nd tour', value: '65,32%' },
                ].map((i) => (
                  <div key={i.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{i.label}</span>
                    <span className="font-semibold text-[#1B2A4A]">{i.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Municipales 2020 — 1er tour */}
        <section>
          <h2 className="text-xl font-bold text-[#1B2A4A] mb-4">Municipales 2020 — 1er tour (15 mars)</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span><strong className="text-[#1B2A4A]">42 699</strong> inscrits</span>
                <span><strong className="text-[#1B2A4A]">23 520</strong> votants (55,08%)</span>
                <span><strong className="text-[#1B2A4A]">22 745</strong> suffrages exprimés</span>
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              {[
                { rank: 1, name: 'Juliana M\'Doihoma', tag: 'LDVD', liste: 'Ensemble, Réveillons Notre Ville', votes: 6019, pct: 26.46, color: 'bg-[#E91E8C]', qualified: true },
                { rank: 2, name: 'Cyrille Hamilcaro', tag: 'LUDI', liste: 'Visons l\'Excellence', votes: 5767, pct: 25.35, color: 'bg-blue-500', qualified: true },
                { rank: 3, name: 'Claude Henri Hoarau', tag: 'LCOM', liste: 'Alliance Pour le Développement', votes: 5759, pct: 25.31, color: 'bg-red-500', qualified: true },
                { rank: 4, name: 'Philippe Rangama', tag: 'LDVG', liste: '', votes: 1584, pct: 6.96, color: 'bg-gray-300', qualified: false },
                { rank: 5, name: 'Jean Piot', tag: 'LDVG', liste: '', votes: 1364, pct: 5.99, color: 'bg-gray-300', qualified: false },
                { rank: 6, name: 'Yvan Dejean', tag: 'LCOM', liste: '', votes: 856, pct: 3.76, color: 'bg-gray-300', qualified: false },
                { rank: 7, name: 'Pierrick Robert', tag: 'LDVC', liste: '', votes: 680, pct: 2.99, color: 'bg-gray-300', qualified: false },
                { rank: 8, name: 'Serge Arnauld Rangama', tag: 'LDVG', liste: '', votes: 367, pct: 1.61, color: 'bg-gray-200', qualified: false },
                { rank: 9, name: 'Sylvie Agathe', tag: 'LDIV', liste: '', votes: 349, pct: 1.53, color: 'bg-gray-200', qualified: false },
              ].map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-gray-400 w-5 text-right">{c.rank}.</span>
                      <span className={`text-sm font-semibold ${c.qualified ? 'text-[#1B2A4A]' : 'text-gray-500'}`}>{c.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 hidden sm:inline">{c.tag}</span>
                      {c.qualified && <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-medium">Qualifié(e)</span>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <span className="text-sm font-semibold text-[#1B2A4A]">{c.pct}%</span>
                      <span className="text-xs text-gray-400 w-16 text-right">{c.votes.toLocaleString('fr-FR')} voix</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-7">
                    <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${(c.pct / 26.46) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-400">Triangulaire au 2nd tour — 3 candidats qualifiés (seuil de 10% des inscrits)</p>
            </div>
          </div>
        </section>

        {/* Municipales 2020 — 2nd tour */}
        <section>
          <h2 className="text-xl font-bold text-[#1B2A4A] mb-4">Municipales 2020 — 2nd tour (28 juin)</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span><strong className="text-[#1B2A4A]">42 851</strong> inscrits</span>
                <span><strong className="text-[#1B2A4A]">27 990</strong> votants (65,32%)</span>
                <span><strong className="text-[#1B2A4A]">27 188</strong> suffrages exprimés</span>
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-5">
              {[
                { name: 'Juliana M\'Doihoma', tag: 'LDVD', votes: 12022, pct: 44.22, seats: 33, commSeats: 16, color: 'bg-[#E91E8C]', elected: true },
                { name: 'Claude Henri Hoarau', tag: 'LUG', votes: 8570, pct: 31.52, seats: 7, commSeats: 3, color: 'bg-red-500', elected: false },
                { name: 'Cyrille Hamilcaro', tag: 'LUDI', votes: 6596, pct: 24.26, seats: 5, commSeats: 2, color: 'bg-blue-500', elected: false },
              ].map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${c.elected ? 'text-[#1B2A4A]' : 'text-gray-600'}`}>{c.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{c.tag}</span>
                      {c.elected && <span className="text-xs px-2 py-0.5 rounded-full bg-[#E91E8C]/10 text-[#E91E8C] font-semibold">Élue maire</span>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <span className="text-lg font-bold text-[#1B2A4A]">{c.pct}%</span>
                      <span className="text-xs text-gray-400 w-20 text-right">{c.votes.toLocaleString('fr-FR')} voix</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${c.pct}%` }} />
                  </div>
                  <div className="flex gap-4 mt-1.5 text-xs text-gray-400">
                    <span>{c.seats} sièges municipaux</span>
                    <span>{c.commSeats} sièges communautaires</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-400">Juliana M'Doihoma devient la première femme maire de Saint-Louis — 33 sièges sur 45 au conseil municipal</p>
            </div>
          </div>
        </section>

        {/* Municipales 2026 */}
        <section>
          <h2 className="text-xl font-bold text-[#1B2A4A] mb-4">Municipales 2026</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E91E8C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[#E91E8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <strong className="text-[#1B2A4A]">Juliana M'Doihoma se présente</strong> pour les municipales 2026 à Saint-Louis.
                  La #TeamJMD utilise l'outil Écoute Citoyenne pour organiser et piloter la campagne terrain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Présidentielle 2022 */}
        <section>
          <h2 className="text-xl font-bold text-[#1B2A4A] mb-4">Présidentielle 2022 — Saint-Louis</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-[#1B2A4A] mb-3">1er tour</h3>
              <div className="space-y-2">
                {[
                  { name: 'Jean-Luc Mélenchon', pct: 44.49 },
                  { name: 'Marine Le Pen', pct: 20.12 },
                  { name: 'Emmanuel Macron', pct: 14.83 },
                ].map((c) => (
                  <div key={c.name} className="flex justify-between text-sm">
                    <span className="text-gray-600">{c.name}</span>
                    <span className="font-semibold text-[#1B2A4A]">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-[#1B2A4A] mb-3">2nd tour</h3>
              <div className="space-y-2">
                {[
                  { name: 'Marine Le Pen', pct: 65.62 },
                  { name: 'Emmanuel Macron', pct: 34.38 },
                ].map((c) => (
                  <div key={c.name} className="flex justify-between text-sm">
                    <span className="text-gray-600">{c.name}</span>
                    <span className="font-semibold text-[#1B2A4A]">{c.pct}%</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Vote protestataire marqué à La Réunion</p>
            </div>
          </div>
        </section>

        {/* Sources */}
        <div className="text-center text-xs text-gray-400 pt-4">
          Sources : INSEE 2022, Ministère de l'Intérieur, Préfecture de La Réunion
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 bg-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <p>Développé par Jérémy ROPAULD — 2026</p>
          <p className="text-[#E91E8C] font-medium">#TeamJMD — Saint-Louis</p>
        </div>
      </footer>
    </div>
  );
}
