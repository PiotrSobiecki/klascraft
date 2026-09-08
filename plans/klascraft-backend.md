# Plan: Backend KlasCraft (pilotaż)

> Źródło: `docs/prd.md` (historyjki 1–94), ustalenia w `docs/backend-discovery.md`.

## Decyzje architektoniczne

Obowiązują we wszystkich etapach:

- **Styl**: jeden Cloudflare Worker serwuje frontend React i API Hono na wspólnym originie. Backend dzieli się na moduły z wąskimi interfejsami: Dostęp, Szkoły i klasy, Treści, Pliki, Składki, Aktualności, Powiadomienia, Archiwum.
- **Dane**: Cloudflare D1 z migracjami SQL wersjonowanymi w repozytorium; każdy etap dodaje migrację, nie edytuje wcześniejszych. Pliki w prywatnym R2, wydawane wyłącznie przez endpoint backendu.
- **Uwierzytelnianie**: e-mail i hasło (haszowane), sesja w ciasteczku HttpOnly, rejestracja tylko z tokenu zaproszenia. Tokeny zaproszeń, potwierdzeń i resetu przechowywane jako skróty, jednorazowe lub czasowe.
- **Autoryzacja**: jedna funkcja `can(aktor, akcja, zasób)` w module Dostęp; każdy endpoint wewnętrzny przechodzi przez nią, a testy negatywne (bez sesji, spoza klasy, bez uprawnień) są obowiązkowe dla każdego takiego endpointu.
- **Kluczowe encje**: Szkoła, Klasa (unikalna para szkoła + rok szkolny + oznaczenie), Konto, Członkostwo (rola per klasa: założyciel, wychowawca, dodatkowy administrator, rodzic), Zgłoszenie założyciela, Zaproszenie (na e-mail albo otwarte, z ważnością), Wpis (widoczność wewnętrzna/publiczna, opcjonalny termin), Komentarz, Załącznik, Wydarzenie (z opcjonalną serią i listą odwołań), Dziecko, Powiązanie rodzic–dziecko, Zbiórka, Należność dziecka, Wpis dziennika wpłat (tylko dopisywany), Powiadomienie, Preferencje e-mail, Aktualność szkoły, Dziennik zmian, Archiwum.
- **Zadania cykliczne**: Cloudflare Cron Triggers; każde zadanie idempotentne (powtórne uruchomienie nie duplikuje e-maili ani rekordów) i testowane na zamrożonym czasie.
- **E-mail**: wysyłka przez adapter z jednym interfejsem; w środowisku lokalnym i testach adapter zapisuje wiadomości do skrzynki testowej, dostawca produkcyjny jest wybierany w etapie 2 bez zmiany interfejsu.
- **Publiczna projekcja**: endpointy publiczne zwracają tylko dane przeznaczone dla gości: nazwę klasy jako autora, bez komentarzy, identyfikatorów osób, listy uczestników i dzieci.
- **Ograniczenia**: pilotaż do 10 klas i ok. 300 dorosłych; dane w UE; brak funkcji AI; brak płatności.
- **Weryfikacja**: `npm run build` oraz testy backendu uruchamiane jednym poleceniem w CI; testy przeglądarkowe Playwright rozszerzają istniejący skrypt.

---

## Etap 1: Katalog szkół i publiczny widok klasy

**Historyjki**: 1, 2, 3

### Co budujemy

Gość wybiera szkołę z listy warszawskich szkół podstawowych, widzi listę klas w szkole i publiczny widok klasy z publicznymi wpisami (na razie z danych startowych w migracji). „Obserwuj klasę" zapisuje wybór w przeglądarce i przy kolejnym wejściu otwiera tę klasę. Etap zakłada D1, migracje, harness testowy i pierwsze endpointy publiczne. Landing page zostaje, demo pozostaje oznaczone; przełącznik „Uczeń" zostaje zastąpiony linkiem do publicznego widoku.

### Założenia wejściowe

- Istnieje źródło listy szkół podstawowych w Warszawie z identyfikatorem i adresem strony; import jest jednorazowym skryptem.
- Worker, Vite plugin i Wrangler działają jak dziś.

