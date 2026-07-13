BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'deleted');
CREATE TYPE contact_visibility AS ENUM ('public', 'members', 'private');
CREATE TYPE article_kind AS ENUM (
  'news', 'essay', 'opinion', 'editorial', 'preprint', 'study', 'translation', 'review'
);
CREATE TYPE editorial_status AS ENUM (
  'draft', 'in_review', 'changes_requested', 'scheduled', 'published', 'archived'
);
CREATE TYPE review_status AS ENUM ('assigned', 'in_progress', 'changes_requested', 'approved', 'rejected');
CREATE TYPE debate_status AS ENUM ('draft', 'scheduled', 'open', 'closed', 'archived');
CREATE TYPE event_kind AS ENUM (
  'event', 'webinar', 'conference', 'seminar', 'book_launch', 'debate', 'course', 'camp'
);
CREATE TYPE event_mode AS ENUM ('online', 'physical', 'hybrid');
CREATE TYPE event_status AS ENUM (
  'draft', 'scheduled', 'registration_open', 'sold_out', 'completed', 'cancelled', 'archived'
);
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'waitlisted', 'cancelled', 'attended');
CREATE TYPE product_type AS ENUM (
  'book', 'ebook', 'course', 'webinar_access', 'event_ticket',
  'academic_material', 'subscription', 'cultural_item'
);
CREATE TYPE catalog_status AS ENUM ('draft', 'active', 'out_of_stock', 'archived');
CREATE TYPE cart_status AS ENUM ('active', 'converted', 'abandoned');
CREATE TYPE order_status AS ENUM (
  'draft', 'pending_payment', 'paid', 'payment_failed', 'cancelled', 'refunded'
);
CREATE TYPE payment_status AS ENUM (
  'initiated', 'pending', 'approved', 'declined', 'failed', 'refunded', 'cancelled'
);
CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'failed', 'cancelled');
CREATE TYPE access_status AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE newsletter_status AS ENUM ('pending', 'active', 'unsubscribed', 'bounced');
CREATE TYPE sponsor_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE sponsor_tier AS ENUM ('principal', 'institutional', 'supporter');

-- Identity and access control

CREATE TABLE roles (
  code text PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_system boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT roles_code_format CHECK (code ~ '^[a-z][a-z0-9_]*$'),
  CONSTRAINT roles_label_not_blank CHECK (btrim(label) <> '')
);

CREATE TABLE permissions (
  code text PRIMARY KEY,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT permissions_code_format CHECK (code ~ '^[a-z][a-z0-9_.:-]*$')
);

CREATE TABLE role_permissions (
  role_code text NOT NULL REFERENCES roles(code) ON DELETE CASCADE,
  permission_code text NOT NULL REFERENCES permissions(code) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role_code, permission_code)
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_normalized text GENERATED ALWAYS AS (lower(btrim(email))) STORED,
  full_name text NOT NULL,
  status user_status NOT NULL DEFAULT 'pending',
  locale text NOT NULL DEFAULT 'ro',
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT users_email_normalized_unique UNIQUE (email_normalized),
  CONSTRAINT users_email_format CHECK (email = btrim(email) AND position('@' IN email) > 1),
  CONSTRAINT users_name_not_blank CHECK (btrim(full_name) <> ''),
  CONSTRAINT users_locale_format CHECK (locale ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  CONSTRAINT users_deleted_state CHECK ((status = 'deleted') = (deleted_at IS NOT NULL))
);

CREATE TABLE user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_code text NOT NULL REFERENCES roles(code) ON DELETE RESTRICT,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by uuid REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, role_code)
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz,
  CONSTRAINT sessions_token_hash_length CHECK (length(token_hash) >= 32),
  CONSTRAINT sessions_expiry_after_creation CHECK (expires_at > created_at),
  CONSTRAINT sessions_last_seen_after_creation CHECK (last_seen_at IS NULL OR last_seen_at >= created_at)
);

