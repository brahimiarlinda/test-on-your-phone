// --- 1. Show facts about the device that opened the page ---

const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
const badge = document.getElementById("badge");
badge.textContent = isLocal
  ? "Opened on the laptop (localhost)"
  : `Opened over the network (${location.host})`;
badge.classList.add(isLocal ? "local" : "network");

function renderDevice() {
  const facts = {
    "Address in the bar": location.href,
    "Screen size": `${screen.width} × ${screen.height}`,
    "Viewport (visible area)": `${window.innerWidth} × ${window.innerHeight}`,
    "Pixel ratio": window.devicePixelRatio,
    "Touch screen": navigator.maxTouchPoints > 0 ? "yes" : "no",
    Orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
    Browser: navigator.userAgent,
  };
  const dl = document.getElementById("device");
  dl.innerHTML = "";
  for (const [k, v] of Object.entries(facts)) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = v;
    dl.append(dt, dd);
  }
}
renderDevice();
window.addEventListener("resize", renderDevice);

// --- 2. Call the API ---
// IMPORTANT: the URL is "/api/hello", not "http://localhost:3000/api/hello".
// On the phone, "localhost" means the phone itself, so a hard-coded
// localhost URL would fail there. A relative URL always goes back to
// whatever address the page was opened from.

document.getElementById("ping").addEventListener("click", async () => {
  const out = document.getElementById("result");
  out.textContent = "Calling…";
  try {
    const res = await fetch("/api/hello");
    out.textContent = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    out.textContent = `Failed: ${err.message}`;
  }
});

// --- 3. Small interaction checks ---

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("tapped").textContent = "Form submitted (nothing was sent).";
});

document.querySelectorAll(".targets button").forEach((b) =>
  b.addEventListener("click", () => {
    document.getElementById("tapped").textContent = `You tapped: ${b.textContent}`;
  })
);
