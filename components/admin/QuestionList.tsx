'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { QuestionForm } from './QuestionForm';
import type { Question } from '@/lib/types';

const categoryColors: Record<string, string> = {
  cultura_junina: 'bg-orange-500/20 text-orange-300',
  historia: 'bg-purple-500/20 text-purple-300',
  geografia: 'bg-green-500/20 text-green-300',
  geral: 'bg-blue-500/20 text-blue-300',
};

export function QuestionList() {
  const { questions, loading, fetchQuestions, updateQuestion, deleteQuestion } = useAdminStore();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleToggleActive = async (q: Question) => {
    await updateQuestion(q.id, { active: !q.active });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta pergunta?')) return;
    setDeleting(id);
    await deleteQuestion(id);
    setDeleting(null);
  };

  return (
    <div>
      {(showForm || editingQuestion) && (
        <QuestionForm
          question={editingQuestion || undefined}
          onClose={() => { setShowForm(false); setEditingQuestion(null); }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-yellow-400 font-black text-2xl">Perguntas</h2>
          <p className="text-blue-400 text-sm">{questions.length} perguntas cadastradas · {questions.filter(q => q.active).length} ativas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-black px-5 py-2.5 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all active:scale-95"
        >
          + Nova Pergunta
        </button>
      </div>

      {loading ? (
        <div className="text-blue-400 text-center py-12">Carregando...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 text-blue-400">
          <div className="text-5xl mb-4">❓</div>
          <p className="font-semibold">Nenhuma pergunta cadastrada.</p>
          <p className="text-sm mt-1">Clique em &ldquo;+ Nova Pergunta&rdquo; para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`bg-blue-900/50 rounded-xl border border-blue-700 p-4 transition-opacity ${!q.active ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold text-sm w-6 flex-shrink-0 mt-0.5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-snug">{q.text}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(['A', 'B', 'C', 'D', 'E'] as const).filter(k => q.options[k]).map((key) => (
                      <span
                        key={key}
                        className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                          key === q.correctOption
                            ? 'bg-green-500/30 text-green-300 ring-1 ring-green-500/50'
                            : 'bg-blue-800 text-blue-400'
                        }`}
                      >
                        {key}: {q.options[key]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${categoryColors[q.category || 'geral'] || categoryColors.geral}`}>
                      {q.category || 'geral'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(q)}
                    title={q.active ? 'Desativar' : 'Ativar'}
                    className={`w-10 h-5 rounded-full transition-colors ${q.active ? 'bg-green-500' : 'bg-gray-600'} relative`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${q.active ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  <button
                    onClick={() => setEditingQuestion(q)}
                    className="text-blue-400 hover:text-yellow-400 transition-colors text-sm px-2 py-1 rounded-lg hover:bg-blue-800"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    disabled={deleting === q.id}
                    className="text-blue-400 hover:text-red-400 transition-colors text-sm px-2 py-1 rounded-lg hover:bg-blue-800 disabled:opacity-50"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
