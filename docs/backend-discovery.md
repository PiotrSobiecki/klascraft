# Backend — ustalenia discovery

Data: 2026-09-08. Źródło: rozmowa brainstormer:ask, Q1–Q150.

Dokument opisuje docelowe wymagania, nie istniejącą implementację. Obecny frontend jest demonstracją; stan przeglądarki nie zastępuje rzeczywistego uwierzytelniania ani kontroli dostępu. Poniżej zapisano decyzje potwierdzone przez użytkownika. Kwestie nierozstrzygnięte i zastąpione warianty są wskazane osobno.

## Cel i zakres pilotażu

- Główne kryterium sukcesu: po weryfikacji założyciele samodzielnie zapraszają rodziców i prowadzą klasy, bez dalszej pomocy operatora.
- Pilotaż: do 10 klas i około 300 kont dorosłych w pierwszych trzech miesiącach. To szacunek, nie limit produktu.
- Pierwsza wersja jest bezpłatna, bez abonamentów i płatności.
- Nie ma sztywnej daty premiery: uruchomienie po wdrożeniu i sprawdzeniu całego uzgodnionego zakresu.
- Nie ustalono limitu kosztów operacyjnych. Najpierw należy oszacować hosting, pliki i wysyłkę e-maili.
- Pierwsze wdrożenie obejmuje także automatyczne pobieranie aktualności szkolnych, powiadomienia i eksport archiwum; nie odkładać ich samodzielnie do następnej wersji.
- Brak wiadomości prywatnych. Komunikacja odbywa się przez wpisy i komentarze.

## Szkoły i klasy

- Lista obejmuje wszystkie działające szkoły podstawowe w Warszawie, publiczne i niepubliczne.
- Jedna klasa o danym oznaczeniu w konkretnej szkole i roku szkolnym. Nie dopuszczamy równoległych duplikatów, np. dwóch „5A” w tej samej szkole i roku.
- Przy próbie utworzenia duplikatu należy skierować użytkownika do procesu dołączenia do istniejącej klasy. Sposób kontaktu/prośby po późniejszej zmianie modelu zaproszeń wymaga doprecyzowania; nie przywracać automatycznie publicznej rejestracji dorosłych.
- Osoba zarządzająca przenosi tę samą grupę na kolejny rok, np. z 5A do 6A. Uczestnicy i historia pozostają, bez ponownych zaproszeń.
- Klasa może działać bez konta wychowawcy po zatwierdzeniu założyciela przez operatora.

## Zgłoszenie i weryfikacja założyciela

- Pierwszy założyciel zgłasza się formularzem, a konto dorosłego zakłada dopiero ze specjalnego zaproszenia po weryfikacji.
- Formularz: imię i nazwisko, e-mail, obowiązkowy telefon, rola rodzic/wychowawca, szkoła, oznaczenie klasy, rok szkolny i krótki opis związku z klasą.
- Potwierdzenie e-maila linkiem jest wymagane przed skierowaniem zgłoszenia do rozpatrzenia. Nie tworzy konta ani dostępu do klasy.
- Prosty panel operatora przechowuje zgłoszenia i pozwala je zatwierdzać lub odrzucać.
- Operator ręcznie potwierdza związek zgłaszającego z klasą przez szkołę lub wychowawcę, korzystając z kontaktu znalezionego niezależnie na oficjalnej stronie szkoły.
- Sam e-mail lub telefon zgłaszającego nie stanowi potwierdzenia rodzicielstwa. Nie zbieramy skanów dokumentów.
- Zatwierdzenie umożliwia wysłanie zaproszenia do utworzenia konkretnej klasy.
- Każda kolejna klasa wymaga osobnej akceptacji operatora, także dla wcześniej zweryfikowanej osoby z kontem.

## Konta i publiczny dostęp

- Konta posiadają wyłącznie dorośli. Rejestracja tylko przez specjalne zaproszenia, bez otwartego formularza rejestracji dorosłego.
- Logowanie przez e-mail i hasło, potwierdzenie adresu oraz resetowanie hasła.
- Jedno konto może należeć do wielu klas; role i uprawnienia są ustalane osobno w każdej klasie. Przykład: wychowawca w jednej klasie, rodzic w innej.
- Nie tworzymy kont uczniów, członkostw uczniów, weryfikacji ich zgłoszeń ani powiązań dziecko–rodzic.
- Osoba bez konta wybiera szkołę i klasę oraz czyta publiczne treści.
- „Obserwuj klasę” zapisuje wybór w pamięci konkretnej przeglądarki. Nie tworzy członkostwa, konta ani uprawnień. Po wyczyszczeniu danych wybór trzeba powtórzyć; nie ma uzgodnionej synchronizacji między urządzeniami.

