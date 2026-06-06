'use client';

import { useState, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';

interface Props {
  onClose: () => void;
}

type Screen = 'between_questions' | 'victory' | 'welcome';
const SCREENS: { value: Screen; label: string }[] = [
  { value: 'between_questions', label: 'Entre perguntas' },
  { value: 'victory', label: 'Tela de vitória' },
  { value: 'welcome', label: 'Tela inicial' },
];

export function SponsorUploadForm({ onClose }: Props) {
  const { createSponsor } = useAdminStore();
  const [name, setName] = useState('');
  const [selectedScreens, setSelectedScreens] = useState<Screen[]>(['between_questions']);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const toggleScreen = (s: Screen) => {
    setSelectedScreens((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/sponsors/upload', { method: 'POST', body: formData });
      const { url } = await res.json();
      await createSponsor({
        name: name.trim(),
        imageUrl: url,
        displayOnScreens: selectedScreens,
        order: 0,
        active: true,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 rounded-2xl p-6 w-full max-w-md border border-yellow-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-yellow-400 font-black text-xl">Novo Patrocinador</h2>
          <button onClick={onClose} className="text-blue-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-yellow-300 text-sm font-bold mb-1">Nome da empresa *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-blue-800 border border-blue-600 rounded-xl px-3 py-2 text-white text-sm focus:border-yellow-400 focus:outline-none"
              placeholder="Ex: Padaria do João"
              required
            />
          </div>

          <div>
            <label className="block text-yellow-300 text-sm font-bold mb-2">Exibir em *</label>
            <div className="space-y-2">
              {SCREENS.map((s) => (
                <label key={s.value} className="flex items-center gap-2 cursor-pointer text-sm text-blue-200">
                  <input
                    type="checkbox"
                    checked={selectedScreens.includes(s.value)}
                    onChange={() => toggleScreen(s.value)}
                    className="accent-yellow-400"
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-yellow-300 text-sm font-bold mb-1">Imagem *</label>
            <div
              className="border-2 border-dashed border-blue-600 rounded-xl p-4 text-center cursor-pointer hover:border-yellow-500/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="max-h-24 mx-auto object-contain" />
              ) : (
                <div className="text-blue-400 text-sm">
                  <div className="text-3xl mb-2">📁</div>
                  <p>Clique para selecionar a imagem</p>
                  <p className="text-xs mt-1">PNG, JPG, SVG</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-blue-800 text-blue-300 font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !file || !name.trim()}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-black py-2.5 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all disabled:opacity-50"
            >
              {saving ? 'Enviando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
