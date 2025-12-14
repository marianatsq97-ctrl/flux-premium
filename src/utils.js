// src/utils.js
export function createPageUrl(pageName) {
  // Mantém um padrão simples: "/dashboard", "/transactions", etc.
  // Se vier com barra no começo, não duplica
  if (!pageName) return "/";
  const p = String(pageName).trim();
  if (p === "Dashboard") return "/";
  return "/" + p.toLowerCase();
}