### Poza zakresem etapu

- Tworzenie klas i kont, wpisy inne niż startowe, aktualności szkół.

### Kryteria odbioru

- [ ] Lista szkół zwraca wszystkie zaimportowane szkoły z nazwą i dzielnicą, wyszukiwanie po fragmencie nazwy działa — [test: endpoint publiczny szkół]
- [ ] Widok klasy zwraca publiczne wpisy podpisane nazwą klasy, bez pól autora i komentarzy — [test: projekcja publiczna]
- [ ] „Obserwuj klasę" przetrwa odświeżenie, a wyczyszczenie pamięci przeglądarki je usuwa — [test przeglądarkowy]
- [ ] Migracje uruchamiają się na czystej bazie lokalnej i w CI — [command: skrypt migracji kończy się kodem 0]
- [ ] Testy backendu uruchamiane jednym poleceniem przechodzą w CI — [command: `npm test`]

---

## Etap 2: Zgłoszenie założyciela i panel operatora

**Historyjki**: 6, 7, 8, 9, 10, 11, 15

### Co budujemy

Formularz zgłoszenia (imię i nazwisko, e-mail, telefon, rola, szkoła, oznaczenie, rok szkolny, opis) zapisuje zgłoszenie i wysyła link potwierdzający. Po potwierdzeniu zgłoszenie pojawia się w panelu operatora, który je zatwierdza albo odrzuca; zatwierdzenie wysyła zaproszenie założycielskie. Zgłoszenie klasy, która już istnieje, zwraca wskazanie istniejącej klasy. Konto operatora powstaje procedurą bootstrapu z sekretu środowiska; operator loguje się przez sesję. Adapter e-mail dostaje implementację produkcyjną. Przycisk „Stwórz klasę" na landingu prowadzi do formularza zgłoszenia.

### Założenia wejściowe

- Katalog szkół z etapu 1.
- Dostawca e-maili i domena nadawcza wybrane przed wdrożeniem; lokalnie skrzynka testowa.

### Poza zakresem etapu

- Konta założycieli i tworzenie klas (etap 3).

### Kryteria odbioru

- [ ] Zgłoszenie bez telefonu albo bez szkoły jest odrzucone — [test: walidacja formularza]
- [ ] Zgłoszenie bez potwierdzonego e-maila nie pojawia się w panelu operatora — [test: lista zgłoszeń]
- [ ] Zgłoszenie istniejącej klasy zwraca wskazanie tej klasy, nie tworzy zgłoszenia — [test: duplikat]
- [ ] Zatwierdzenie tworzy zaproszenie założycielskie i wysyła e-mail; odrzucenie nie tworzy zaproszenia — [observable: wiadomość w skrzynce testowej]
- [ ] Panel operatora bez sesji operatora zwraca 403 — [test negatywny]
- [ ] Bootstrap operatora na czystej bazie tworzy dokładnie jedno konto i jest opisany w README — [command: skrypt bootstrapu]

---

## Etap 3: Konto założyciela i utworzenie klasy

**Historyjki**: 16, 17, 22, 23, 39, 94

### Co budujemy

Zaproszenie założycielskie otwiera rejestrację: e-mail, hasło, potwierdzenie adresu, logowanie, reset hasła. Zalogowany założyciel tworzy klasę wskazaną w zaproszeniu: szkoła, oznaczenie, rok szkolny, imię i nazwisko wychowawcy, własna rola. Powstaje członkostwo założyciela, a widok klasy pokazuje „Wychowawca jeszcze nie dołączył". Moduł Dostęp dostaje `can()` z pierwszą tabelą uprawnień i dziennik zmian, do którego trafia utworzenie klasy i członkostwa.

### Założenia wejściowe

- Sesje, adapter e-mail i zaproszenia założycielskie z etapu 2.

### Poza zakresem etapu

- Zapraszanie innych osób, wpisy.

### Kryteria odbioru

