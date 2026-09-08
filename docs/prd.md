# KlasCraft — PRD backendu pilotażu

Data: 2026-09-08. Źródła: `docs/backend-discovery.md` (Q1–Q150) oraz wywiad blueprint Q151–Q168 (składki). Dokument opisuje docelowy zakres, nie istniejącą implementację. Obecny frontend jest demonstracją z fikcyjnymi danymi.

Ustalenia oznaczone „(założenie)" nie były przedmiotem decyzji użytkownika i wymagają potwierdzenia przed implementacją danego etapu. Dotyczy to całego kalendarza oraz kilku szczegółów w składkach i aktualnościach.

## Problem

Rodzice i wychowawcy klasy szkolnej prowadzą sprawy klasy w grupach komunikatorów: ogłoszenia giną w wątkach, składki liczone są w arkuszach i wiadomościach, dokumenty trzeba odszukiwać w historii czatu, a nowi rodzice nie mają dostępu do wcześniejszych ustaleń. Uczniowie i rodzice spoza grupy nie widzą nawet publicznych informacji klasy. Założyciele takiej grupy nie mają dziś sposobu, aby wiarygodnie potwierdzić, że osoba dołączająca jest dorosłym związanym z klasą.

## Rozwiązanie

Działająca aplikacja klasowa na istniejącym stosie (React, Hono, Cloudflare Workers), w której:

- klasa jest przypisana do konkretnej szkoły podstawowej w Warszawie, roku szkolnego i oznaczenia, a jej założyciel został ręcznie zweryfikowany przez operatora;
- konta mają wyłącznie dorośli, wchodzą przez zaproszenia i mają rolę ustalaną osobno w każdej klasie;
- treści dzielą się na wewnętrzne (dla dorosłych z klasy) i publiczne (dla każdego), a komentarze są zawsze wewnętrzne;
- klasa prowadzi ewidencję składek przypisanych do dzieci bez kont, kalendarz, załączniki i archiwum;
- szkoła ma automatycznie pobierane aktualności, a użytkownicy dostają powiadomienia w aplikacji i e-mailem.

Aplikacja jest bezpłatna. Nie ma kont uczniów, wiadomości prywatnych ani płatności w aplikacji.

## Aktorzy

- Gość — osoba bez konta, w tym uczeń.
- Zgłaszający — dorosły, który zgłosił chęć założenia klasy i nie ma jeszcze zaproszenia.
- Operator — osoba prowadząca serwis; zatwierdza założycieli, nie ingeruje w treści wewnętrzne.
- Założyciel — zweryfikowany dorosły, który utworzył klasę; rodzic albo wychowawca.
- Wychowawca — jeden na klasę, zarządza razem z założycielem.
- Dodatkowy administrator — rodzic z nadanymi uprawnieniami zarządzania.
- Rodzic — zwykły dorosły członek klasy.
- Zarządzający — zbiorczo: założyciel, wychowawca i dodatkowi administratorzy.
- Zalogowany dorosły spoza klasy — może zgłaszać publiczne wpisy.
- System — zadania cykliczne.

## Historyjki użytkownika

### Szkoły i dostęp publiczny

1. Jako gość chcę wybrać szkołę z listy wszystkich działających szkół podstawowych w Warszawie, aby znaleźć swoją klasę.
2. Jako gość chcę zobaczyć listę klas w szkole i publiczne treści wybranej klasy, aby wiedzieć, co się dzieje, bez konta.
3. Jako gość chcę „obserwować klasę" w tej przeglądarce, aby po powrocie od razu trafić do jej publicznego widoku.
4. Jako gość chcę widzieć aktualności szkoły (tytuł, data, fragment, link do źródła) przy jej wyborze, aby mieć główne informacje w jednym miejscu.
5. Jako gość chcę widzieć link do strony aktualności szkoły, gdy automatyczne pobieranie nie działa, aby nie tracić dostępu do informacji.

### Zgłoszenie założyciela i panel operatora