CREATE TABLE media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_key text NOT NULL UNIQUE,
  mime_type text NOT NULL,
  byte_size bigint NOT NULL,
  width integer,
  height integer,
  alt_text text,
  rights_statement text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT media_assets_object_key_not_blank CHECK (btrim(object_key) <> ''),
  CONSTRAINT media_assets_mime_type_format CHECK (mime_type ~ '^[a-z0-9.+-]+/[a-z0-9.+-]+$'),
  CONSTRAINT media_assets_byte_size_positive CHECK (byte_size > 0),
  CONSTRAINT media_assets_dimensions_valid CHECK (
    (width IS NULL AND height IS NULL)
    OR (width IS NOT NULL AND height IS NOT NULL AND width > 0 AND height > 0)
  )
);

CREATE TABLE author_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  academic_title text,
  bio text NOT NULL DEFAULT '',
  orcid text,
  portrait_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  contact_visibility contact_visibility NOT NULL DEFAULT 'private',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT author_profiles_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT author_profiles_orcid_format CHECK (
    orcid IS NULL OR orcid ~ '^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$'
  )
);

CREATE TABLE institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  website_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT institutions_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT institutions_name_not_blank CHECK (btrim(name) <> ''),
  CONSTRAINT institutions_url_format CHECK (website_url IS NULL OR website_url ~ '^https?://')
);

CREATE TABLE affiliations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_profile_id uuid NOT NULL REFERENCES author_profiles(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  title text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT affiliations_unique_period UNIQUE (author_profile_id, institution_id, start_date),
  CONSTRAINT affiliations_title_not_blank CHECK (btrim(title) <> ''),
  CONSTRAINT affiliations_date_order CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES fields(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fields_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT fields_name_not_blank CHECK (btrim(name) <> ''),
  CONSTRAINT fields_not_own_parent CHECK (parent_id IS NULL OR parent_id <> id)
);

-- Editorial content and workflow

CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kind article_kind NOT NULL,
  status editorial_status NOT NULL DEFAULT 'draft',
  owner_author_id uuid NOT NULL REFERENCES author_profiles(id) ON DELETE RESTRICT,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  published_version_id uuid,
  published_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT articles_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT articles_published_state CHECK (
    status <> 'published' OR (published_version_id IS NOT NULL AND published_at IS NOT NULL)
  ),
  CONSTRAINT articles_scheduled_state CHECK (status <> 'scheduled' OR scheduled_for IS NOT NULL)
);

CREATE TABLE article_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  title text NOT NULL,
  subtitle text,
  abstract text,
  body text NOT NULL,
  locale text NOT NULL DEFAULT 'ro',
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT article_versions_article_identity_unique UNIQUE (id, article_id),
  CONSTRAINT article_versions_number_unique UNIQUE (article_id, version_number),
  CONSTRAINT article_versions_number_positive CHECK (version_number > 0),
  CONSTRAINT article_versions_title_not_blank CHECK (btrim(title) <> ''),
  CONSTRAINT article_versions_body_not_blank CHECK (btrim(body) <> ''),
  CONSTRAINT article_versions_locale_format CHECK (locale ~ '^[a-z]{2}(-[A-Z]{2})?$')
);

ALTER TABLE articles
  ADD CONSTRAINT articles_published_version_fk
  FOREIGN KEY (published_version_id, id)
  REFERENCES article_versions(id, article_id)
  ON DELETE NO ACTION
  DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE article_authors (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_profile_id uuid NOT NULL REFERENCES author_profiles(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL,
  is_corresponding boolean NOT NULL DEFAULT false,
  PRIMARY KEY (article_id, author_profile_id),
  CONSTRAINT article_authors_position_unique UNIQUE (article_id, sort_order),
  CONSTRAINT article_authors_position_positive CHECK (sort_order > 0)
);

CREATE TABLE article_fields (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  field_id uuid NOT NULL REFERENCES fields(id) ON DELETE RESTRICT,
  is_primary boolean NOT NULL DEFAULT false,
  PRIMARY KEY (article_id, field_id)
);

CREATE UNIQUE INDEX article_fields_one_primary_idx
  ON article_fields(article_id)
  WHERE is_primary;

CREATE UNIQUE INDEX article_authors_one_corresponding_idx
  ON article_authors(article_id)
  WHERE is_corresponding;

CREATE TABLE editorial_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_version_id uuid NOT NULL REFERENCES article_versions(id) ON DELETE CASCADE,
  reviewer_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status review_status NOT NULL DEFAULT 'assigned',
  comment text NOT NULL DEFAULT '',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT editorial_reviews_assignment_unique UNIQUE (article_version_id, reviewer_user_id),
  CONSTRAINT editorial_reviews_completion CHECK (
    (status IN ('approved', 'rejected', 'changes_requested') AND completed_at IS NOT NULL)
    OR status IN ('assigned', 'in_progress')
  )
);

