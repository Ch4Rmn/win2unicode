let pyReady;
async function initPy() {
  if (!pyReady) {
    pyReady = (async () => {
      const pyodide = await loadPyodide();
      await pyodide.loadPackage("micropip");
      await pyodide.runPythonAsync(`
import micropip
await micropip.install('python-myanmar')
          `);
      return pyodide;
    })();
  }
  return pyReady;
}

document.getElementById("convertBtn").addEventListener("click", async () => {
  const inputText = document.getElementById("input").value || "";
  const out = document.getElementById("output");
  const status = document.getElementById("status");
  status.textContent = "Loading converter…";
  try {
    const pyodide = await initPy();
    pyodide.globals.set("input_text", inputText);
    await pyodide.runPythonAsync(`
from myanmar.converter import convert
result = convert(input_text, 'wininnwa', 'unicode')
        `);
    const result = pyodide.globals.get("result");
    out.textContent = result;
    status.textContent = "";
  } catch (e) {
    status.textContent = "Conversion failed: " + e;
  }
});
