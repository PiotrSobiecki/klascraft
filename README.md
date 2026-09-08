# KlasCraft

Polski landing page dla platformy komunikacji klasowej, z autorską ilustracją izometryczną i interaktywnym demo. Estetyka inspirowana Minecraftem: leśna zieleń, ciepła biel i detale z klocków.

## Uruchomienie

Wymagany Node.js 22.12+ oraz npm. Z katalogu głównego:

```sh
npm ci
npm run dev
```

Strona oraz API działają wspólnie pod `http://localhost:5173` w lokalnym środowisku Cloudflare Workers.

## Struktura

```text
apps/
  user-application/       React + TypeScript, CSS, Motion, Radix Dialog, Lucide
    src/                 Landing i interaktywne demo
    public/              Favicon
    vite.config.ts       Integracja Vite z backendem Cloudflare
  data-service/
    src/index.ts         API Hono
    wrangler.jsonc       Konfiguracja Cloudflare Workers
    worker-configuration.d.ts  Wygenerowane typy środowiska
scripts/check-ui.py       Testy przeglądarkowe Playwright
skill-draft/              Źródło osobistego skilla z preferencjami architektury
```

Frontend i backend to osobne workspace'y. Na tym etapie jeden Worker serwuje statyczny frontend i API na tym samym originie. Wyjście kompilacji jest w `apps/user-application/dist/`.

## Zakres demonstracji

- Tablica z ogłoszeniami pobieranymi z Hono i oznaczaniem przeczytania.
- Widoki rodzica i ucznia. Widok ucznia pomija składki, czat rodziców i wydarzenie przeznaczone tylko dla rodziców.
- Przykładowe postępy składek, lokalna rozmowa demo i kalendarz.
- Pobieranie przykładowych plików TXT; dodawanie lokalnych załączników do 10 MB przez rodzica i dostęp do nich także w podglądzie ucznia.
- Personalizacja nazwy klasy i szkoły w oknie Radix z zarządzaniem fokusem.
- Responsywność, obsługa klawiatury i ograniczenia ruchu.

To landing page i **publiczne demo z fikcyjnymi danymi**, nie gotowy system szkolny. Dane formularza, wiadomości i załączniki istnieją tylko w pamięci otwartej karty. Nie ma kont, rzeczywistych płatności, trwałego zapisu ani wysyłania wiadomości. Przełącznik roli ilustruje projekt interfejsu, nie jest mechanizmem autoryzacji. Nie umieszczaj w demo prawdziwych danych uczniów ani prywatnych dokumentów.

Przed wdrożeniem właściwej aplikacji: uwierzytelnianie i serwerowe sprawdzanie członkostwa/roli przy każdej operacji, D1 na dane, prywatne R2 na pliki. Neon PostgreSQL jest alternatywą, gdy konkretne wymagania nie mieszczą się w możliwościach D1. Backend nie może zwracać uczniom rozmów rodziców nawet wtedy, gdy frontend je ukrywa.

## Weryfikacja i wdrożenie

```sh
npm run build          # TypeScript + produkcyjny frontend i Worker
npm run types          # Ponowne generowanie typów po zmianie bindings
npm run preview       # Lokalny podgląd zbudowanej wersji
py scripts/check-ui.py # Przy uruchomionym npm run dev; wymaga Python Playwright + Chromium
```

Test przeglądarkowy sprawdza role, wiadomości, dokumenty i pobieranie, kalendarz, formularz klasy, oznaczanie przeczytania, API, szerokości 390/768/1280 oraz reduced motion. Zrzuty trafiają do ignorowanego `test-results/`.

Po zalogowaniu Wranglera do właściwego konta Cloudflare `npm run deploy` buduje projekt i publikuje Worker wraz z assetami. Konfiguracja wdrożenia jest generowana przez plugin.

Publiczne demo: `https://klascraft.piotr-sobiecki.workers.dev`. Użytkownik zatwierdził pozostawienie tej wersji na Cloudflare. Polecenie `npm exec -- wrangler deploy --dry-run` wcześniej nieoczekiwanie wykonało publikację; nie powtarzać go jako kontroli lokalnej bez ustalenia przyczyny.

Dokumentacja integracji: [Cloudflare React + Vite](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/), [Hono](https://hono.dev/docs/getting-started/cloudflare-workers), [Motion](https://motion.dev/docs/react-installation).