CREATE TABLE debates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  thesis text NOT NULL,
  status debate_status NOT NULL DEFAULT 'draft',
  moderator_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT debates_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT debates_title_not_blank CHECK (btrim(title) <> ''),
  CONSTRAINT debates_thesis_not_blank CHECK (btrim(thesis) <> ''),
  CONSTRAINT debates_date_order CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE debate_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id uuid NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  participant_role text NOT NULL DEFAULT 'position',
  position_title text,
  sort_order integer NOT NULL,
  CONSTRAINT debate_participants_composite_unique UNIQUE (id, debate_id),
  CONSTRAINT debate_participants_position_unique UNIQUE (debate_id, sort_order),
  CONSTRAINT debate_participants_display_name_not_blank CHECK (btrim(display_name) <> ''),
  CONSTRAINT debate_participants_role CHECK (participant_role IN ('moderator', 'position', 'guest')),
  CONSTRAINT debate_participants_sort_order_positive CHECK (sort_order > 0)
);

CREATE UNIQUE INDEX debate_participants_user_unique_idx
  ON debate_participants(debate_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE TABLE debate_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id uuid NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL,
  parent_contribution_id uuid,
  body text NOT NULL,
  sort_order integer NOT NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT debate_contributions_composite_unique UNIQUE (id, debate_id),
  CONSTRAINT debate_contributions_position_unique UNIQUE (debate_id, sort_order),
  CONSTRAINT debate_contributions_body_not_blank CHECK (btrim(body) <> ''),
  CONSTRAINT debate_contributions_sort_order_positive CHECK (sort_order > 0),
  CONSTRAINT debate_contributions_participant_fk
    FOREIGN KEY (participant_id, debate_id)
    REFERENCES debate_participants(id, debate_id)
    ON DELETE CASCADE,
  CONSTRAINT debate_contributions_parent_fk
    FOREIGN KEY (parent_contribution_id, debate_id)
    REFERENCES debate_contributions(id, debate_id)
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED
);

-- Events, registrations and webinars

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kind event_kind NOT NULL,
  mode event_mode NOT NULL,
  status event_status NOT NULL DEFAULT 'draft',
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  organizer_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  timezone text NOT NULL DEFAULT 'Europe/Bucharest',
  location_name text,
  location_address text,
  capacity integer,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT events_title_not_blank CHECK (btrim(title) <> ''),
  CONSTRAINT events_date_order CHECK (ends_at > starts_at),
  CONSTRAINT events_timezone_not_blank CHECK (btrim(timezone) <> ''),
  CONSTRAINT events_capacity_positive CHECK (capacity IS NULL OR capacity > 0),
  CONSTRAINT events_registration_window CHECK (
    registration_opens_at IS NULL OR registration_closes_at IS NULL
    OR registration_closes_at >= registration_opens_at
  ),
  CONSTRAINT events_location_for_physical CHECK (
    mode = 'online' OR coalesce(btrim(location_name), '') <> ''
  )
);

CREATE TABLE event_speakers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  author_profile_id uuid REFERENCES author_profiles(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  speaker_role text NOT NULL DEFAULT 'speaker',
  sort_order integer NOT NULL,
  CONSTRAINT event_speakers_display_name_not_blank CHECK (btrim(display_name) <> ''),
  CONSTRAINT event_speakers_position_unique UNIQUE (event_id, sort_order),
  CONSTRAINT event_speakers_sort_order_positive CHECK (sort_order > 0)
);