## Zaproszenia

- Dwa tryby: dla wskazanych adresów e-mail albo bez ograniczenia adresów.
- W trybie ograniczonym dołączenie następuje po potwierdzeniu zaproszonego adresu, bez dodatkowej ręcznej akceptacji. Samo przekazanie linku na inny adres nie daje dostępu.
- W trybie bez ograniczenia każdy posiadacz linku może zarejestrować dorosłe konto i wejść do klasy bez akceptacji.
- Dla otwartego linku wystawiający wybiera ważność: 1 godzina, 1 dzień, 7 dni lub 30 dni.
- Otwarty link nadaje wyłącznie rolę rodzica. Wychowawcę zapraszamy na konkretny e-mail. Uprawnienia dodatkowego administratora nadaje się osobno po dołączeniu.
- Osoba zarządzająca może unieważnić zaproszenie przed terminem. Wygaśnięcie i unieważnienie blokują kolejne dołączenia, nie usuwają już przyjętych członków.
- Usunięcie uczestnika z klasy nie jest blokadą ponownego wejścia: może on wrócić przez dowolne ważne zaproszenie, także wspólny link.
- Świadomie zaakceptowano ryzyko przekazania otwartego linku dziecku lub innej osobie oraz użycia konta rodzica przez dziecko. Nie przedstawiać zaproszenia otwartego jako weryfikacji dorosłości.
- Dokładny czas ważności zaproszeń ograniczonych do e-maili, linków założyciela i linków potwierdzających nie został uzgodniony.

## Role i zarządzanie klasą

- Założycielem może być rodzic albo wychowawca po weryfikacji operatora.
- Wychowawca zarządza klasą razem z założycielem: zaprasza uczestników, zarządza członkostwami i treściami. Wcześniejsze ogólne ustalenie o zatwierdzaniu zgłoszeń nie przywraca usuniętych procesów akceptacji uczniów i rodziców z zaproszeń.
- Założyciel lub wychowawca nadaje wybranym rodzicom uprawnienia dodatkowego administratora, np. członkom trójki klasowej.
- Dodatkowi administratorzy zapraszają uczestników, zarządzają treściami i mogą usuwać zwykłych rodziców. Nie usuwają innych administratorów, wychowawcy ani założyciela.
- Założyciel i wychowawca mogą usuwać uczestników i odbierać uprawnienia dodatkowym administratorom.
- Wychowawca nie może usunąć założyciela ani odebrać mu uprawnień.
- Funkcję założyciela przekazuje sam założyciel albo zmienia ją operator. Następca, dorosły z klasy, musi przyjąć funkcję.
- Założyciel przed opuszczeniem klasy lub usunięciem konta przekazuje funkcję; brak następcy wymaga interwencji operatora.
- Założyciel lub operator może usunąć wychowawcę albo odebrać mu rolę. Dodatkowi administratorzy nie mogą tego robić.
- Lista uczestników widoczna dla dorosłych z klasy zawiera wyłącznie imię, nazwisko i rolę, bez e-maili i telefonów.

## Wychowawca

- Założyciel wpisuje imię i nazwisko wychowawcy podczas tworzenia klasy.
- Dane są widoczne tylko wewnątrz klasy. Przed przyjęciem zaproszenia pokazujemy oznaczenie „Wychowawca jeszcze nie dołączył”.
- Jedna klasa ma jednego wychowawcę naraz.
- Przy zmianie wychowawcy następca otrzymuje zaproszenie; dopiero przy jego przyjęciu przejmuje rolę, a poprzedni wychowawca traci członkostwo w tej klasie. Jego konto i inne klasy pozostają.
- Wyjątek: gdy poprzedni wychowawca jest też założycielem, najpierw musi przekazać funkcję założyciela i uzyskać przyjęcie przez następcę. Dopiero potem można zakończyć zmianę wychowawcy i odebrać dostęp. Brak następcy wymaga operatora.

## Wpisy, widoczność i komentarze

