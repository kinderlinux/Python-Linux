(() => {
  if (!document.documentElement.classList.contains("js")) return;

  const body = document.body;
  const term = document.createElement("div");
  term.className = "term";
  body.append(term);

  const frames = ["*     ", " *    ", "  *   ", "   *  ", "    * ", "     *", "    * ", "   *  ", "  *   ", " *    ", "*     "];
  const steps = [
    ["HTML okunuyor...", "HTML okundu", () => {}],
    ["Font indiriliyor...", "Font indirildi", () => Promise.race([
      document.fonts ? document.fonts.load('20px "Minecraft"') : Promise.resolve(),
      sleep(1200)
    ])],
    ["Stiller yükleniyor...", "Stiller yüklendi", () => { document.getElementById("theme").media = "all"; }],
    ["Font uygulanıyor...", "Font uygulandı", () => { body.classList.add("font-in", "colors-in"); }],
    ["Üst bar yükleniyor...", "Üst bar hazır", () => body.classList.add("nav-in")],
    ["Sayfalar geliyor...", "Sayfalar geldi", () => body.classList.add("cards-in")]
  ];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const line = () => {
    const el = document.createElement("div");
    el.className = "line";
    term.appendChild(el);
    return el;
  };
  const bar = line();
  const setBar = n => {
    const total = 16;
    bar.innerHTML = '<span class="bar">[' + "█".repeat(n) + "░".repeat(total - n) + ']</span> <span class="msg">%' + Math.round(n / total * 100) + "</span>";
  };
  const done = (el, text) => {
    el.classList.remove("active");
    el.innerHTML = '<span class="done">[ DONE ]</span> <span class="msg">' + text + "</span>";
  };

  (async () => {
    for (let i = 0; i < steps.length; i++) {
      const [label, result, apply] = steps[i];
      const el = line();
      el.classList.add("active");
      const count = i === steps.length - 1 ? 16 : 9;
      if (reduced) {
        done(el, result);
        await apply();
      } else {
        for (let f = 0; f < count; f++) {
          el.innerHTML = '<span class="frame">[' + frames[f % frames.length] + ']</span> <span class="msg">' + label + "</span>";
          setBar(Math.floor((i + f / count) / steps.length * 16));
          await sleep(i === steps.length - 1 ? 45 : 35);
        }
        done(el, result);
        await apply();
        await sleep(120);
      }
      setBar(Math.floor((i + 1) / steps.length * 16));
    }
    const info = line();
    info.innerHTML = '<span class="info">[ INFO ]</span> <span class="msg">website hazır.</span>';
    await sleep(reduced ? 200 : 400);

    term.innerHTML = '<div class="ready">PYTHON LINUX WEBSITE HAZIR</div>';
    term.classList.add("ready-mode");
    await sleep(reduced ? 250 : 900);
    term.classList.add("out");
    await sleep(reduced ? 50 : 400);
    term.remove();
  })();
})();