CREATE TABLE webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  provider text,
  provider_ref text UNIQUE,
  live_url_ref text,
  replay_ref text,
  access_ends_at timestamptz,
  transcript_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  price_minor bigint NOT NULL DEFAULT 0,
  currency char(3) NOT NULL DEFAULT 'RON',
  capacity integer,
  sales_start_at timestamptz,
  sales_end_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ticket_types_composite_unique UNIQUE (id, event_id),
  CONSTRAINT ticket_types_name_unique UNIQUE (event_id, name),
  CONSTRAINT ticket_types_name_not_blank CHECK (btrim(name) <> ''),
  CONSTRAINT ticket_types_price_nonnegative CHECK (price_minor >= 0),
  CONSTRAINT ticket_types_currency_format CHECK (currency ~ '^[A-Z]{3}$'),
  CONSTRAINT ticket_types_capacity_positive CHECK (capacity IS NULL OR capacity > 0),
  CONSTRAINT ticket_types_sales_window CHECK (
    sales_start_at IS NULL OR sales_end_at IS NULL OR sales_end_at >= sales_start_at
  )
);

CREATE TABLE registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_type_id uuid NOT NULL,
  status registration_status NOT NULL DEFAULT 'pending',
  registered_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  CONSTRAINT registrations_ticket_type_fk
    FOREIGN KEY (ticket_type_id, event_id)
    REFERENCES ticket_types(id, event_id)
    ON DELETE RESTRICT,
  CONSTRAINT registrations_cancelled_state CHECK (
    (status = 'cancelled' AND cancelled_at IS NOT NULL) OR status <> 'cancelled'
  )
);

CREATE UNIQUE INDEX registrations_one_active_per_user_event_idx
  ON registrations(event_id, user_id)
  WHERE status IN ('pending', 'confirmed', 'waitlisted');

CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  checked_in_at timestamptz,
  CONSTRAINT tickets_code_not_blank CHECK (btrim(code) <> ''),
  CONSTRAINT tickets_check_in_after_issue CHECK (checked_in_at IS NULL OR checked_in_at >= issued_at)
);

-- Catalog, cart, orders and payments

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  type product_type NOT NULL,
  status catalog_status NOT NULL DEFAULT 'draft',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  webinar_id uuid REFERENCES webinars(id) ON DELETE RESTRICT,
  event_id uuid REFERENCES events(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT products_title_not_blank CHECK (btrim(title) <> ''),
  CONSTRAINT products_sellable_target CHECK (
    (type = 'webinar_access' AND webinar_id IS NOT NULL AND event_id IS NULL)
    OR (type = 'event_ticket' AND event_id IS NOT NULL AND webinar_id IS NULL)
    OR (type NOT IN ('webinar_access', 'event_ticket') AND webinar_id IS NULL AND event_id IS NULL)
  )
);

CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  price_minor bigint NOT NULL,
  currency char(3) NOT NULL DEFAULT 'RON',
  is_default boolean NOT NULL DEFAULT false,
  status catalog_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_name_unique UNIQUE (product_id, name),
  CONSTRAINT product_variants_sku_not_blank CHECK (btrim(sku) <> ''),
  CONSTRAINT product_variants_name_not_blank CHECK (btrim(name) <> ''),
  CONSTRAINT product_variants_price_nonnegative CHECK (price_minor >= 0),
  CONSTRAINT product_variants_currency_format CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE UNIQUE INDEX product_variants_one_default_idx
  ON product_variants(product_id)
  WHERE is_default;

CREATE TABLE inventory (
  product_variant_id uuid PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity_on_hand integer NOT NULL DEFAULT 0,
  quantity_reserved integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT inventory_quantities_nonnegative CHECK (
    quantity_on_hand >= 0 AND quantity_reserved >= 0
  ),
  CONSTRAINT inventory_reservation_within_stock CHECK (quantity_reserved <= quantity_on_hand)
);

CREATE TABLE carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_key text,
  status cart_status NOT NULL DEFAULT 'active',
  currency char(3) NOT NULL DEFAULT 'RON',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT carts_owner_present CHECK (
    user_id IS NOT NULL OR coalesce(btrim(session_key), '') <> ''
  ),
  CONSTRAINT carts_currency_format CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE UNIQUE INDEX carts_one_active_per_user_idx
  ON carts(user_id)
  WHERE status = 'active' AND user_id IS NOT NULL;

CREATE UNIQUE INDEX carts_one_active_per_session_idx
  ON carts(session_key)
  WHERE status = 'active' AND session_key IS NOT NULL;