- Wewnętrzne treści są dostępne wyłącznie zalogowanym dorosłym należącym do klasy. Zewnętrzne są publiczne, także dla osób bez konta.
- Przy tworzeniu wpisu widoczność domyślnie jest wewnętrzna. Uprawniony autor widzi wybór i może go zmienić; pozostawienie wewnętrznej nie wymaga dodatkowego kliknięcia.
- Wpisy zewnętrzne publikują tylko założyciel, wychowawca i dodatkowi administratorzy. Zwykły rodzic nie widzi opcji publikowania na zewnątrz.
- Wszyscy rodzice mogą tworzyć wpisy i komentować wewnętrznie.
- Komentarze pozostają zawsze wewnętrzne, również pod publicznymi wpisami. Dodają i czytają je tylko dorośli należący do klasy; interfejs jasno oznacza ten zakres.
- Publicznie autora reprezentuje nazwa klasy, np. „Klasa 5A”. Dane rzeczywistego autora widzą tylko dorośli z klasy.
- Autor może zmieniać widoczność w obie strony, z zachowaniem uprawnień do publikacji zewnętrznej. Upublicznienie wymaga potwierdzenia, że załączniki również będą publiczne.
- Zmiana na wewnętrzny zamyka publiczny dostęp do wpisu i plików, ale nie usuwa wcześniej pobranych kopii.
- Autor może edytować i usuwać własne wpisy i komentarze w dowolnym momencie, dopóki należy do aktywnej klasy. Archiwum pozostaje tylko do odczytu.
- Usunięcie wpisu usuwa także całą dyskusję i załączniki. Autor przed operacją potwierdza ten skutek.
- Osoby zarządzające mogą ukrywać i usuwać cudze wpisy i komentarze, lecz nie edytują cudzej treści.

## Załączniki

- Dozwolone: JPEG, PNG, WebP i PDF.
- Maksymalnie 10 MB na plik i 5 plików na wpis.
- Załączniki dziedziczą widoczność wpisu. Publiczne są dostępne publicznie, wewnętrzne tylko dorosłym z klasy, również przy otwarciu bezpośredniego adresu pliku.

## Aktualności szkoły

- Pobieranie co 2–3 dni, uruchamiane dopiero po zatwierdzeniu pierwszej klasy w szkole.
- Publiczna prezentacja: tytuł, data, krótki fragment i link do pełnej wiadomości na stronie szkoły.
- Gdy strony nie da się obsłużyć automatycznie, pokazujemy link do aktualności szkoły. Nie blokujemy klasy ani nie wymagamy ręcznego przepisywania.
- Aktualności szkoły nie trafiają do podsumowań e-mail ani dzwoneczka.
- Nie uzgodniono generowania streszczeń przez AI. „Krótki fragment” nie oznacza zgody na dodanie takiej funkcji.

## Powiadomienia

- Dzwoneczek po zalogowaniu: wszystkie nowe wpisy i komentarze w klasach użytkownika oraz sprawy wymagające działania, zgodnie z uprawnieniami.
- Codzienne podsumowanie e-mail nowych wpisów, z możliwością wyłączenia.
- Podsumowanie zawiera tytuły i krótkie fragmenty także wpisów wewnętrznych. Pełna wewnętrzna treść w aplikacji wymaga logowania i dostępu do klasy.
- Komentarze nie trafiają do podsumowania e-mail, tylko do dzwoneczka.
- E-maile obsługują również konta, zgłoszenia, zaproszenia i ustalone przypomnienie o usunięciu archiwum.
- Godzina wysyłki, szczegóły preferencji i oznaczania powiadomień jako przeczytane pozostają do zaprojektowania.

## Moderacja i zgłoszenia

- Moderacja wewnętrzna należy do założyciela i osób zarządzających klasą. Nie budujemy operatorowi procesu zgłaszania treści wewnętrznych ani dostępu do nich w ramach interwencji.
- Publiczny wpis może zgłosić każdy zalogowany dorosły, również spoza klasy. Osoba bez konta nie może zgłaszać.
- Zgłoszenia trafiają do osób zarządzających klasą i generują powiadomienie w dzwoneczku.
- Zgłoszenie nie ukrywa automatycznie wpisu. Zarządzający może ukryć wpis albo odrzucić zgłoszenie.
- Dokładny formularz zgłoszenia oraz publiczny kontakt w sprawach wymagających interwencji operatora nie zostały doprecyzowane. Nie przywracać odrzuconego anonimowego zgłaszania wpisów.

## Odejście, usunięcie konta i archiwum

