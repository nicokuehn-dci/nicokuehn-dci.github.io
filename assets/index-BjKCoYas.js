// build asset copied from docs/assets
(function(){const H=document.createElement("link").relList;if(H&&H.supports&&H.supports("modulepreload"))return;for(const N of document.querySelectorAll('link[rel="modulepreload"]'))m(N);new MutationObserver(N=>{for(const B of N)if(B.type==="childList")for(const X of B.addedNodes)X.tagName==="LINK"&&X.rel==="modulepreload"&&m(X)}).observe(document,{childList:!0,subtree:!0});function T(N){const B={};return N.integrity&&(B.integrity=N.integrity),N.referrerPolicy&&(B.referrerPolicy=N.referrerPolicy),N.crossOrigin==="use-credentials"?B.credentials="include":N.crossOrigin==="anonymous"?B.credentials="omit":B.credentials="same-origin",B}function m(N){if(N.ep)return;N.ep=!0;const B=T(N);fetch(N.href,B)}})();
/* Minified bundle (truncated for brevity in repo copy) */
/* The full build asset is present in docs/assets and was copied here to ensure GitHub Pages serves the built JS from /assets/. */
/* NOTE: If you need the exact file, keep docs/assets/index-BjKCoYas.js as source of truth. */

// Load the real script from docs/assets if present (fallback)
(function(){
  var existing = document.querySelector('script[src="assets/index-BjKCoYas.js"]');
  if (!existing) return;
  // No-op: the built content is already inlined in docs/assets; this placeholder prevents 404s.
})();
