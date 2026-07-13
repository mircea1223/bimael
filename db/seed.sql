BEGIN;

-- Seed idempotent pentru rolurile și matricea RBAC descrise în arhitectură.

INSERT INTO roles (code, label, description, is_system)
VALUES
  ('guest', 'Vizitator', 'Acces public fără cont.', true),
  ('member', 'Membru', 'Cont personal, bookmark-uri și înscrieri.', true),
  ('customer', 'Client', 'Comenzi și acces la produse cumpărate.', true),
  ('author', 'Autor', 'Creează și trimite propriile materiale.', true),
  ('academic_reviewer', 'Recenzor academic', 'Revizuiește numai materiale alocate.', true),
  ('editor', 'Editor', 'Revizuiește și publică materiale editoriale.', true),
  ('event_organizer', 'Organizator', 'Gestionează evenimente și webinarii.', true),
  ('shop_manager', 'Manager magazin', 'Gestionează catalogul și comenzile.', true),
  ('administrator', 'Administrator', 'Gestionează utilizatori, sponsori și audit.', true),
  ('super_administrator', 'Super administrator', 'Acces complet la configurarea platformei.', true)
ON CONFLICT (code) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  is_system = EXCLUDED.is_system;

INSERT INTO permissions (code, description)
VALUES
  ('public:read', 'Citește resurse publice.'),
  ('search:use', 'Folosește căutarea publică.'),
  ('cart:manage:own', 'Gestionează propriul coș.'),
  ('newsletter:subscribe', 'Gestionează propria abonare la newsletter.'),
  ('bookmark:manage:own', 'Gestionează propriile bookmark-uri.'),
  ('checkout:create', 'Inițiază un checkout.'),
  ('order:read:own', 'Citește propriile comenzi.'),
  ('registration:manage:own', 'Gestionează propriile înscrieri.'),
  ('webinar:access:own', 'Accesează webinariile eligibile.'),
  ('profile:update:own', 'Își actualizează propriul profil.'),
  ('article:create', 'Creează un articol.'),
  ('article:update:own', 'Editează propriile drafturi.'),
  ('article:submit:own', 'Trimite propriile drafturi la revizie.'),
  ('article:review:assigned', 'Revizuiește versiuni alocate.'),
  ('article:review:any', 'Revizuiește orice versiune editorială.'),
  ('article:publish:any', 'Publică orice articol eligibil.'),
  ('article:archive:any', 'Arhivează conținut editorial.'),
  ('event:manage:any', 'Gestionează evenimente și webinarii.'),
  ('commerce:manage', 'Gestionează catalogul și comenzile.'),
  ('sponsor:manage', 'Gestionează sponsori și parteneri.'),
  ('user:manage', 'Gestionează utilizatori și roluri permise.'),
  ('audit:read', 'Citește jurnalul de audit.'),
  ('configuration:manage', 'Gestionează configurarea globală.')
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description;

WITH grants (role_code, permission_code) AS (
  VALUES
    ('guest', 'public:read'),
    ('guest', 'search:use'),
    ('guest', 'cart:manage:own'),
    ('guest', 'newsletter:subscribe'),

    ('member', 'public:read'),
    ('member', 'search:use'),
    ('member', 'cart:manage:own'),
    ('member', 'newsletter:subscribe'),
    ('member', 'bookmark:manage:own'),
    ('member', 'registration:manage:own'),
    ('member', 'webinar:access:own'),
    ('member', 'profile:update:own'),

    ('customer', 'public:read'),
    ('customer', 'search:use'),
    ('customer', 'cart:manage:own'),
    ('customer', 'newsletter:subscribe'),
    ('customer', 'bookmark:manage:own'),
    ('customer', 'checkout:create'),
    ('customer', 'order:read:own'),
    ('customer', 'registration:manage:own'),
    ('customer', 'webinar:access:own'),
    ('customer', 'profile:update:own'),

    ('author', 'public:read'),
    ('author', 'search:use'),
    ('author', 'cart:manage:own'),
    ('author', 'bookmark:manage:own'),
    ('author', 'profile:update:own'),
    ('author', 'article:create'),
    ('author', 'article:update:own'),
    ('author', 'article:submit:own'),

    ('academic_reviewer', 'public:read'),
    ('academic_reviewer', 'search:use'),
    ('academic_reviewer', 'article:review:assigned'),

    ('editor', 'public:read'),
    ('editor', 'search:use'),
    ('editor', 'article:review:any'),
    ('editor', 'article:publish:any'),
    ('editor', 'article:archive:any'),

    ('event_organizer', 'public:read'),
    ('event_organizer', 'search:use'),
    ('event_organizer', 'event:manage:any'),

    ('shop_manager', 'public:read'),
    ('shop_manager', 'search:use'),
    ('shop_manager', 'commerce:manage'),

    ('administrator', 'public:read'),
    ('administrator', 'search:use'),
    ('administrator', 'sponsor:manage'),
    ('administrator', 'user:manage'),
    ('administrator', 'audit:read')
)
INSERT INTO role_permissions (role_code, permission_code)
SELECT role_code, permission_code
FROM grants
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'super_administrator', code
FROM permissions
ON CONFLICT DO NOTHING;

-- Domenii editoriale demo. UUID-urile stabile fac seed-ul repetabil.

INSERT INTO fields (id, slug, name, description, sort_order)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'filosofie', 'Filosofie', 'Concepte, argumente și tradiții filosofice.', 10),
  ('10000000-0000-4000-8000-000000000002', 'neurostiinte', 'Neuroștiințe', 'Studiul sistemului nervos și al cogniției.', 20),
  ('10000000-0000-4000-8000-000000000003', 'medicina', 'Medicină', 'Cercetare clinică, practică și etică medicală.', 30),
  ('10000000-0000-4000-8000-000000000004', 'psihologie', 'Psihologie', 'Procese cognitive, afective și sociale.', 40),
  ('10000000-0000-4000-8000-000000000005', 'teologie', 'Teologie', 'Tradiții religioase și reflecție teologică.', 50),
  ('10000000-0000-4000-8000-000000000006', 'istorie', 'Istorie', 'Istorie intelectuală, socială și culturală.', 60),
  ('10000000-0000-4000-8000-000000000007', 'stiinte-cognitive', 'Științe cognitive', 'Studiul interdisciplinar al minții.', 70),
  ('10000000-0000-4000-8000-000000000008', 'inteligenta-artificiala', 'Inteligență artificială', 'Sisteme inteligente, epistemologie și etică.', 80)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Entități fictive, marcate explicit drept demo.

INSERT INTO sponsors (id, slug, name, tier, website_url, status, sort_order)
VALUES
  ('20000000-0000-4000-8000-000000000001', 'fundatia-noesis-demo', 'Fundația Noesis — demo', 'principal', 'https://example.invalid/noesis', 'active', 10),
  ('20000000-0000-4000-8000-000000000002', 'coglab-demo', 'CogLab — demo', 'institutional', 'https://example.invalid/coglab', 'active', 20),
  ('20000000-0000-4000-8000-000000000003', 'revista-hyperion-demo', 'Revista Hyperion — demo', 'supporter', 'https://example.invalid/hyperion', 'active', 30)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  website_url = EXCLUDED.website_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

COMMIT;
