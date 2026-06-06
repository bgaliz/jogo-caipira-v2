'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAdminStore } from '@/store/adminStore';
import { SponsorUploadForm } from './SponsorUploadForm';

const screenLabels: Record<string, string> = {
  between_questions: 'Entre perguntas',
  victory: 'Vitória',
  welcome: 'Inicial',
};

export function SponsorList() {
  const { sponsors, fetchSponsors, updateSponsor, deleteSponsor } = useAdminStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchSponsors(); }, [fetchSponsors]);

  return (
    <div>
      {showForm && <SponsorUploadForm onClose={() => setShowForm(false)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-yellow-400 font-black text-2xl">Patrocinadores</h2>
          <p className="text-blue-400 text-sm">{sponsors.length} patrocinadores cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-black px-5 py-2.5 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all active:scale-95"
        >
          + Adicionar
        </button>
      </div>

      {sponsors.length === 0 ? (
        <div className="text-center py-12 text-blue-400">
          <div className="text-5xl mb-4">🏢</div>
          <p className="font-semibold">Nenhum patrocinador cadastrado.</p>
          <p className="text-sm mt-1">Adicione imagens dos seus investidores para exibir durante o jogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sponsors.map((sp) => (
            <div
              key={sp.id}
              className={`bg-blue-900/50 rounded-xl border border-blue-700 p-4 transition-opacity ${!sp.active ? 'opacity-50' : ''}`}
            >
              <div className="relative h-20 mb-3 bg-white/10 rounded-lg overflow-hidden">
                <Image
                  src={sp.imageUrl}
                  alt={sp.name}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
              <p className="text-white font-bold text-sm truncate">{sp.name}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {sp.displayOnScreens.map((s) => (
                  <span key={s} className="text-xs bg-blue-800 text-blue-300 px-1.5 py-0.5 rounded">
                    {screenLabels[s]}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => updateSponsor(sp.id, { active: !sp.active })}
                  className={`w-10 h-5 rounded-full transition-colors ${sp.active ? 'bg-green-500' : 'bg-gray-600'} relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${sp.active ? 'left-5' : 'left-0.5'}`} />
                </button>
                <button
                  onClick={() => confirm('Excluir este patrocinador?') && deleteSponsor(sp.id)}
                  className="text-blue-400 hover:text-red-400 text-sm transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