CREATE TABLE cart_items (
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity integer NOT NULL,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (cart_id, product_variant_id),
  CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0)
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status order_status NOT NULL DEFAULT 'draft',
  currency char(3) NOT NULL DEFAULT 'RON',
  subtotal_minor bigint NOT NULL DEFAULT 0,
  discount_minor bigint NOT NULL DEFAULT 0,
  tax_minor bigint NOT NULL DEFAULT 0,
  total_minor bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  CONSTRAINT orders_number_not_blank CHECK (btrim(order_number) <> ''),
  CONSTRAINT orders_currency_format CHECK (currency ~ '^[A-Z]{3}$'),
  CONSTRAINT orders_amounts_nonnegative CHECK (
    subtotal_minor >= 0 AND discount_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0
  ),
  CONSTRAINT orders_total_consistent CHECK (
    total_minor = subtotal_minor - discount_minor + tax_minor
  ),
  CONSTRAINT orders_paid_state CHECK ((status = 'paid' AND paid_at IS NOT NULL) OR status <> 'paid')
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  title_snapshot text NOT NULL,
  sku_snapshot text NOT NULL,
  unit_price_minor bigint NOT NULL,
  quantity integer NOT NULL,
  line_total_minor bigint GENERATED ALWAYS AS (unit_price_minor * quantity) STORED,
  CONSTRAINT order_items_title_not_blank CHECK (btrim(title_snapshot) <> ''),
  CONSTRAINT order_items_sku_not_blank CHECK (btrim(sku_snapshot) <> ''),
  CONSTRAINT order_items_price_nonnegative CHECK (unit_price_minor >= 0),
  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0)
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider text NOT NULL,
  provider_ref text NOT NULL UNIQUE,
  idempotency_key text UNIQUE,
  status payment_status NOT NULL DEFAULT 'initiated',
  amount_minor bigint NOT NULL,
  currency char(3) NOT NULL DEFAULT 'RON',
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  CONSTRAINT payments_provider_not_blank CHECK (btrim(provider) <> ''),
  CONSTRAINT payments_provider_ref_not_blank CHECK (btrim(provider_ref) <> ''),
  CONSTRAINT payments_amount_nonnegative CHECK (amount_minor >= 0),
  CONSTRAINT payments_currency_format CHECK (currency ~ '^[A-Z]{3}$'),
  CONSTRAINT payments_processed_state CHECK (
    status NOT IN ('approved', 'declined', 'failed', 'refunded', 'cancelled')
    OR processed_at IS NOT NULL
  )
);

CREATE TABLE refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
  provider_ref text UNIQUE,
  status refund_status NOT NULL DEFAULT 'pending',
  amount_minor bigint NOT NULL,
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  CONSTRAINT refunds_amount_positive CHECK (amount_minor > 0),
  CONSTRAINT refunds_processed_state CHECK (
    status NOT IN ('approved', 'failed', 'cancelled') OR processed_at IS NOT NULL
  )
);

CREATE TABLE webinar_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id uuid NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_item_id uuid NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE RESTRICT,
  status access_status NOT NULL DEFAULT 'active',
  granted_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  CONSTRAINT webinar_access_user_unique UNIQUE (webinar_id, user_id),
  CONSTRAINT webinar_access_expiry_order CHECK (expires_at IS NULL OR expires_at > granted_at),
  CONSTRAINT webinar_access_revoked_state CHECK (
    (status = 'revoked' AND revoked_at IS NOT NULL) OR status <> 'revoked'
  )
);

-- Engagement, partnerships and audit

CREATE TABLE bookmarks (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, article_id)
);

CREATE TABLE follows (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_profile_id uuid NOT NULL REFERENCES author_profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, author_profile_id)
);

CREATE TABLE newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_normalized text GENERATED ALWAYS AS (lower(btrim(email))) STORED,
  status newsletter_status NOT NULL DEFAULT 'pending',
  locale text NOT NULL DEFAULT 'ro',
  consented_at timestamptz NOT NULL,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_email_unique UNIQUE (email_normalized),
  CONSTRAINT newsletter_email_format CHECK (email = btrim(email) AND position('@' IN email) > 1),
  CONSTRAINT newsletter_locale_format CHECK (locale ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  CONSTRAINT newsletter_unsubscribed_state CHECK (
    (status = 'unsubscribed' AND unsubscribed_at IS NOT NULL) OR status <> 'unsubscribed'
  )
);