6. Jako zgłaszający chcę wypełnić formularz z imieniem i nazwiskiem, e-mailem, telefonem, rolą (rodzic/wychowawca), szkołą, oznaczeniem klasy, rokiem szkolnym i opisem związku z klasą, aby ubiegać się o założenie klasy.
7. Jako zgłaszający chcę potwierdzić e-mail linkiem, aby zgłoszenie trafiło do rozpatrzenia; potwierdzenie nie tworzy konta.
8. Jako zgłaszający chcę przy próbie zgłoszenia klasy, która już istnieje w tej szkole i roku, otrzymać informację i wskazówkę, jak dołączyć do istniejącej klasy, aby nie tworzyć duplikatu.
9. Jako operator chcę widzieć listę zgłoszeń z potwierdzonym e-mailem oraz ich dane, aby ręcznie sprawdzić związek zgłaszającego z klasą przez szkołę lub wychowawcę.
10. Jako operator chcę zatwierdzić albo odrzucić zgłoszenie, aby kontrolować, kto zakłada klasy.
11. Jako operator chcę, aby zatwierdzenie wysłało zgłaszającemu zaproszenie do utworzenia tej konkretnej klasy, aby założenie było możliwe tylko po weryfikacji.
12. Jako zweryfikowany dorosły z kontem chcę zgłosić kolejną klasę do osobnej akceptacji operatora, aby prowadzić więcej niż jedną klasę.
13. Jako operator chcę zmienić założyciela klasy albo wyznaczyć następcę, gdy założyciel odszedł bez przekazania funkcji, aby klasa nie została bez zarządzającego.
14. Jako operator chcę usunąć wychowawcę z klasy albo odebrać mu rolę, aby rozwiązać sytuację, w której założyciel tego nie zrobi.
15. Jako operator chcę mieć konto operatora utworzone w bezpieczny sposób przy pierwszym wdrożeniu, aby panel nie był dostępny dla nikogo innego.

### Konta

16. Jako zaproszony dorosły chcę założyć konto z e-mailem i hasłem wyłącznie z zaproszenia, aby rejestracja nie była otwarta.
17. Jako użytkownik chcę potwierdzić adres e-mail, logować się i resetować hasło, aby bezpiecznie korzystać z konta.
18. Jako użytkownik chcę należeć do wielu klas z osobną rolą w każdej, aby być wychowawcą w jednej i rodzicem w innej.
19. Jako użytkownik chcę usunąć konto, aby zakończyć korzystanie z serwisu; moje wpisy, komentarze i pliki pozostają z podpisem „Usunięte konto".
20. Jako użytkownik chcę w profilu włączać i wyłączać osobno dzienne podsumowanie e-mail i przypomnienia o składkach, aby kontrolować wysyłkę.
21. Jako założyciel chcę przed usunięciem konta lub opuszczeniem klasy przekazać funkcję następcy, aby klasa pozostała zarządzana; bez następcy system blokuje operację i kieruje do operatora.

### Klasa, zaproszenia i role

22. Jako założyciel chcę utworzyć klasę z zaproszenia operatora, podając szkołę, oznaczenie, rok szkolny, imię i nazwisko wychowawcy oraz własną rolę (rodzic/wychowawca), aby uruchomić przestrzeń klasy.
23. Jako system chcę wymuszać unikalność pary szkoła + rok szkolny + oznaczenie, aby nie było dwóch „5A" w tej samej szkole i roku.
24. Jako zarządzający chcę przenieść klasę na kolejny rok szkolny z nowym oznaczeniem, zachowując członków i historię bez ponownych zaproszeń, aby grupa była ciągła.
25. Jako zarządzający chcę wystawić zaproszenie do wskazanych adresów e-mail z rolą rodzica albo wychowawcy, aby dołączyły tylko konkretne osoby.
26. Jako zaproszony na adres e-mail chcę dołączyć po potwierdzeniu tego adresu bez dodatkowej akceptacji, aby wejść do klasy od razu; link użyty z innego adresu nie daje dostępu.
27. Jako zarządzający chcę wystawić otwarty link z ważnością 1 godzina, 1 dzień, 7 dni albo 30 dni, nadający wyłącznie rolę rodzica, aby szybko zaprosić grupę rodziców.
28. Jako posiadacz otwartego linku chcę zarejestrować dorosłe konto i wejść do klasy bez akceptacji, aby dołączyć w jednym kroku.
29. Jako zarządzający chcę unieważnić zaproszenie przed terminem, aby zablokować dalsze dołączenia; już przyjęci członkowie zostają.
30. Jako założyciel lub wychowawca chcę nadać i odebrać uprawnienia dodatkowego administratora wybranym rodzicom, aby trójka klasowa mogła zarządzać.
31. Jako dodatkowy administrator chcę zapraszać uczestników, zarządzać treściami i usuwać zwykłych rodziców, aby wspierać zarządzanie; nie mogę usuwać innych administratorów, wychowawcy ani założyciela.
32. Jako założyciel lub wychowawca chcę usuwać uczestników, aby porządkować skład klasy; usunięty może wrócić przez dowolne ważne zaproszenie.
33. Jako wychowawca nie mogę usunąć założyciela ani odebrać mu uprawnień, aby założyciel pozostał chroniony.
34. Jako założyciel chcę przekazać funkcję wybranemu dorosłemu z klasy, który musi ją przyjąć, aby przekazanie było świadome po obu stronach.
35. Jako założyciel lub operator chcę zmienić wychowawcę przez zaproszenie następcy na e-mail, aby przy przyjęciu zaproszenia następca przejął rolę, a poprzedni wychowawca stracił członkostwo w tej klasie.
36. Jako system chcę wymusić, aby wychowawca będący jednocześnie założycielem najpierw przekazał funkcję założyciela, aby zmiana wychowawcy nie pozbawiła klasy założyciela.
37. Jako założyciel lub operator chcę usunąć wychowawcę albo odebrać mu rolę, aby reagować na zmiany w szkole; dodatkowi administratorzy nie mają tej możliwości.
38. Jako członek chcę widzieć listę uczestników z imieniem, nazwiskiem i rolą, bez e-maili i telefonów, aby wiedzieć, kto jest w klasie.
39. Jako członek chcę widzieć oznaczenie „Wychowawca jeszcze nie dołączył" z imieniem i nazwiskiem wpisanym przez założyciela, dopóki wychowawca nie przyjmie zaproszenia.
40. Jako rodzic chcę opuścić klasę, aby zakończyć udział; moje wcześniejsze treści zostają z moim podpisem.