- [ ] Rejestracja bez ważnego tokenu zwraca 403; z tokenem tworzy konto wymagające potwierdzenia e-maila — [test: rejestracja]
- [ ] Reset hasła unieważnia stare hasło i token po użyciu — [test: reset]
- [ ] Druga klasa o tym samym oznaczeniu w tej szkole i roku jest odrzucona — [test: unikalność]
- [ ] Klasa może zostać utworzona tylko z zaproszenia założycielskiego dla tej szkoły i klasy — [test: dopasowanie zaproszenia]
- [ ] Każda zmiana członkostwa zapisuje wpis dziennika z aktorem i czasem — [observable: dziennik zmian]
- [ ] Endpointy klasy bez sesji i z sesją spoza klasy zwracają 403 — [test negatywny]

---

## Etap 4: Wpisy i komentarze

**Historyjki**: 41, 42, 45, 46, 47, 48, 49, 92, 93

### Co budujemy

Członek tworzy wpis z domyślną widocznością wewnętrzną; zarządzający może ustawić publiczną. Członkowie komentują (zawsze wewnętrznie), autor edytuje i usuwa swoje treści z potwierdzeniem, zarządzający ukrywają i usuwają cudze bez edycji. Gość widzi publiczne wpisy podpisane nazwą klasy, bez komentarzy. Zakładka „Rozmowy rodziców" znika z aplikacji, jej rolę pełnią wpisy wewnętrzne.

### Założenia wejściowe

- Klasa i członkostwo założyciela z etapu 3; drugiego członka do testów tworzy fixture, nie interfejs.

### Poza zakresem etapu

- Załączniki, terminy przy wpisach, zgłaszanie wpisów, powiadomienia.

### Kryteria odbioru

- [ ] Rodzic nie może ustawić widoczności publicznej; zarządzający może — [test: tabela uprawnień × widoczność]
- [ ] Gość widzi publiczny wpis z autorem „Klasa …" i bez komentarzy; po zmianie na wewnętrzny dostaje 404 — [test: projekcja publiczna]
- [ ] Komentarz pod publicznym wpisem niewidoczny dla gościa i dla zalogowanego spoza klasy — [test negatywny]
- [ ] Zarządzający nie może edytować cudzego wpisu, może go ukryć i usunąć — [test: moderacja]
- [ ] Usunięcie wpisu usuwa komentarze — [test: kaskada]
- [ ] Test przeglądarkowy: utworzenie wpisu, komentarz, ukrycie — [test przeglądarkowy]

---

## Etap 5: Zaproszenia i członkostwa

**Historyjki**: 12, 18, 25, 26, 27, 28, 29, 32, 38, 40

### Co budujemy

Zarządzający wystawia zaproszenie na wskazane adresy (rola rodzic albo wychowawca) albo otwarty link z ważnością 1 h, 1 dzień, 7 dni lub 30 dni (tylko rodzic). Zaproszony zakłada konto albo dołącza istniejącym kontem, po potwierdzeniu adresu w trybie e-mailowym, bez akceptacji. Zaproszenie można unieważnić. Lista uczestników pokazuje imię, nazwisko i rolę. Założyciel i wychowawca usuwają uczestników, rodzic może opuścić klasę. Osoba z kontem zgłasza kolejną klasę do osobnej akceptacji.

### Założenia wejściowe

- Rejestracja i sesje z etapu 3; zaproszenie założycielskie jest osobnym typem i nie zmienia się.

### Poza zakresem etapu

- Nadawanie uprawnień administratora, przekazywanie funkcji, zmiana wychowawcy (etap 6).

### Kryteria odbioru

- [ ] Link e-mailowy użyty z innego adresu jest odrzucony — [test: dopasowanie adresu]
- [ ] Otwarty link po terminie i po unieważnieniu jest odrzucony; przyjęci wcześniej członkowie zostają — [test: ważność]
- [ ] Otwarty link nadaje wyłącznie rolę rodzica, także gdy wystawił go wychowawca — [test: rola]
- [ ] Jedno konto ma różne role w dwóch klasach i różne uprawnienia w każdej — [test: `can()` per klasa]
- [ ] Lista uczestników nie zawiera pól e-mail ani telefon — [test: kształt odpowiedzi]
- [ ] Po usunięciu lub opuszczeniu klasy dawny członek dostaje 403 na treści wewnętrzne, a jego wpisy zostają z podpisem — [test negatywny]
- [ ] Zgłoszenie kolejnej klasy przez osobę z kontem trafia do panelu operatora jako nowe zgłoszenie — [test: kolejna klasa]