CREATE TABLE sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tier sponsor_tier NOT NULL DEFAULT 'supporter',
  website_url text,
  logo_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  status sponsor_status NOT NULL DEFAULT 'active',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sponsors_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT sponsors_name_not_blank CHECK (btrim(name) <> ''),
  CONSTRAINT sponsors_url_format CHECK (website_url IS NULL OR website_url ~ '^https?://')
);

CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  website_url text,
  logo_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  status sponsor_status NOT NULL DEFAULT 'active',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partners_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT partners_name_not_blank CHECK (btrim(name) <> ''),
  CONSTRAINT partners_url_format CHECK (website_url IS NULL OR website_url ~ '^https?://')
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  summary text NOT NULL DEFAULT '',
  request_id text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT audit_logs_action_format CHECK (action ~ '^[a-z][a-z0-9_.:-]*$'),
  CONSTRAINT audit_logs_entity_type_format CHECK (entity_type ~ '^[a-z][a-z0-9_]*$')
);

-- Query-path indexes. UNIQUE constraints already create their own indexes.

CREATE INDEX users_status_idx ON users(status) WHERE status <> 'deleted';
CREATE INDEX sessions_user_active_idx ON sessions(user_id, expires_at) WHERE revoked_at IS NULL;
CREATE INDEX sessions_expiry_idx ON sessions(expires_at) WHERE revoked_at IS NULL;
CREATE INDEX affiliations_author_idx ON affiliations(author_profile_id, end_date);
CREATE INDEX affiliations_institution_idx ON affiliations(institution_id);
CREATE INDEX fields_parent_sort_idx ON fields(parent_id, sort_order);

CREATE INDEX articles_status_published_idx ON articles(status, published_at DESC);
CREATE INDEX articles_owner_status_idx ON articles(owner_author_id, status, updated_at DESC);
CREATE INDEX article_versions_article_created_idx ON article_versions(article_id, created_at DESC);
CREATE INDEX article_versions_search_idx ON article_versions USING gin (
  to_tsvector(
    'simple',
    coalesce(title, '') || ' ' || coalesce(subtitle, '') || ' ' || coalesce(abstract, '')
  )
);
CREATE INDEX editorial_reviews_reviewer_status_idx
  ON editorial_reviews(reviewer_user_id, status, assigned_at);
CREATE INDEX debate_contributions_debate_order_idx
  ON debate_contributions(debate_id, sort_order);

CREATE INDEX events_status_start_idx ON events(status, starts_at);
CREATE INDEX events_organizer_start_idx ON events(organizer_user_id, starts_at);
CREATE INDEX events_search_idx ON events USING gin (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, ''))
);
CREATE INDEX registrations_user_status_idx ON registrations(user_id, status, registered_at DESC);
CREATE INDEX registrations_event_status_idx ON registrations(event_id, status);

CREATE INDEX products_status_type_idx ON products(status, type, updated_at DESC);
CREATE INDEX products_search_idx ON products USING gin (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
);
CREATE INDEX product_variants_product_status_idx ON product_variants(product_id, status);
CREATE INDEX cart_items_variant_idx ON cart_items(product_variant_id);
CREATE INDEX orders_user_created_idx ON orders(user_id, created_at DESC);
CREATE INDEX orders_status_created_idx ON orders(status, created_at);
CREATE INDEX order_items_order_idx ON order_items(order_id);
CREATE INDEX payments_order_status_idx ON payments(order_id, status, created_at DESC);
CREATE INDEX refunds_payment_status_idx ON refunds(payment_id, status);
CREATE INDEX webinar_access_user_status_idx ON webinar_access(user_id, status, expires_at);

CREATE INDEX sponsors_public_order_idx ON sponsors(status, tier, sort_order);
CREATE INDEX partners_public_order_idx ON partners(status, sort_order);
CREATE INDEX audit_logs_actor_time_idx ON audit_logs(actor_user_id, occurred_at DESC);
CREATE INDEX audit_logs_entity_time_idx ON audit_logs(entity_type, entity_id, occurred_at DESC);
CREATE INDEX audit_logs_time_idx ON audit_logs(occurred_at DESC);

COMMIT;
