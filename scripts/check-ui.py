from pathlib import Path
from playwright.sync_api import sync_playwright, expect

out = Path('test-results')
out.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1050}, device_scale_factor=1)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    expect(page.get_by_text('Mała wyprawa, wielka przygoda!', exact=True)).to_be_visible()
    page.screenshot(path=str(out / 'desktop.png'), full_page=True)
    panel = page.get_by_role('navigation', name='Panel klasy')
    panel.get_by_role('button', name='Rozmowy rodziców').click()
    page.get_by_role('textbox', name='Wiadomość do rodziców').fill('Sprawdzona wiadomość demo')
    page.get_by_role('button', name='Wyślij wiadomość demonstracyjną').click()
    expect(page.get_by_text('Sprawdzona wiadomość demo', exact=True)).to_be_visible()
    page.get_by_role('button', name='Uczeń', exact=True).click()
    expect(panel.get_by_role('button', name='Rozmowy rodziców')).to_have_count(0)
    expect(panel.get_by_role('button', name='Składki', exact=True)).to_have_count(0)
    expect(page.get_by_text('Sprawdzona wiadomość demo', exact=True)).to_have_count(0)
    expect(page.get_by_text('Cześć, Alu!', exact=False)).to_be_visible()
    panel.get_by_role('button', name='Dokumenty', exact=True).click()
    expect(page.get_by_role('button', name='Dodaj dokument')).to_have_count(0)
    with page.expect_download() as download:
        page.get_by_role('button', name='Pobierz Lista rzeczy na wycieczkę.txt').click()
    assert download.value.suggested_filename == 'Lista rzeczy na wycieczkę.txt'
    page.get_by_role('button', name='Rodzic', exact=True).click()
    page.locator('input[type=file]').set_input_files({ 'name': 'test.txt', 'mimeType': 'text/plain', 'buffer': b'Local demo attachment' })
    expect(page.get_by_text('test.txt', exact=True)).to_be_visible()
    page.get_by_role('button', name='Uczeń', exact=True).click()
    expect(page.get_by_text('test.txt', exact=True)).to_be_visible()
    panel.get_by_role('button', name='Kalendarz', exact=True).click()
    expect(page.locator('.calendar-event')).to_have_count(2)
    page.get_by_role('button', name='Rodzic', exact=True).click()
    expect(page.locator('.calendar-event')).to_have_count(3)
    page.get_by_role('button', name='Stwórz klasę', exact=True).click()
    expect(page.get_by_role('dialog')).to_be_visible()
    page.get_by_label('Nazwa klasy', exact=True).fill('Klasa 5A')
    page.get_by_label('Nazwa szkoły', exact=True).fill('Szkoła testowa')
    page.get_by_role('button', name='Otwórz moją klasę w demo').click()
    expect(page.get_by_role('dialog')).to_have_count(0)
    expect(page.locator('.class-selector strong')).to_have_text('Klasa 5A')
    panel.get_by_role('button', name='Tablica klasy').click()
    page.get_by_role('button', name='Oznacz jako przeczytane').first.click()
    expect(page.get_by_role('button', name='Przeczytane', exact=True)).to_have_attribute('aria-pressed', 'true')
    assert page.request.get('http://localhost:5173/api/health').json()['status'] == 'ok'
    assert page.request.get('http://localhost:5173/api/missing').status == 404
    for width in [390, 768, 1280]:
        page.set_viewport_size({"width": width, "height": 900})
        page.evaluate('window.scrollTo(0,0)')
        page.wait_for_timeout(300)
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), f'Overflow at {width}'
        if width == 390:
            page.get_by_role('button', name='Otwórz menu', exact=True).click()
            expect(page.get_by_role('navigation', name='Nawigacja główna')).to_be_visible()
            page.get_by_role('button', name='Zamknij menu', exact=True).click()
            page.screenshot(path=str(out / 'mobile.png'), full_page=True)
    page.emulate_media(reduced_motion='reduce')
    assert page.locator('.floating-card').first.evaluate('(el) => getComputedStyle(el).animationName') == 'none'
    assert not errors, errors
    browser.close()
    print('PASS: desktop/mobile, parent/student, messages, attachments, downloads, calendar, class dialog, read state, API, reduced motion; no browser errors.')
