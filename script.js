/* =========================================================
   CONFIGURAÇÃO: preencha os dados reais do consultório aqui
   ========================================================= */
const CONFIG = {
  whatsapp: "5544999000568",            // DDI + DDD + número, só dígitos
  phoneLabel: "(44) 99900-0568",
  address: "Mundo Novo - MS",           // ex.: "Rua X, 123 - Centro, Mundo Novo - MS"
  cro: "CRO-MS 7090",
};

/* Avaliações reais do Google (pasta "prova social") */
const REVIEWS = [
  { name: "Kamyle Schisler", text: "Giovanna, uma excelente profissional! A Dra. foi muito atenciosa, cuidadosa e dedicada durante todo o atendimento. Ela me explicou cada procedimento com clareza, transmitindo muita confiança. O consultório é organizado, acolhedor e o atendimento foi impecável. Recomendo de olhos fechados!!!" },
  { name: "Adriana Marchetto", text: "Excelente profissional, muito cautelosa, a melhor em tratamento de canal, super indico." },
  { name: "Anna Honorato", text: "Dra maravilhosa, super atenciosa! Me ajudou muito quando estava com dor, resolveu meu problema 100%. Confio e indico de olhos fechados." },
  { name: "Douglas Menezes de Oliveira", text: "Excelente profissional! Fiquei muito satisfeito com o atendimento da Dra. Giovanna. Desde o primeiro contato, demonstrou muita atenção, cuidado e profissionalismo." },
  { name: "Maria Eduarda Marques", text: "Além da excelência profissional, transmite carinho, confiança e atenção em cada atendimento. Recomendo muito." },
  { name: "Andréa Marques", text: "Atendimento impecável! Muito respeitosa, dedicada e sempre faz questão de ouvir e esclarecer tudo com paciência." },
  { name: "Gi Danelute", text: "Consultório lindo e aconchegante, a Dra. Gi é uma querida, super atenciosa, amei o atendimento!! Recomendo." },
  { name: "Lahriso", text: "Ótimo atendimento, eu amei o lugar, solucionou todos os meus problemas." },
  { name: "Leticia Silva", text: "Atendimento maravilhoso. Super indico." },
];

/* ========================================================= */

const $ = (s, c = document) => c.querySelector(s);
const waLink = (msg = "") =>
  `https://wa.me/${CONFIG.whatsapp}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;

// Dados de contato
document.querySelectorAll('[data-config="address"]').forEach(el => (el.textContent = CONFIG.address));
document.querySelectorAll('[data-config="cro"]').forEach(el => (el.textContent = CONFIG.cro));
document.querySelectorAll('[data-config="phone"]').forEach(el => {
  el.textContent = CONFIG.phoneLabel;
  el.href = waLink("Olá, Dra. Giovanna! Gostaria de agendar uma consulta.");
  el.target = "_blank";
  el.rel = "noopener";
});
$("#whatsFloat").href = waLink("Olá, Dra. Giovanna! Vim pelo site e gostaria de agendar uma consulta.");
$("#year").textContent = new Date().getFullYear();

// Header ao rolar
const header = $(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Menu mobile
const toggle = $("#menuToggle");
const nav = $("#nav");
const setMenu = open => {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

// Depoimentos
const track = $("#reviews");
const initials = n => n.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();
track.innerHTML = REVIEWS.map(r => `
  <article class="review">
    <span class="review__quote-mark" aria-hidden="true">“</span>
    <p>${r.text}</p>
    <div class="review__foot">
      <span class="review__avatar">${initials(r.name)}</span>
      <div>
        <strong>${r.name}</strong>
        <div class="stars" aria-label="5 estrelas">★★★★★</div>
      </div>
      <span class="review__g">Google</span>
    </div>
  </article>`).join("");

const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 22;
$("#nextReview").addEventListener("click", () => {
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
  track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step() });
});
$("#prevReview").addEventListener("click", () => {
  track.scrollTo({ left: Math.max(0, track.scrollLeft - step()) });
});

// FAQ: um aberto por vez
document.querySelectorAll(".faq details").forEach(d =>
  d.addEventListener("toggle", () => {
    if (d.open) document.querySelectorAll(".faq details").forEach(o => o !== d && (o.open = false));
  })
);

// Formulário -> WhatsApp
const form = $("#bookingForm");
const err = $("#formError");
form.addEventListener("submit", e => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  const tel = form.tel.value.trim();
  form.nome.classList.toggle("is-invalid", !nome);
  form.tel.classList.toggle("is-invalid", tel.replace(/\D/g, "").length < 10);
  if (!nome || tel.replace(/\D/g, "").length < 10) {
    err.textContent = "Preencha seu nome e um telefone com DDD.";
    return;
  }
  err.textContent = "";
  const msg = [
    "Olá, Dra. Giovanna! Vim pelo site e gostaria de agendar uma consulta.",
    "",
    `*Nome:* ${nome}`,
    `*Telefone:* ${tel}`,
    `*Tratamento:* ${form.trat.value}`,
    `*Melhor período:* ${form.periodo.value}`,
    form.msg.value.trim() ? `*Mensagem:* ${form.msg.value.trim()}` : "",
  ].filter(Boolean).join("\n");
  window.open(waLink(msg), "_blank", "noopener");
});

// Máscara simples de telefone
form.tel.addEventListener("input", e => {
  const d = e.target.value.replace(/\D/g, "").slice(0, 11);
  e.target.value = d.length > 6
    ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
    : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
});

// Animações de entrada
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
