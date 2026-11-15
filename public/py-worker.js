// Runs student Python code with Pyodide, off the main thread so infinite loops can be killed.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

const ready = loadPyodide()
  .then((py) => {
    self.postMessage({ type: "ready" });
    return py;
  })
  .catch((err) => {
    self.postMessage({ type: "load-error", error: String(err) });
  });

self.onmessage = async (event) => {
  const { id, code, tests } = event.data;
  const py = await ready;
  if (!py) return;

  const output = [];
  py.setStdout({ batched: (line) => output.push(line) });
  py.setStderr({ batched: (line) => output.push(line) });

  const namespace = py.globals.get("dict")();
  let error = null;
  let phase = "code";
  try {
    await py.runPythonAsync(code, { globals: namespace });
    if (tests) {
      phase = "tests";
      await py.runPythonAsync(tests, { globals: namespace });
    }
  } catch (err) {
    error = String(err && err.message ? err.message : err);
  } finally {
    namespace.destroy();
  }
  self.postMessage({ type: "result", id, output: output.join("\n"), error, phase });
};
