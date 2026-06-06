'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import type { Question } from '@/lib/types';

interface Props {
  question?: Question;
  onClose: () => void;
}

const emptyOptions = { A: '', B: '', C: '', D: '', E: '' };

export function QuestionForm({ question, onClose }: Props) {
  const { createQuestion, updateQuestion } = useAdminStore();
  const [text, setText] = useState(question?.text || '');
  const [options, setOptions] = useState<Record<string, string>>(
    question
      ? {
          A: question.options.A,
          B: question.options.B,
          C: question.options.C,
          D: question.options.D,
          E: question.options.E || '',
        }
      : { ...emptyOptions }
  );
  const [correctOption, setCorrectOption] = useState<string>(question?.correctOption || 'A');
  const [hasE, setHasE] = useState(Boolean(question?.options.E));
  const [category, setCategory] = useState(question?.category || 'geral');
  const [saving, setSaving] = useState(false);

  const visibleOptions = hasE ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    for (const key of visibleOptions) {
      if (!options[key]?.trim()) return;
    }
    setSaving(true);
    const payload = {
      text: text.trim(),
      options: {
        A: options.A,
        B: options.B,
        C: options.C,
        D: options.D,
        E: hasE ? options.E : null,
      },
      correctOption: correctOption as Question['correctOption'],
      category,
      active: question?.active ?? true,
    };
    if (question) {
      await updateQuestion(question.id, payload);
    } else {
      await createQuestion(payload);
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 rounded-2xl p-6 w-full max-w-lg border border-yellow-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-yellow-400 font-black text-xl">
            {question ? 'Editar Pergunta' : 'Nova Pergunta'}
          </h2>
          <button onClick={onClose} className="text-blue-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-yellow-300 text-sm font-bold mb-1">Pergunta *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-blue-800 border border-blue-600 rounded-xl px-3 py-2 text-white text-sm focus:border-yellow-400 focus:outline-none resize-none"
              rows={3}
              placeholder="Digite a pergunta..."
              required
            />
          </div>

          <div>
            <label className="block text-yellow-300 text-sm font-bold mb-1">Categoria</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-blue-800 border border-blue-600 rounded-xl px-3 py-2 text-white text-sm focus:border-yellow-400 focus:outline-none"
              placeholder="geral, historia, cultura_junina..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-yellow-300 text-sm font-bold">Opções *</label>
              <label className="flex items-center gap-2 text-blue-300 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasE}
                  onChange={(e) => {
                    setHasE(e.target.checked);
                    if (!e.target.checked && correctOption === 'E') setCorrectOption('A');
                  }}
                  className="accent-yellow-400"
                />
                5 opções (A–E)
              </label>
            </div>
            <div className="space-y-2">
              {visibleOptions.map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    value={key}
                    checked={correctOption === key}
                    onChange={() => setCorrectOption(key)}
                    className="accent-yellow-400 flex-shrink-0"
                  />
                  <span className="text-yellow-400 font-black text-sm w-5">{key}</span>
                  <input
                    value={options[key] || ''}
                    onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="flex-1 bg-blue-800 border border-blue-600 rounded-xl px-3 py-2 text-white text-sm focus:border-yellow-400 focus:outline-none"
                    placeholder={`Opção ${key}`}
                    required={key !== 'E' || hasE}
                  />
                </div>
              ))}
            </div>
            <p className="text-blue-400 text-xs mt-1">Selecione o botão de rádio para marcar a resposta correta.</p>
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
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-black py-2.5 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all disabled:opacity-50"
            >
              {saving ? 'Salvando...' : question ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