---

## Etap 6: Role, przekazanie funkcji i usunięcie konta

**Historyjki**: 13, 14, 19, 21, 30, 31, 33, 34, 35, 36, 37

### Co budujemy

Założyciel lub wychowawca nadaje i odbiera uprawnienia dodatkowego administratora. Administrator usuwa tylko zwykłych rodziców. Założyciel przekazuje funkcję dorosłemu z klasy, który ją przyjmuje. Zmiana wychowawcy: zaproszenie następcy, przy przyjęciu poprzedni traci członkostwo; wychowawca-założyciel musi wcześniej przekazać funkcję. Operator zmienia założyciela i usuwa wychowawcę. Użytkownik usuwa konto; założyciel bez następcy jest blokowany. Treści usuniętego konta dostają podpis „Usunięte konto".

### Założenia wejściowe

- Zaproszenia i członkostwa z etapu 5.

### Poza zakresem etapu

- Powiadomienia o oczekujących przekazaniach (etap 9); do tego czasu widoczne w widoku klasy.

### Kryteria odbioru

- [ ] Pełna macierz rola × akcja (nadanie/odebranie admina, usunięcie rodzica, admina, wychowawcy, założyciela, przekazanie funkcji, zmiana wychowawcy) testowana automatycznie — [test: macierz uprawnień]
- [ ] Wychowawca nie może usunąć założyciela ani odebrać mu uprawnień — [test negatywny]
- [ ] Przekazanie funkcji wymaga przyjęcia; do przyjęcia założycielem pozostaje dotychczasowy — [test: przekazanie]
- [ ] Zmiana wychowawcy-założyciela przed przekazaniem funkcji jest odrzucona — [test: kolejność]
- [ ] Usunięcie konta zachowuje wpisy z podpisem „Usunięte konto", publicznie nazwą klasy — [test: anonimizacja podpisu]
- [ ] Założyciel bez następcy nie może usunąć konta ani opuścić klasy — [test: blokada]
- [ ] Każda zmiana roli i decyzja operatora ma wpis w dzienniku zmian — [observable: dziennik zmian]

---

## Etap 7: Załączniki i zakładka Dokumenty

**Historyjki**: 43, 44, 50, 51, 63

### Co budujemy

Autor dodaje do wpisu do 5 plików JPEG, PNG, WebP lub PDF po maksymalnie 10 MB. Pliki trafiają do prywatnego R2 i są wydawane przez endpoint backendu sprawdzający widoczność wpisu. Upublicznienie wpisu wymaga potwierdzenia, że pliki staną się publiczne; zmiana na wewnętrzny zamyka publiczny dostęp. Usunięcie wpisu usuwa obiekty. Zakładka Dokumenty pokazuje załączniki wszystkich wpisów klasy z filtrem po typie i linkiem do wpisu; gość widzi tylko publiczne.

### Założenia wejściowe

- Wpisy i widoczność z etapu 4.

### Poza zakresem etapu

- Wgrywanie plików poza wpisami, podgląd miniatur.

### Kryteria odbioru

- [ ] Szósty plik, plik 11 MB i typ SVG są odrzucone; typ sprawdzany po zawartości, nie po rozszerzeniu — [test: walidacja]
- [ ] Bezpośredni adres pliku wewnętrznego bez sesji zwraca 403; po upublicznieniu wpisu ten sam adres działa dla gościa; po powrocie na wewnętrzny znów 403 — [test: kontrola dostępu do pliku]
- [ ] Upublicznienie bez potwierdzenia o plikach jest odrzucone — [test: potwierdzenie]
- [ ] Usunięcie wpisu usuwa obiekty w R2 — [observable: brak obiektów w bucketcie po teście]
- [ ] Dokumenty zwracają członkowi załączniki wszystkich wpisów, gościowi tylko z publicznych — [test: projekcja]
- [ ] Test przeglądarkowy: dodanie pliku, pobranie, filtr w Dokumentach — [test przeglądarkowy]

