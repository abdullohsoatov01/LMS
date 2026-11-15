"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import type { CodeStep as CodeStepType } from "@/content/types";
import { getPythonStatus, loadPython, onPythonStatus, runPython, type RunResult } from "@/lib/python";
import { Markdown } from "../Markdown";

const extensions = [python()];

export function CodeStep({ step, onAnswer }: { step: CodeStepType; onAnswer: (correct: boolean) => void }) {
  const [code, setCode] = useState(step.starter);
  const [status, setStatus] = useState(getPythonStatus);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [failures, setFailures] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const unsubscribe = onPythonStatus(setStatus);
    loadPython().catch(() => {});
    return unsubscribe;
  }, []);

  async function run() {
    setRunning(true);
    try {
      const r = await runPython(code, step.tests);
      setResult(r);
      if (!r.error) {
        setPassed(true);
        onAnswer(!revealed);
      } else {
        setFailures((f) => f + 1);
      }
    } catch {
      setResult({ output: "", error: "Python yuklanmadi. Internetni tekshirib, sahifani yangilang.", phase: "code" });
    } finally {
      setRunning(false);
    }
  }

  function reveal() {
    setRevealed(true);
    setCode(step.solution);
    setResult(null);
  }

  const loading = status === "loading" || status === "idle";

  return (
    <div className="animate-pop">
      <div className="mb-2 text-sm font-extrabold uppercase tracking-wider text-violet-500">🐍 Kod topshirig'i</div>
      <h2 className="mb-4 text-2xl font-black text-slate-900">{step.title}</h2>
      <Markdown className="mb-5 !text-base">{step.task}</Markdown>

      <div className="overflow-hidden rounded-2xl border-2 border-slate-800 bg-[#282c34] shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-2 font-mono text-xs text-slate-400">main.py</span>
        </div>
        <CodeMirror
          value={code}
          onChange={setCode}
          extensions={extensions}
          theme="dark"
          editable={!passed}
          basicSetup={{ foldGutter: false, highlightActiveLine: !passed, autocompletion: false }}
          className="font-mono text-[15px]"
        />
      </div>

      {!passed && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={run} disabled={running || loading} className="btn btn-success">
            {loading ? "⏳ Python yuklanmoqda..." : running ? "⏳ Ishlamoqda..." : "▶ Ishga tushirish"}
          </button>
          {step.hint && !showHint && (
            <button type="button" onClick={() => setShowHint(true)} className="btn btn-ghost">
              💡 Maslahat
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setCode(revealed ? step.solution : step.starter);
              setResult(null);
            }}
            className="btn btn-ghost"
          >
            ↺ Qaytadan
          </button>
          {failures >= 2 && !revealed && (
            <button type="button" onClick={reveal} className="btn btn-ghost text-amber-600">
              👀 Yechimni ko'rish
            </button>
          )}
        </div>
      )}

      {showHint && step.hint && !passed && (
        <div className="mt-4 animate-pop rounded-2xl bg-amber-50 px-4 py-3 font-semibold text-amber-900">
          💡 {step.hint}
        </div>
      )}

      {revealed && !passed && (
        <div className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 font-semibold text-sky-900">
          Yechim muharrirga qo'yildi. Uni diqqat bilan o'qib chiq, nima o'zgarganini top va ishga tushir.
        </div>
      )}

      {result && (
        <div className="mt-4 animate-pop overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-900 font-mono text-sm">
          <div className="border-b border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Natija
          </div>
          {result.output && <pre className="whitespace-pre-wrap px-4 py-3 text-slate-100">{result.output}</pre>}
          {result.error ? (
            <div className="whitespace-pre-wrap bg-rose-500/15 px-4 py-3 font-sans text-base font-bold text-rose-300">
              ❌ {result.error}
            </div>
          ) : (
            <div className="bg-emerald-500/15 px-4 py-3 font-sans text-base font-bold text-emerald-300">
              ✅ Barcha tekshiruvlardan o'tdi!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
