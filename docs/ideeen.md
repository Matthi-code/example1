# Ideeën

Alle nieuwe ideeën worden hier verzameld.

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