---

## Etap 8: Kalendarz

**Historyjki**: 54, 55, 56, 57, 58, 59, 61, 62

### Co budujemy

Członek dodaje wydarzenie (data, opcjonalna godzina, tytuł, miejsce, opis); publiczne oznaczają tylko zarządzający. Wpis może dołączyć termin, który pojawia się w kalendarzu z linkiem do wpisu. Wydarzenia nie mają komentarzy. Seria co tydzień lub co miesiąc do daty końcowej, przechowywana jako reguła z listą odwołań; edycja zmienia całą serię, pojedyncze wystąpienie można odwołać. Tablica klasy pokazuje nadchodzące wydarzenia, gość widzi publiczne.

### Założenia wejściowe

- Wpisy, uprawnienia i projekcja publiczna z etapu 4.

### Poza zakresem etapu

- Przypomnienia e-mail o wydarzeniach (etap 10), data zakończenia, eksport do kalendarzy zewnętrznych.

### Kryteria odbioru

- [ ] Rodzic nie może oznaczyć wydarzenia jako publiczne — [test: uprawnienia]
- [ ] Wydarzenie wewnętrzne niewidoczne dla gościa, publiczne widoczne — [test: projekcja]
- [ ] Wpis z terminem tworzy wydarzenie z linkiem do wpisu; usunięcie wpisu usuwa wydarzenie; zmiana widoczności wpisu zmienia widoczność wydarzenia — [test: powiązanie]
- [ ] Wystąpienia serii tygodniowej i miesięcznej kończą się na dacie końcowej; edycja serii zmienia wszystkie; odwołane wystąpienie nie wraca po edycji — [test jednostkowy serii]
- [ ] Endpoint wydarzenia nie przyjmuje komentarzy — [test negatywny]
- [ ] Nadchodzące wydarzenia na tablicy posortowane po dacie, z rozwiniętymi wystąpieniami serii — [test przeglądarkowy]

---

## Etap 9: Dzwoneczek i zgłaszanie publicznych wpisów

**Historyjki**: 52, 53, 82, 83, 86

### Co budujemy

Zdarzenia domenowe (nowy wpis, komentarz, wydarzenie, zaproszenie wychowawcy, przekazanie funkcji, zgłoszenie) tworzą powiadomienia w dzwoneczku zgodnie z uprawnieniami odbiorcy. Członek oznacza powiadomienia jako przeczytane. Zalogowany dorosły, także spoza klasy, zgłasza publiczny wpis; zarządzający dostają powiadomienie i ukrywają wpis albo odrzucają zgłoszenie. Utrata członkostwa usuwa nieprzeczytane powiadomienia z tej klasy.

### Założenia wejściowe

- Treści, role i kalendarz z etapów 4–8.

### Poza zakresem etapu

- E-maile (etap 10), formularz zgłoszenia z powodami.

### Kryteria odbioru

- [ ] Komentarz i wpis tworzą powiadomienie dla członków klasy z wyjątkiem autora — [test: emisja zdarzeń]
- [ ] Zgłoszenie publicznego wpisu trafia tylko do zarządzających; rodzic spoza zarządu go nie widzi — [test: uprawnienia odbiorców]
- [ ] Gość nie może zgłosić; zalogowany spoza klasy może; wpis pozostaje widoczny do decyzji — [test: zgłoszenie]
- [ ] Oznaczenie jako przeczytane zmniejsza licznik nieprzeczytanych — [test: licznik]
- [ ] Po usunięciu z klasy członek nie ma powiadomień z tej klasy — [test: utrata członkostwa]

---

## Etap 10: E-maile cykliczne i preferencje

**Historyjki**: 20, 60, 84, 85

### Co budujemy

Cron Triggers uruchamiają dzienne podsumowanie nowych wpisów (tytuł i fragment, także wewnętrznych, bez komentarzy) oraz przypomnienie dzień przed wydarzeniem do dorosłych z klasy. Profil ma osobne przełączniki: podsumowanie, przypomnienia o wydarzeniach, przypomnienia o składkach (ten trzeci działa od etapu 12). Wysyłka pomija osoby bez członkostwa w chwili wysyłki. Wszystkie e-maile transakcyjne przechodzą przez ten sam adapter z rejestrem wysyłek chroniącym przed duplikatami.

