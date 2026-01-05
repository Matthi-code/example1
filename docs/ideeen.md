# Ideeën

Alle nieuwe ideeën worden hier verzameld.

> **Workflow:** Bij elk idee wordt altijd een voorstel gemaakt + eventueel een alternatief.

---

## Template

### [Datum] - [Titel]
**Status:** Nieuw | In analyse | Voorgesteld | Goedgekeurd | Afgewezen

**Beschrijving:**
[Beschrijving van het idee]

**Analyse:**
[Wordt ingevuld na analyse]

---

## Ideeën

### 2026-01-05 - Contact pagina
**Status:** Goedgekeurd

**Beschrijving:**
Een nieuwe Contact pagina toevoegen met een link vanuit de startpagina.

**Analyse:**
- Nieuwe bestanden:
  - `src/pages/Contact.tsx` - Contact pagina component
  - `src/pages/Home.tsx` - Huidige App inhoud verplaatsen
- Aan te passen:
  - `src/App.tsx` - React Router toevoegen voor navigatie
  - `src/App.css` - Styling voor navigatie link
- Dependencies:
  - `react-router-dom` installeren voor routing

**Voorstel:**
1. React Router installeren
2. Home pagina maken (huidige inhoud)
3. Contact pagina maken
4. Link "Contact" toevoegen op startpagina
5. Routing configureren in App.tsx

**Vraag:**
Goedkeuren om te implementeren en deployen naar GitHub/Vercel?
- [x] Ja, goedgekeurd
- [ ] Nee, afgewezen
- [ ] Aanpassen (geef feedback)

**Besluit:** Goedgekeurd op 2026-01-05 → Verplaatst naar wijzigingen.md

---

### 2026-01-05 - Intertoys Look & Feel
**Status:** Goedgekeurd (Voorstel B)

**Beschrijving:**
De stylesheet aanpassen zodat de app lijkt op de Intertoys website stijl.

**Analyse:**
Intertoys kenmerken (speelgoedwinkel):
- Hoofdkleuren: Rood (#E31937), Geel (#FFD100), Wit
- Speelse, kindvriendelijke uitstraling
- Ronde hoeken op buttons en cards
- Grote, duidelijke fonts
- Vrolijke, uitnodigende sfeer

**Voorstel A (Aanbevolen):**
Volledige Intertoys-stijl toepassen:
- Rood als primaire kleur (#E31937)
- Geel als accent kleur (#FFD100)
- Witte achtergrond
- Ronde buttons met rode achtergrond
- Speels font (bijv. Nunito of Poppins)
- Grote hover effecten

**Voorstel B (Alternatief):**
Subtiele Intertoys-inspiratie:
- Huidige layout behouden
- Alleen kleuren aanpassen naar rood/geel thema
- Minimale font wijzigingen
- Minder ingrijpend, sneller te implementeren

**Vraag:**
Welk voorstel heeft je voorkeur?
- [ ] Voorstel A - Volledige Intertoys-stijl
- [x] Voorstel B - Subtiele kleur aanpassing
- [ ] Afgewezen
- [ ] Aanpassen (geef feedback)

**Besluit:** Voorstel B goedgekeurd op 2026-01-05 → Verplaatst naar wijzigingen.md

---

### 2026-01-05 - Navigatiemenu met Producten pagina
**Status:** Goedgekeurd (Voorstel A)

**Beschrijving:**
Een navigatiemenu aanmaken met links naar Home, Contact en een nieuwe Producten pagina.

**Analyse:**
- Nieuwe bestanden:
  - `src/components/Menu.tsx` - Herbruikbaar menu component
  - `src/pages/Products.tsx` - Nieuwe producten pagina
- Aan te passen:
  - `src/App.tsx` - Route toevoegen voor producten
  - `src/App.css` - Menu styling
  - `src/pages/Home.tsx` - Losse link verwijderen, menu toevoegen
  - `src/pages/Contact.tsx` - Losse link verwijderen, menu toevoegen

**Voorstel A (Aanbevolen):**
Horizontaal menu bovenaan elke pagina:
- Vaste header met menu op alle pagina's
- Links: Home | Producten | Contact
- Intertoys-stijl (rood/geel kleuren)
- Actieve pagina gemarkeerd
- Responsive (hamburger menu op mobiel)

**Voorstel B (Alternatief):**
Simpel menu zonder header:
- Menu direct in elke pagina component
- Geen aparte header
- Basis styling
- Sneller te implementeren, minder responsive

**Vraag:**
Welk voorstel heeft je voorkeur?
- [x] Voorstel A - Horizontaal menu met header (Aanbevolen)
- [ ] Voorstel B - Simpel menu zonder header
- [ ] Afgewezen
- [ ] Aanpassen (geef feedback)

**Besluit:** Voorstel A goedgekeurd op 2026-01-05 → Verplaatst naar wijzigingen.md