- Odejście/usunięcie z klasy odbiera dostęp, ale wcześniejsze wpisy i komentarze zostają z podpisem autora. Publicznie nadal podpisem jest nazwa klasy.
- Po usunięciu całego konta wpisy, komentarze i załączniki pozostają; tracą powiązanie z profilem, podpis zmienia się na „Usunięte konto”. Publicznie nadal nazwa klasy.
- Dane zawarte w samych tekstach lub plikach nie znikają automatycznie. Ta decyzja produktowa nie rozstrzyga sposobu obsługi prawnych żądań usunięcia danych.
- Po ukończeniu szkoły klasa jest archiwizowana. Dotychczasowi członkowie czytają historię, bez publikowania i zapraszania. Treści zewnętrzne i ich pliki tracą publiczny dostęp.
- Archiwum przechowujemy 3 lata od archiwizacji, potem usuwamy klasę, wpisy, komentarze i załączniki.
- Osoby zarządzające mogą wyeksportować archiwum wraz z wpisami, komentarzami i plikami. Eksport jest dozwolony w trybie tylko do odczytu.
- 30 dni przed usunięciem archiwum zarządzający dostają e-mail z datą usunięcia i linkiem do eksportu wymagającego zalogowania.

## Jawnie zatwierdzone założenia

1. **Pilotaż samodzielnych klas** — do 10 klas/około 300 dorosłych, sukces mierzony samodzielną obsługą po weryfikacji (Q108, Q114).
2. **Pełny bezpłatny zakres** — bez płatności i sztywnej daty, również z aktualnościami szkół; koszty najpierw szacujemy (Q84, Q106, Q110, Q112).
3. **Weryfikacja konkretnej klasy** — ręczna weryfikacja założyciela za każdym razem, panel operatora i potwierdzony e-mail zgłoszenia (Q2, Q70–Q76).
4. **Dorośli z zaproszeń, uczniowie bez kont** — publiczne czytanie i lokalne obserwowanie zamiast członkostw uczniów (Q35–Q38).
5. **Dwa tryby zaproszeń i zaakceptowane ryzyko** — adresy e-mail albo otwarty link z ważnością; otwarty tylko dla rodzica, możliwe przekazanie dziecku (Q54–Q58).
6. **Wiele klas na konto** — niezależne role per klasa (Q15).
7. **Jedna klasa i ciągłość grupy** — unikalna szkoła/rok/oznaczenie, przejście między rocznikami z historią (Q17, Q19).
8. **Podział publiczne/wewnętrzne** — domyślnie wewnętrzne, publiczne tylko od zarządzających, komentarze zawsze wewnętrzne, publiczny podpis klasy (Q38–Q46).
9. **Pliki zgodne z widocznością** — JPEG/PNG/WebP/PDF, 10 MB, 5 na wpis (Q48, Q50, Q78).
10. **Lokalna moderacja** — bez interwencji operatora w treści wewnętrzne, zgłoszenia publiczne tylko od zalogowanych, bez automatycznego ukrywania (Q118–Q126).
11. **Informacje szkolne bez powiadomień** — fragment i link, co 2–3 dni, tylko szkoły z klasami, awaryjnie sam link (Q27–Q29, Q82, Q92).
12. **Dzwoneczek i dzienny e-mail** — dzwoneczek obejmuje komentarze, e-mail tylko wpisy z fragmentami (Q86–Q94).
13. **Kontrolowane przekazanie odpowiedzialności** — chroniony założyciel, następca przyjmuje funkcję; jeden wychowawca i bezpieczna kolejność jego zmiany (Q62, Q102, Q140–Q146).
14. **Historia i retencja archiwum** — treści pozostają po odejściu i usunięciu konta na uzgodnionych zasadach; archiwum 3 lata, eksport i przypomnienie (Q98–Q104, Q134–Q138).
15. **Ograniczona lista uczestników i brak wiadomości prywatnych** — imię, nazwisko, rola; komunikacja we wpisach i komentarzach (Q148, Q150).

## Warianty zastąpione lub odrzucone — nie wdrażać

- Konta uczniów, wybór klasy i akceptacja zgłoszenia ucznia, powiązania z rodzicami oraz zakaz zmiany konta ucznia na dorosłe: zastąpione całkowitą rezygnacją z kont uczniów (Q38).
- Przygotowanie klasy na koncie przed weryfikacją założyciela: zastąpione rejestracją przez zaproszenie po weryfikacji (Q35).
- Wspólny link rodzicielski wymagający późniejszej akceptacji: zastąpiony dwoma trybami bez dodatkowej akceptacji (Q54).
- Wyłącznie indywidualne/jednorazowe linki dla konkretnych e-maili: zastąpione możliwością również otwartego linku z terminem (Q54).
- Uczniowska część dostępna po uwierzytelnieniu: zastąpiona treściami publicznymi i częścią wewnętrzną dla dorosłych (Q38).
- Dostęp operatora do zgłoszonych wewnętrznych treści i rejestrowanie takich interwencji (Q116): wycofane w Q118.
- Zgłaszanie wpisów przez osoby bez konta: wycofane w Q122.
- Wiadomości prywatne, płatności, automatyczne ukrycie po zgłoszeniu, edycja cudzych treści i kilku wychowawców naraz: poza uzgodnionym zakresem.

