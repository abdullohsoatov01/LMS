// Browser-only Python runner (Pyodide in a Web Worker). Import only from client components.

export type PythonStatus = "idle" | "loading" | "ready" | "error";

export type RunResult = {
  output: string;
  /** Friendly Uzbek error message, or null when code and tests passed. */
  error: string | null;
  /** Whether the error came from the student's code or from the checks. */
  phase: "code" | "tests" | "timeout";
};

const TIMEOUT_MS = 8000;

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let status: PythonStatus = "idle";
const listeners = new Set<(s: PythonStatus) => void>();
let nextId = 1;

function setStatus(s: PythonStatus) {
  status = s;
  listeners.forEach((l) => l(s));
}

export function getPythonStatus() {
  return status;
}

export function onPythonStatus(listener: (s: PythonStatus) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function loadPython() {
  if (readyPromise) return readyPromise;
  setStatus("loading");
  worker = new Worker("/py-worker.js");
  const w = worker;
  readyPromise = new Promise<void>((resolve, reject) => {
    const onMessage = (e: MessageEvent) => {
      if (e.data.type === "ready") {
        w.removeEventListener("message", onMessage);
        setStatus("ready");
        resolve();
      } else if (e.data.type === "load-error") {
        w.removeEventListener("message", onMessage);
        reset("error");
        reject(new Error(e.data.error));
      }
    };
    w.addEventListener("message", onMessage);
  });
  return readyPromise;
}

function reset(newStatus: PythonStatus) {
  worker?.terminate();
  worker = null;
  readyPromise = null;
  setStatus(newStatus);
}

export async function runPython(code: string, tests: string): Promise<RunResult> {
  await loadPython();
  const w = worker!;
  const id = nextId++;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.removeEventListener("message", onMessage);
      reset("idle");
      resolve({
        output: "",
        error: "Kod juda uzoq ishladi va to'xtatildi. Cheksiz sikl (while) yo'qligini tekshir.",
        phase: "timeout",
      });
    }, TIMEOUT_MS);
    const onMessage = (e: MessageEvent) => {
      if (e.data.type !== "result" || e.data.id !== id) return;
      clearTimeout(timer);
      w.removeEventListener("message", onMessage);
      resolve({
        output: e.data.output,
        error: e.data.error ? explainError(e.data.error) : null,
        phase: e.data.phase,
      });
    };
    w.addEventListener("message", onMessage);
    w.postMessage({ id, code, tests });
  });
}

/** Turns a Python traceback into a short message a student can act on. */
export function explainError(traceback: string) {
  const lines = traceback.trim().split("\n");
  const last = lines[lines.length - 1] ?? "";
  const lineMatch = [...traceback.matchAll(/File "<exec>", line (\d+)/g)].pop();
  const where = lineMatch ? ` (${lineMatch[1]}-qator)` : "";
  const [kind, ...rest] = last.split(": ");
  const detail = rest.join(": ");

  if (detail.includes("'___'")) {
    return `Hali ___ o'rniga hech narsa yozilmagan${where}. Uni to'g'ri ifoda bilan almashtir.`;
  }

  switch (kind) {
    case "AssertionError":
      return detail ? `Hali to'g'ri emas: ${detail}` : "Hali to'g'ri emas. Kodni yana bir bor tekshir.";
    case "NameError": {
      const name = detail.match(/name '(.+?)' is not defined/)?.[1];
      return `«${name ?? detail}» degan nom topilmadi${where}. Nomni to'g'ri yozganingni tekshir.`;
    }
    case "SyntaxError":
      return `Yozuvda xato bor${where}: qavslar, qo'shtirnoqlar va ikki nuqtani (:) tekshir.`;
    case "IndentationError":
      return `Chekinish xatosi${where}: qator boshidagi bo'shliqlarni tekshir.`;
    case "TypeError":
      return `Tur xatosi${where}: ${detail}. Masalan, matn va sonni to'g'ridan-to'g'ri qo'shib bo'lmaydi.`;
    case "ZeroDivisionError":
      return `Nolga bo'lish mumkin emas${where}.`;
    case "AttributeError":
      return `Bunday metod yoki xususiyat yo'q${where}: ${detail}`;
    default:
      return `${last}${where}`;
  }
}