### Wpisy, komentarze i załączniki

41. Jako członek chcę tworzyć wpisy z domyślną widocznością wewnętrzną, aby dzielić się informacjami z dorosłymi w klasie.
42. Jako zarządzający chcę przy tworzeniu lub edycji wpisu wybrać widoczność publiczną, aby informować uczniów i rodziców spoza klasy; zwykły rodzic nie widzi tej opcji.
43. Jako autor chcę przy upublicznieniu potwierdzić, że załączniki także staną się publiczne, aby świadomie udostępniać pliki.
44. Jako autor chcę zmienić widoczność wpisu w obie strony, aby korygować zasięg; zmiana na wewnętrzny zamyka publiczny dostęp do wpisu i plików.
45. Jako gość chcę widzieć publiczne wpisy podpisane nazwą klasy, bez danych autora i bez komentarzy, aby czytać informacje bez konta.
46. Jako członek chcę komentować wpisy, także publiczne, aby prowadzić dyskusję; komentarze są zawsze wewnętrzne i interfejs to oznacza.
47. Jako autor chcę edytować i usuwać własne wpisy i komentarze, dopóki należę do aktywnej klasy, aby poprawiać treści.
48. Jako autor chcę przed usunięciem wpisu potwierdzić, że usunie to całą dyskusję i załączniki, aby uniknąć pomyłki.
49. Jako zarządzający chcę ukrywać i usuwać cudze wpisy i komentarze bez edycji ich treści, aby moderować klasę.
50. Jako autor chcę dodać do wpisu do 5 załączników JPEG, PNG, WebP lub PDF po maksymalnie 10 MB, aby udostępniać zgody, listy i zdjęcia.
51. Jako system chcę, aby załączniki dziedziczyły widoczność wpisu także przy otwarciu bezpośredniego adresu pliku, aby wewnętrzne pliki nie wyciekały.
52. Jako zalogowany dorosły, także spoza klasy, chcę zgłosić publiczny wpis, aby zarządzający mogli zareagować; gość nie może zgłaszać.
53. Jako zarządzający chcę otrzymać zgłoszenie w dzwoneczku i ukryć wpis albo odrzucić zgłoszenie, aby moderacja pozostała w klasie; zgłoszenie nie ukrywa wpisu automatycznie.

### Kalendarz (założenia do potwierdzenia)

54. Jako członek chcę dodać wydarzenie z datą, opcjonalną godziną, tytułem i krótkim opisem lub miejscem, aby klasa znała terminy. (założenie: te same reguły uprawnień i widoczności co dla wpisów)
55. Jako zarządzający chcę oznaczyć wydarzenie jako publiczne, aby uczniowie i rodzice spoza klasy widzieli np. wycieczkę; wydarzenia wewnętrzne, np. zebranie rodziców, widzą tylko dorośli z klasy. (założenie)
56. Jako członek chcę widzieć nadchodzące wydarzenia na tablicy klasy i pełną listę w kalendarzu, aby planować. (założenie)
57. Jako gość chcę widzieć publiczne wydarzenia klasy w jej publicznym widoku. (założenie)
58. Jako autor wydarzenia chcę je edytować i usuwać na zasadach wpisów, a zarządzający ukrywać i usuwać cudze. (założenie)
59. Jako członek chcę, aby nowe wydarzenia trafiały do dzwoneczka i dziennego podsumowania jak wpisy. (założenie)

### Składki