## Otwarte kwestie przed implementacją lub uruchomieniem

Nie są to zatwierdzone założenia; nie przedstawiać propozycji technicznych jako decyzji użytkownika.

- Źródło kompletnej listy szkół, trwałe identyfikatory placówek, aktualizacja danych i mapowanie oficjalnych stron.
- Weryfikacja dostępności RSS/HTML stron szkolnych, sposobu pobierania fragmentów i zasad korzystania z materiałów; prototyp integracji. Rezygnacja ze źródła powinna stosować uzgodniony fallback.
- Szacunek kosztów dla pilotażu i wybór dostawcy e-maili, domeny nadawczej oraz mechanizmu uwierzytelniania zgodnego ze stosem projektu.
- Termin ważności zaproszeń innych niż otwarte oraz linków potwierdzeń/resetowania; obsługa już istniejących kont i wielu zaproszeń.
- Proces prośby o dołączenie przy wykryciu duplikatu klasy w modelu bez publicznej rejestracji dorosłych.
- Bootstrap konta operatora, jego uprawnienia operacyjne i rejestrowanie zmian członkostw/ról. Rezygnacja z interwencji w treści nie usuwa operatorowi zatwierdzonego zarządzania założycielami.
- Weryfikacja wymogów prywatności i regulaminu, danych obecnych w tekstach i zdjęciach, żądań usunięcia danych, retencji odrzuconych zgłoszeń, kontaktów, kopii zapasowych i logów. Uzgodnione usunięcie powiązania z kontem nie oznacza automatycznej anonimizacji treści.
- Szczegóły cofania ukrycia wpisu, dostępu do ukrytych treści i obsługi dyskusji pod nimi.
- Format i realizacja eksportu, wygaśnięcie pliku eksportu, egzekwowanie 3-letniej retencji także dla plików i kopii roboczych.
- Powiadomienia: godzina podsumowania, preferencje, deduplikacja i reakcja na utratę członkostwa przed wysyłką.
- Scenariusze końca szkoły, zmiany oznaczenia klasy i konfliktu unikalności przy przenoszeniu rocznika; przypadek istniejącego dorosłego będącego równocześnie rodzicem i wychowawcą w tej samej klasie.

## Następny krok

### Uzupełnienia z rozpoczętego blueprint

- Użytkownik włączył do PRD kalendarz i składki obecne w demo (Q151, odpowiedź 2). Ich szczegółowe wymagania nie zostały jeszcze ustalone.
- Otwarte Q152: czy składki oznaczają wyłącznie ewidencję wpłat dokonywanych poza aplikacją, czy również przyjmowanie płatności przez operatora. Bezpłatność samej aplikacji pozostaje zatwierdzona i nie rozstrzyga tej kwestii.
- Docelowe repozytorium wskazane przez użytkownika: https://github.com/PiotrSobiecki/klascraft. Użytkownik upoważnił do publikacji obecnego brancha i dokumentacji na `main` oraz PRD i issues w tym repozytorium.
- PRD jest w przygotowaniu; niniejszy dokument pozostaje zapisem discovery, nie ukończonym PRD. Podział na moduły i kryteria walidacji wymagają sprawdzenia z użytkownikiem zgodnie z workflow blueprint.

Przygotować PRD na podstawie tych ustaleń, skonfrontować je z istniejącym frontendem i rozstrzygnąć otwarte kwestie przez inspekcję projektu, badanie integracji lub pojedyncze pytania tam, gdzie potrzebna jest decyzja produktowa. Potem przygotować pionowe etapy implementacji całego zakresu i kryteria odbioru, szczególnie dostępu do klas, publicznych plików, zaproszeń i zmian ról.

Konwencje repozytorium: TypeScript; frontend `apps/user-application`; Hono backend `apps/data-service`; Cloudflare Workers i Cloudflare Vite plugin; D1 jako pierwszy wybór relacyjnej bazy, R2 dla plików. Zachować istniejący kierunek wizualny oraz odróżniać działający backend od fikcyjnego demo. Weryfikacja implementacji: `npm run build` plus adekwatne testy zachowania i dostępu.