### Założenia wejściowe

- Adapter e-mail z etapu 2, powiadomienia z etapu 9, kalendarz z etapu 8.

### Poza zakresem etapu

- Godzina wysyłki konfigurowana przez użytkownika (stała godzina w konfiguracji).

### Kryteria odbioru

- [ ] Na zamrożonym czasie podsumowanie zawiera tytuł i fragment wpisu wewnętrznego bez pełnej treści i bez komentarzy — [test: treść podsumowania]
- [ ] Przypomnienie wychodzi dzień przed wydarzeniem i nie wychodzi dla odwołanego wystąpienia — [test: przypomnienia]
- [ ] Po wyłączeniu w profilu brak danego e-maila, pozostałe nadal wychodzą — [test: preferencje]
- [ ] Dwukrotne uruchomienie zadania nie wysyła drugi raz — [test: idempotencja]
- [ ] Usunięty członek nie dostaje podsumowania — [test: utrata członkostwa]

---

## Etap 11: Składki — dzieci, zbiórki i wpłaty

**Historyjki**: 64, 65, 66, 67, 68, 69, 71, 72, 73, 74

### Co budujemy

Rodzic w profilu wybiera klasę i dziecko z listy albo dodaje nowe; drugi rodzic wybiera tę samą pozycję. Zarządzający dodaje dzieci i przypisuje rodziców bezpośrednio. Zarządzający tworzy zbiórkę (tytuł, opis, kwota na dziecko, opcjonalny termin, domyślnie wszystkie dzieci albo wybór), zmienia kwotę lub zwalnia dziecko, dopisuje dziecko dodane później, odnotowuje wpłaty częściowe. Saldo wynika z dziennika wpłat. Rodzic widzi rozliczenia swoich dzieci, zarządzający wszystkich, pozostali zbiorczy postęp.

### Założenia wejściowe

- Członkostwa i `can()` z etapów 5–6.

### Poza zakresem etapu

- Korekty wpłat, zaległości, przypomnienia, zamykanie zbiórki (etap 12).

### Kryteria odbioru

- [ ] Dwoje rodziców wybiera to samo dziecko i widzi jedno rozliczenie; nie ma podwójnej należności — [test: wspólne rozliczenie]
- [ ] Rodzic dostaje 403 na rozliczenie cudzego dziecka; zarządzający widzi wszystkie; członek bez dziecka widzi tylko sumę i cel — [test: widoczność sald]
- [ ] Kwota wspólna, zmiana indywidualna, zwolnienie i wybór części dzieci dają poprawne należności — [test jednostkowy modułu Składki]
- [ ] Dziecko dodane po utworzeniu zbiórki nie ma należności, dopóki zarządzający go nie dopisze — [test: dopisanie]
- [ ] Dwie wpłaty częściowe sumują się, pozostała kwota maleje do zera — [test: wpłaty częściowe]
- [ ] Lista dzieci i rozliczenia niewidoczne dla gościa i zalogowanego spoza klasy — [test negatywny]

---

## Etap 12: Składki — korekty, terminy i przypomnienia

**Historyjki**: 70, 75, 76, 77

### Co budujemy

Korekta i anulowanie wpłaty tworzą nowe wpisy dziennika z aktorem i czasem; poprzednie pozostają. Po terminie niezapłacona część jest oznaczona jako zaległa, wpłaty nadal można rejestrować. Rodzice przypisani do dziecka dostają e-mail 3 dni przed i 3 dni po terminie, tylko przy niezerowym saldzie, z osobnym wyłączeniem w profilu. Zarządzający zamyka zbiórkę (do potwierdzenia z użytkownikiem przed startem etapu).

### Założenia wejściowe

- Dziennik wpłat z etapu 11, zadania cykliczne i preferencje z etapu 10.

### Poza zakresem etapu

- Harmonogram przypomnień per zbiórka, płatności w aplikacji.

### Kryteria odbioru