60. Jako rodzic chcę w profilu wybrać klasę i dziecko z listy dzieci tej klasy albo dodać brakujące dziecko (imię i nazwisko), aby mieć dostęp do jego rozliczeń od razu, bez potwierdzania.
61. Jako drugi rodzic chcę wybrać tę samą pozycję dziecka, aby oboje widzieć jedno rozliczenie i nie płacić podwójnie.
62. Jako zarządzający chcę dodać dziecko do listy klasy i bezpośrednio przypisać do niego konta rodziców, aby uzupełnić listę za rodziców.
63. Jako zarządzający chcę utworzyć zbiórkę z tytułem, opisem, wspólną kwotą na dziecko i opcjonalnym terminem, obejmującą domyślnie wszystkie dzieci klasy albo wybraną część, aby ewidencjonować wpłaty na wycieczkę, prezenty czy fundusz klasowy.
64. Jako zarządzający chcę indywidualnie zmienić kwotę albo zwolnić dziecko ze składki, aby uwzględnić wyjątki.
65. Jako zarządzający chcę odnotować wpłatę otrzymaną poza aplikacją (kwota, data, opcjonalna notatka), także częściową i kilkukrotną, aby rozliczenie pokazywało sumę wpłaconą i kwotę pozostałą.
66. Jako zarządzający chcę skorygować albo anulować błędną wpłatę z zachowaniem historii (kto, kiedy, co zmienił), aby rozliczenie było wiarygodne.
67. Jako zarządzający chcę dopisać dziecko dodane po utworzeniu zbiórki do wybranych zbiórek, aby nie naliczać składek automatycznie wstecz.
68. Jako rodzic chcę widzieć rozliczenia tylko swoich dzieci: kwotę należną, wpłaconą, pozostałą i oznaczenie zaległości po terminie.
69. Jako zarządzający chcę widzieć rozliczenia wszystkich dzieci w klasie, aby prowadzić zbiórkę.
70. Jako członek bez przypisanego dziecka chcę widzieć tylko zbiorczy postęp zbiórki (zebrano/cel), aby znać stan bez danych innych rodzin.
71. Jako rodzic przypisany do dziecka chcę otrzymać e-mail 3 dni przed terminem i 3 dni po terminie, tylko gdy pozostaje kwota do zapłaty, aby nie przegapić składki.
72. Jako rodzic chcę wyłączyć e-mailowe przypomnienia o składkach niezależnie od dziennego podsumowania, aby ograniczyć wiadomości.
73. Jako zarządzający chcę zakończyć zbiórkę, aby nie pojawiała się jako aktywna; historia i rozliczenie pozostają do odczytu. (założenie)

### Aktualności szkoły

74. Jako system chcę co 2–3 dni pobierać aktualności ze strony każdej szkoły, w której zatwierdzono co najmniej jedną klasę, aby gość widział aktualne informacje.
75. Jako system chcę zapisywać tytuł, datę, krótki fragment i link do pełnej wiadomości oraz wykrywać duplikaty, aby lista była czytelna.
76. Jako system chcę przy nieobsługiwanej stronie zapisać tylko link do aktualności szkoły i nie blokować klasy, aby awaria źródła nie psuła działania.
77. Jako operator chcę przypisać szkole adres strony aktualności albo oznaczyć źródło jako nieobsługiwane, aby sterować integracją bez zmian w kodzie. (założenie)

### Powiadomienia

78. Jako członek chcę po zalogowaniu widzieć w dzwoneczku nowe wpisy i komentarze z moich klas oraz sprawy wymagające działania (zgłoszenia, zaproszenie wychowawcy, przekazanie funkcji), zgodnie z moimi uprawnieniami.
79. Jako członek chcę oznaczać powiadomienia jako przeczytane, aby dzwoneczek pokazywał tylko nowe.
80. Jako członek chcę otrzymywać codzienne podsumowanie e-mail z tytułami i fragmentami nowych wpisów, także wewnętrznych, bez komentarzy, i móc je wyłączyć.
81. Jako system chcę wysyłać e-maile potwierdzenia adresu, resetu hasła, zaproszeń, decyzji o zgłoszeniu, przypomnień o składkach i przypomnienia o usunięciu archiwum.
82. Jako system chcę nie wysyłać podsumowań ani przypomnień osobom, które utraciły członkostwo przed wysyłką.

### Archiwum

83. Jako zarządzający chcę zarchiwizować klasę po ukończeniu szkoły, aby zakończyć publikowanie i zapraszanie; członkowie czytają historię.
84. Jako system chcę przy archiwizacji zamknąć publiczny dostęp do treści zewnętrznych i ich plików.
85. Jako zarządzający chcę wyeksportować archiwum z wpisami, komentarzami, plikami i rozliczeniami składek, aby zachować historię klasy.
86. Jako zarządzający chcę 30 dni przed usunięciem archiwum dostać e-mail z datą usunięcia i linkiem do eksportu wymagającym zalogowania.
87. Jako system chcę po 3 latach od archiwizacji usunąć klasę, wpisy, komentarze, załączniki i rozliczenia, aby dotrzymać retencji.

### Bezpieczeństwo dostępu (przekrojowe)

88. Jako system chcę przy każdym żądaniu sprawdzać serwerowo sesję, członkostwo i rolę w danej klasie, aby ukrycie elementu w interfejsie nigdy nie było jedyną barierą.
89. Jako system chcę nigdy nie zwracać osobom spoza klasy komentarzy, wpisów wewnętrznych, danych autorów, listy uczestników, listy dzieci ani rozliczeń.
90. Jako system chcę rejestrować zmiany członkostw, ról, decyzje operatora i korekty wpłat, aby można było odtworzyć, kto co zmienił.

