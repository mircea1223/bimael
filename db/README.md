# Baza de date Bimael

Directorul conține schema PostgreSQL propusă pentru modular monolith și un seed minim, idempotent.

## Starea integrării

Aplicația locală folosește momentan adaptorul demo din browser și nu citește această bază de date. Persistența PostgreSQL va deveni activă după implementarea unui adaptor server-side și configurarea variabilei `DATABASE_URL` în acel runtime.

`DATABASE_URL` este un secret de server. Nu trebuie expusă într-o variabilă cu prefix `VITE_`, inclusă în bundle-ul client sau comisă în repository.

## Cerințe

- PostgreSQL 15 sau mai nou;
- utilitarele `createdb`, `dropdb` și `psql` disponibile în `PATH`;
- un utilizator PostgreSQL care poate crea extensia `pgcrypto` și obiectele din schema țintă.

## Inițializare locală

Din rădăcina repository-ului:

```bash
createdb bimael
export DATABASE_URL='postgresql://localhost/bimael'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/0001_initial.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/seed.sql
```

Migrarea și seed-ul rulează în tranzacții. Migrarea se aplică o singură dată; seed-ul poate fi reaplicat și actualizează rolurile, permisiunile, domeniile și sponsorii demo după cheile lor stabile.

## Verificare

```bash
psql "$DATABASE_URL" -c '\dt'
psql "$DATABASE_URL" -c 'SELECT code, label FROM roles ORDER BY code;'
psql "$DATABASE_URL" -c 'SELECT slug, name FROM fields ORDER BY sort_order;'
psql "$DATABASE_URL" -c 'SELECT slug, name, tier FROM sponsors ORDER BY sort_order;'
```

## Resetarea bazei locale

Comanda următoare șterge întreaga bază locală și nu trebuie folosită asupra unui mediu partajat:

```bash
dropdb --if-exists bimael
createdb bimael
export DATABASE_URL='postgresql://localhost/bimael'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/0001_initial.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/seed.sql
```

## Convenții pentru migrări viitoare

- Fiecare schimbare nouă primește un fișier numerotat, de exemplu `0002_add_article_citations.sql`.
- O migrare deja aplicată nu se rescrie; corecțiile sunt migrări noi.
- Se folosesc `timestamptz`, UUID-uri opace, bani în unități minore și cod ISO 4217 pentru monedă.
- Constrângerile și autorizarea critică sunt validate pe server, nu doar în UI.
- Backup-ul și restaurarea trebuie testate înainte de orice utilizare în producție.

Schema nu reprezintă încă o integrare production-ready: lipsesc API-ul, managementul secretelor, conexiunile pool-uite, backup/restore automatizat și monitorizarea.