- [ ] Korekta zachowuje poprzedni wpis; saldo po anulowaniu wraca do stanu sprzed wpłaty; dziennik zawiera autora i czas — [test: dziennik]
- [ ] Zaległość pojawia się po terminie tylko przy niezerowym saldzie; zbiórka bez terminu nie ma zaległości — [test: zaległości]
- [ ] Na zamrożonym czasie e-mail 3 dni przed i 3 dni po terminie, brak po wyłączeniu w profilu i przy zerowym saldzie — [test: przypomnienia]
- [ ] Zamknięta zbiórka nie przyjmuje wpłat i nie jest na liście aktywnych — [test: zamknięcie]
- [ ] Korekta wpłaty ma wpis w dzienniku zmian klasy — [observable: dziennik zmian]

---

## Etap 13: Aktualności szkół

**Historyjki**: 4, 5, 78, 79, 80, 81

### Co budujemy

Zadanie cykliczne co 2–3 dni pobiera aktualności dla szkół z co najmniej jedną zatwierdzoną klasą przez adaptery RSS i HTML, zapisuje tytuł, datę, fragment i link, deduplikuje. Dla szkoły bez działającego adaptera pokazywany jest link do strony aktualności. Operator przypisuje adres źródła albo oznacza je jako nieobsługiwane (do potwierdzenia przed startem). Widok szkoły z etapu 1 pokazuje aktualności.

### Założenia wejściowe

- Katalog szkół z etapu 1, panel operatora z etapu 2, zadania cykliczne z etapu 10.
- Zasady korzystania z materiałów szkół sprawdzone przed uruchomieniem produkcyjnym.

### Poza zakresem etapu

- Aktualności w powiadomieniach i podsumowaniach, streszczenia generowane automatycznie.

### Kryteria odbioru

- [ ] Adapter RSS i adapter HTML poprawnie parsują zapisane próbki dwóch szkół — [test: próbki]
- [ ] Drugie uruchomienie zadania nie tworzy duplikatów — [test: idempotencja]
- [ ] Szkoła bez działającego źródła zwraca sam link i widok klasy działa — [test: fallback]
- [ ] Szkoła bez zatwierdzonej klasy nie jest pobierana — [test: zakres pobierania]
- [ ] Gość widzi aktualności w widoku szkoły — [test przeglądarkowy]

---

## Etap 14: Przeniesienie rocznika i archiwum

**Historyjki**: 24, 87, 88, 89, 90, 91

### Co budujemy

Zarządzający przenosi klasę na kolejny rok szkolny z nowym oznaczeniem, zachowując członków i historię. Po ukończeniu szkoły archiwizuje klasę: publikowanie i zaproszenia są zablokowane, członkowie czytają historię, publiczne treści i pliki tracą publiczny dostęp. Zarządzający eksportuje archiwum (wpisy, komentarze, pliki, rozliczenia) po zalogowaniu. 30 dni przed usunięciem e-mail z datą i linkiem do eksportu; po 3 latach zadanie cykliczne usuwa klasę wraz z danymi i obiektami R2.

### Założenia wejściowe

- Wszystkie moduły treści, plików i składek z etapów 4–12; zadania cykliczne z etapu 10.

### Poza zakresem etapu

- Format eksportu inny niż archiwum plików z danymi w czytelnym formacie; wygaśnięcie pliku eksportu.

### Kryteria odbioru

- [ ] Przeniesienie na kolejny rok zachowuje członkostwa i wpisy; konflikt oznaczenia w nowym roku jest odrzucony — [test: rocznik]
- [ ] Po archiwizacji publikacja i zaproszenia zwracają 403; gość dostaje 404 na dawne publiczne treści i pliki — [test: archiwizacja]
- [ ] Eksport zawiera wpisy, komentarze, pliki i rozliczenia; bez sesji zarządzającego zwraca 403 — [test: eksport]
- [ ] Na zamrożonym czasie e-mail wychodzi 30 dni przed usunięciem, a po 3 latach klasa, dane i obiekty R2 znikają — [test: retencja]
- [ ] Usunięcie jest idempotentne i zapisane w dzienniku zmian — [observable: dziennik zmian]