## Decyzje implementacyjne

### Moduły

Backend Hono dzieli się na moduły z wąskimi interfejsami. Każdy z nich jest testowalny bez pozostałych.

| Moduł | Odpowiedzialność | Interfejs |
|---|---|---|
| Dostęp | Sesje, hasła, zaproszenia, członkostwa, jedna funkcja sprawdzająca uprawnienie aktora do akcji na zasobie | `can(aktor, akcja, zasób)`, wystawienie i realizacja zaproszenia |
| Szkoły i klasy | Katalog szkół, zgłoszenia, panel operatora, unikalność klas, przenoszenie roczników, role i przekazywanie funkcji | Cykl życia klasy i członkostw |
| Treści | Wpisy, wydarzenia (wpis z datą), komentarze, widoczność, ukrywanie, zgłoszenia publiczne | Publikacja, zmiana widoczności, moderacja |
| Pliki | Przyjmowanie, walidacja typu i rozmiaru, przechowywanie w R2, wydawanie plików wyłącznie przez backend z kontrolą widoczności | Wgraj, pobierz, unieważnij publiczny dostęp |
| Składki | Dzieci klasy, powiązania rodzic–dziecko, zbiórki, dziennik wpłat i korekt tylko-dopisywany, obliczanie sald | Utwórz zbiórkę, zapisz wpłatę, saldo dziecka/zbiórki |
| Aktualności | Adaptery pobierania (RSS, HTML), deduplikacja, fallback do linku | Pobierz dla szkoły, lista dla gościa |
| Powiadomienia | Zdarzenia domenowe → dzwoneczek, kolejka e-maili, podsumowania, przypomnienia | Publikuj zdarzenie, wyślij zaplanowane |
| Archiwum | Archiwizacja, eksport, przypomnienie, usuwanie po retencji | Archiwizuj, eksportuj, wyczyść |

Moduły głębokie, na które warto poświęcić testy przed resztą: Dostęp (wszystkie inne moduły pytają tylko `can`), Składki (dziennik zdarzeń z korektami, z którego wynika każde saldo) i Pliki (jedyny punkt wydawania obiektów z R2).

### Granice i przepływy

- Jeden Worker serwuje frontend i API na wspólnym originie, jak dziś.
- Dane relacyjne w Cloudflare D1; pliki w prywatnym R2, dostępne wyłącznie przez endpoint backendu sprawdzający widoczność wpisu. Publiczne pliki mogą być cache'owane; zmiana widoczności na wewnętrzną unieważnia dostęp.
- Zadania cykliczne (pobieranie aktualności, dzienne podsumowanie, przypomnienia o składkach, przypomnienie i usuwanie archiwum) uruchamia harmonogram Cloudflare Cron Triggers.
- E-maile idą przez zewnętrznego dostawcę z własnej domeny nadawczej; wybór dostawcy jest otwarty (patrz „Uwagi").
- Uwierzytelnianie: e-mail i hasło, hasła haszowane, sesja w ciasteczku HttpOnly. Rejestracja wyłącznie z ważnego tokenu zaproszenia.
- Tokeny zaproszeń, potwierdzeń i resetu są jednorazowe lub czasowe; przechowywany jest tylko skrót tokenu.
- Publiczne endpointy zwracają wyłącznie projekcję danych: nazwa klasy jako autor, brak komentarzy, brak identyfikatorów osób.
- Usunięcie konta odpina treści od profilu (podpis „Usunięte konto"), nie kasuje treści.
- Składki są ewidencją: kwota należna per dziecko, wpłaty i korekty jako niezmienne wpisy dziennika, saldo wyliczane z dziennika.
- Wydarzenia kalendarza są typem wpisu z datą i godziną; dziedziczą reguły widoczności i uprawnień wpisów. (założenie)
- Frontend odróżnia działającą aplikację od demo: demo pozostaje na landing page z oznaczeniem, a widok „Uczeń" zostaje zastąpiony publicznym widokiem gościa. Zakładka „Rozmowy rodziców" znika, jej rolę pełnią wpisy wewnętrzne z komentarzami.

## Założenia

- Skala: pilotaż do 10 klas i około 300 dorosłych w pierwszych trzech miesiącach; limity D1 i R2 na darmowym lub najniższym planie są wystarczające.
- Lista szkół: istnieje publiczne źródło listy szkół podstawowych w Warszawie z trwałymi identyfikatorami i adresami stron; do potwierdzenia w pierwszym etapie.
- Strony szkół: część udostępnia RSS albo powtarzalny HTML; dla pozostałych wystarczy sam link. Korzystanie z tytułów, dat i krótkich fragmentów mieści się w dozwolonym użytku; do sprawdzenia przed uruchomieniem pobierania.
- Weryfikacja: operator jest w stanie ręcznie potwierdzić związek zgłaszającego z klasą w czasie akceptowalnym dla użytkownika; zgłoszeń jest kilkadziesiąt w pilotażu.
- Ryzyko przyjęte przez użytkownika: otwarty link może trafić do dziecka lub osoby spoza klasy; rodzic z klasy może przypisać sobie cudze dziecko w składkach. Interfejs nie przedstawia tych mechanizmów jako weryfikacji.
- Prawne: dane osobowe dorosłych i imiona dzieci są przetwarzane w UE; regulamin i polityka prywatności powstaną przed uruchomieniem; sposób obsługi żądań usunięcia danych nie jest rozstrzygnięty tym dokumentem.
- E-mail: dostawca pozwala wysyłać z własnej domeny z SPF/DKIM/DMARC i mieści się w budżecie, który dopiero zostanie oszacowany.
- Kalendarz: reguły identyczne z wpisami wystarczą; brak powtarzalności wydarzeń, przypomnień i eksportu do kalendarzy zewnętrznych w pilotażu.
- Brak AI: żadna funkcja nie generuje treści ani nie rozmawia z użytkownikiem; obowiązki przejrzystości z art. 50 AI Act nie mają zastosowania, dopóki to się nie zmieni.

## Rozważone alternatywy

- Konta uczniów z akceptacją zgłoszeń i powiązaniem z rodzicem — odrzucone, bo nie da się odróżnić dziecka od dorosłego bez danych wrażliwych; zastąpione publicznym widokiem gościa.
- Przygotowanie klasy przed weryfikacją założyciela — odrzucone, bo tworzyłoby klasy bez potwierdzenia.
- Wyłącznie zaproszenia na konkretne e-maile — odrzucone, bo utrudnia szybkie zaproszenie całej grupy; dodano otwarty link z terminem.
- Wspólny link z późniejszą akceptacją każdego rodzica — odrzucone, bo mnoży ręczną pracę zarządzających.
- Dostęp operatora do zgłoszonych treści wewnętrznych — odrzucone, bo moderacja wewnętrzna ma zostać w klasie.
- Zgłaszanie wpisów przez osoby bez konta — odrzucone, bo umożliwia anonimowe zalewanie zgłoszeniami.
- Wiadomości prywatne i osobny czat — odrzucone, bo wpisy wewnętrzne z komentarzami pokrywają potrzebę, a czat wymaga innej moderacji.
- Płatności w aplikacji — odrzucone, bo wymagają odbiorcy środków, prowizji i zwrotów; składki są tylko ewidencją.
- Osobna rola skarbnika — odrzucone, bo wystarczą uprawnienia zarządzających.
- Składka przypisana do konta rodzica — odrzucone, bo dwoje rodziców jednego dziecka płaciłoby podwójnie.
- Zatwierdzanie powiązania rodzic–dziecko przez zarządzającego — odrzucone przez użytkownika na rzecz samodzielnego wyboru z listy; ryzyko przyjęte.
- Rozliczenia wszystkich dzieci widoczne dla wszystkich rodziców — odrzucone ze względu na prywatność rodzin.
- Edycja wpłat bez historii — odrzucone, bo rozliczenie musi być audytowalne.
- Przypomnienia o składkach tylko w aplikacji — odrzucone, użytkownik wybrał także e-mail.
- Harmonogram przypomnień ustalany per zbiórka — odrzucone na rzecz stałych 3 dni przed i po terminie.
- Obowiązkowe przypomnienia o składkach — odrzucone, rodzic może je wyłączyć.
- Automatyczne dopisanie nowego dziecka do otwartych zbiórek — odrzucone, zarządzający dopisuje ręcznie.
- Streszczenia aktualności szkolnych generowane przez AI — poza zakresem; „fragment" jest wycinkiem źródła.
- Neon PostgreSQL zamiast D1 — odłożone; D1 wystarcza dla pilotażu, Neon wraca tylko przy konkretnym braku.

## Strategia walidacji

Ogólne kryteria „gotowe": `npm run build` przechodzi; testy modułów backendu uruchamiane jednym poleceniem w CI; testy przeglądarkowe Playwright (rozszerzenie `scripts/check-ui.py`) obejmują ścieżki poniżej; żaden endpoint nie zwraca danych wewnętrznych bez sesji i członkostwa, co potwierdza automatyczny test negatywny dla każdego endpointu wewnętrznego.

| Historyjki | Weryfikacja |
|---|---|
| 1–3 | Test integracyjny: gość pobiera listę szkół, klasy szkoły i publiczne wpisy klasy; test przeglądarkowy: „obserwuj klasę" przetrwa odświeżenie strony, a wyczyszczenie pamięci je usuwa. |
| 4–5, 74–77 | Test adaptera na zapisanych próbkach RSS i HTML dwóch szkół; test fallbacku dla nieobsługiwanej strony zwraca sam link; artefakt: wpisy aktualności w D1 po ręcznym uruchomieniu zadania cyklicznego; drugie uruchomienie nie tworzy duplikatów. |
| 6–8 | Test integracyjny formularza: brak telefonu odrzucony; zgłoszenie bez potwierdzenia e-maila nie jest widoczne dla operatora; zgłoszenie duplikatu klasy zwraca wskazanie istniejącej klasy zamiast utworzenia. |
| 9–12 | Test panelu operatora: zatwierdzenie tworzy zaproszenie założycielskie i wysyła e-mail (sprawdzane w skrzynce testowej dostawcy); odrzucenie nie tworzy zaproszenia; druga klasa tej samej osoby wymaga nowej akceptacji. |
| 13–15 | Test: operator wyznacza następcę założyciela; test: operator odbiera rolę wychowawcy; procedura bootstrapu operatora opisana w README i sprawdzona na świeżej bazie lokalnej. |
| 16–18 | Test: rejestracja bez tokenu zwraca 403; z tokenem tworzy konto, wymaga potwierdzenia e-maila; reset hasła unieważnia stary; jedno konto z rolą wychowawcy w klasie A i rodzica w klasie B ma różne uprawnienia w każdej. |
| 19–21 | Test: po usunięciu konta wpisy mają podpis „Usunięte konto", a publicznie nazwę klasy; założyciel bez następcy nie może usunąć konta ani opuścić klasy. |
| 22–24 | Test: utworzenie klasy tylko z ważnego zaproszenia założycielskiego; druga klasa o tym samym oznaczeniu w tej szkole i roku odrzucona; przeniesienie na kolejny rok zachowuje członkostwa i wpisy. |
| 25–29 | Test: link e-mailowy użyty z innego adresu odrzucony; otwarty link po terminie odrzucony; otwarty link nadaje tylko rolę rodzica; unieważnienie blokuje kolejne dołączenia, nie usuwa członków. |
| 30–37 | Tabela uprawnień testowana automatycznie dla każdej pary rola × akcja (nadanie/odebranie admina, usunięcie rodzica, admina, wychowawcy, założyciela, przekazanie funkcji, zmiana wychowawcy); wychowawca-założyciel nie może być zastąpiony przed przekazaniem funkcji. |
| 38–40 | Test: odpowiedź listy uczestników nie zawiera pól e-mail i telefon; oznaczenie brakującego wychowawcy znika po przyjęciu zaproszenia; po opuszczeniu klasy dawny członek dostaje 403 na treści wewnętrzne. |
| 41–45 | Test: rodzic nie może ustawić widoczności publicznej (400/403); domyślna widoczność wewnętrzna; gość widzi publiczny wpis z autorem „Klasa 5A" i bez komentarzy; po zmianie na wewnętrzny gość dostaje 404. |
| 46–49 | Test: komentarz pod publicznym wpisem niewidoczny dla gościa; edycja cudzego wpisu przez zarządzającego odrzucona, ukrycie i usunięcie dozwolone; usunięcie wpisu usuwa komentarze i pliki (obiekt w R2 znika). |
| 50–51 | Test: szósty plik, 11 MB, typ SVG odrzucone; bezpośredni adres pliku wewnętrznego bez sesji zwraca 403; po upublicznieniu wpisu ten sam adres działa dla gościa. |
| 52–53 | Test: gość nie może zgłosić; zalogowany spoza klasy może; zgłoszenie tworzy powiadomienie zarządzającym; wpis pozostaje widoczny do decyzji. |
| 54–59 | Test: wydarzenie wewnętrzne niewidoczne dla gościa, publiczne widoczne; lista nadchodzących na tablicy posortowana po dacie; test przeglądarkowy zakładki kalendarza. |
| 60–62 | Test: dwoje rodziców wybiera to samo dziecko i widzi jedno rozliczenie; nowe dziecko dodane przez rodzica pojawia się na liście klasy; zarządzający przypisuje rodzica bez udziału rodzica. |
| 63–64, 67 | Test jednostkowy modułu składek: kwota wspólna, indywidualna zmiana, zwolnienie, wybór części dzieci, dopisanie dziecka po utworzeniu; zbiórka bez terminu nie oznacza zaległości. |
| 65–66 | Test: dwie wpłaty częściowe sumują się; korekta tworzy nowy wpis dziennika i zachowuje poprzedni; saldo po anulowaniu wraca do stanu sprzed wpłaty; dziennik zawiera autora i czas każdej zmiany. |
| 68–70 | Test: rodzic dostaje 403 na rozliczenie cudzego dziecka; zarządzający widzi wszystkie; członek bez dziecka widzi tylko sumę zebraną i cel. |
| 71–72 | Test zadania cyklicznego na zamrożonym czasie: e-mail 3 dni przed i 3 dni po terminie tylko przy niezerowym saldzie; po wyłączeniu w profilu brak e-maila, podsumowanie dzienne nadal wychodzi. |
| 73 | Test: zakończona zbiórka nie przyjmuje wpłat i nie jest na liście aktywnych. |
| 78–82 | Test: komentarz trafia do dzwoneczka, nie do podsumowania; podsumowanie zawiera tytuł i fragment wpisu wewnętrznego bez pełnej treści; oznaczenie jako przeczytane zmniejsza licznik; usunięty członek nie dostaje podsumowania. |
| 83–87 | Test: po archiwizacji publikacja i zaproszenia zwracają 403, gość dostaje 404 na dawne publiczne treści; eksport zawiera wpisy, komentarze, pliki i rozliczenia; zadanie cykliczne na zamrożonym czasie wysyła e-mail 30 dni przed i usuwa klasę po 3 latach (obiekty R2 znikają). |
| 88–90 | Test negatywny każdego endpointu wewnętrznego bez sesji, z sesją spoza klasy i z rolą bez uprawnień; artefakt: wpis w dzienniku zmian po każdej zmianie roli, członkostwa, decyzji operatora i korekcie wpłaty. |

Progi jakości: brak endpointu wewnętrznego bez testu negatywnego; czas odpowiedzi API poniżej 500 ms dla listy wpisów klasy na danych pilotażu; zadania cykliczne idempotentne (podwójne uruchomienie nie duplikuje e-maili ani aktualności).

## Poza zakresem

- Konta i członkostwa uczniów, powiązania dziecko–rodzic jako mechanizm dostępu.
- Wiadomości prywatne, czat, reakcje, ankiety.
- Płatności w aplikacji, abonamenty, faktury.
- Automatyczne ukrywanie wpisów po zgłoszeniu; interwencje operatora w treści wewnętrzne.
- Kilku wychowawców w jednej klasie; edycja cudzych treści.
- Streszczenia aktualności lub inne funkcje generatywne AI.
- Synchronizacja „obserwuj klasę" między urządzeniami.
- Szkoły spoza Warszawy i inne niż podstawowe.
- Aplikacje mobilne i powiadomienia push.
- Powtarzalne wydarzenia, przypomnienia o wydarzeniach i eksport do kalendarzy zewnętrznych.

## Uwagi

### Do potwierdzenia przed danym etapem

- Kalendarz (historyjki 54–59): uprawnienia jak przy wpisach, publiczne wydarzenia tylko od zarządzających, brak powtarzalności. Alternatywa: wydarzenia tworzą wyłącznie zarządzający.
- Zakończenie zbiórki (73) i przypisanie strony aktualności przez operatora (77).
- Eksport archiwum obejmuje rozliczenia składek (85); w discovery mowa była o wpisach, komentarzach i plikach.

### Otwarte kwestie z discovery (bez zmian)

- Źródło listy szkół i mapowanie stron aktualności; zasady korzystania z materiałów szkół.
- Dostawca e-maili i szacunek kosztów pilotażu.
- Ważność zaproszeń e-mailowych, linków potwierdzeń i resetu; obsługa istniejących kont i wielu zaproszeń.
- Proces prośby o dołączenie przy duplikacie klasy.
- Bootstrap i uprawnienia operatora.
- Regulamin, polityka prywatności, obsługa żądań usunięcia danych, retencja odrzuconych zgłoszeń, kopie zapasowe i logi.
- Cofanie ukrycia wpisu i dostęp do ukrytych dyskusji.
- Format eksportu i wygaśnięcie pliku eksportu.
- Godzina wysyłki podsumowania i deduplikacja powiadomień.
- Zmiana oznaczenia klasy, koniec szkoły i konflikt unikalności przy przenoszeniu rocznika; dorosły będący rodzicem i wychowawcą w tej samej klasie.

### Rozbieżności z obecnym demo

- Przełącznik „Rodzic / Uczeń" i teksty „rodzice i uczniowie razem" sugerują konta uczniów; docelowo widok ucznia to widok publiczny gościa.
- Zakładka „Rozmowy rodziców" nie ma odpowiednika; komunikacja idzie przez wpisy wewnętrzne i komentarze.
- Formularz „Stwórz klasę" tworzy klasę natychmiast; docelowo prowadzi do formularza zgłoszenia i weryfikacji operatora.
- Demo składek pokazuje wspólny postęp; docelowo rodzic widzi rozliczenie swoich dzieci.

### Następny krok

Podział na pionowe etapy implementacji (każdy etap dostarcza działającą ścieżkę od interfejsu do D1/R2 z testami dostępu), począwszy od modułu Dostęp, zgłoszenia założyciela i utworzenia pierwszej klasy z wewnętrznymi wpisami.
