import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create the schema only when missing (the production role owns an existing "cms" schema but cannot create schemas).
  await db.execute(sql`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'cms') THEN CREATE SCHEMA "cms"; END IF; END $$;`)
  await db.execute(sql`
   CREATE TYPE "cms"."_locales" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_pages_blocks_page_header_image_shape" AS ENUM('arch', 'rounded', 'door');
  CREATE TYPE "cms"."enum_pages_blocks_timeline_items_colour" AS ENUM('red', 'gold', 'green');
  CREATE TYPE "cms"."enum_pages_blocks_columns_tone" AS ENUM('paper', 'sand', 'ink', 'gold');
  CREATE TYPE "cms"."enum_pages_blocks_numbered_cards_tone" AS ENUM('paper', 'sand', 'ink', 'gold');
  CREATE TYPE "cms"."enum_pages_blocks_people_teams" AS ENUM('board', 'patrons', 'executive', 'community', 'policy', 'comms', 'volunteers');
  CREATE TYPE "cms"."enum_pages_blocks_split_tone" AS ENUM('paper', 'sand', 'ink', 'gold');
  CREATE TYPE "cms"."enum_pages_blocks_split_image_side" AS ENUM('left', 'right');
  CREATE TYPE "cms"."enum_pages_blocks_cta_tone" AS ENUM('paper', 'sand', 'ink', 'gold');
  CREATE TYPE "cms"."enum_pages_blocks_partners_group" AS ENUM('all', 'current', 'previous', 'funder');
  CREATE TYPE "cms"."enum_pages_blocks_partners_style" AS ENUM('grid', 'carousel');
  CREATE TYPE "cms"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__pages_v_blocks_page_header_image_shape" AS ENUM('arch', 'rounded', 'door');
  CREATE TYPE "cms"."enum__pages_v_blocks_timeline_items_colour" AS ENUM('red', 'gold', 'green');
  CREATE TYPE "cms"."enum__pages_v_blocks_columns_tone" AS ENUM('paper', 'sand', 'ink', 'gold');
  CREATE TYPE "cms"."enum__pages_v_blocks_numbered_cards_tone" AS ENUM('paper', 'sand', 'ink', 'gold');
  CREATE TYPE "cms"."enum__pages_v_blocks_people_teams" AS ENUM('board', 'patrons', 'executive', 'community', 'policy', 'comms', 'volunteers');
  CREATE TYPE "cms"."enum__pages_v_blocks_split_tone" AS ENUM('paper', 'sand', 'ink', 'gold');
  CREATE TYPE "cms"."enum__pages_v_blocks_split_image_side" AS ENUM('left', 'right');
  CREATE TYPE "cms"."enum__pages_v_blocks_cta_tone" AS ENUM('paper', 'sand', 'ink', 'gold');
  CREATE TYPE "cms"."enum__pages_v_blocks_partners_group" AS ENUM('all', 'current', 'previous', 'funder');
  CREATE TYPE "cms"."enum__pages_v_blocks_partners_style" AS ENUM('grid', 'carousel');
  CREATE TYPE "cms"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__pages_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_banners_tag_colour" AS ENUM('gold', 'red', 'green', 'paper');
  CREATE TYPE "cms"."enum_banners_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__banners_v_version_tag_colour" AS ENUM('gold', 'red', 'green', 'paper');
  CREATE TYPE "cms"."enum__banners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__banners_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_partners_group" AS ENUM('current', 'previous', 'funder', 'supporter');
  CREATE TYPE "cms"."enum_health_hour_sessions_category" AS ENUM('Cancer', 'Menopause', 'Sickle cell', 'Blood donation', 'Kidney health', 'Dental care', 'Screenings', 'Vaccinations', 'Mental health', 'Heart health', 'Other');
  CREATE TYPE "cms"."enum_health_hour_sessions_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__health_hour_sessions_v_version_category" AS ENUM('Cancer', 'Menopause', 'Sickle cell', 'Blood donation', 'Kidney health', 'Dental care', 'Screenings', 'Vaccinations', 'Mental health', 'Heart health', 'Other');
  CREATE TYPE "cms"."enum__health_hour_sessions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__health_hour_sessions_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_events_category" AS ENUM('flagship', 'community', 'online', 'awareness', 'campaign');
  CREATE TYPE "cms"."enum_events_registration_mode" AS ENUM('onsite', 'external', 'none');
  CREATE TYPE "cms"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__events_v_version_category" AS ENUM('flagship', 'community', 'online', 'awareness', 'campaign');
  CREATE TYPE "cms"."enum__events_v_version_registration_mode" AS ENUM('onsite', 'external', 'none');
  CREATE TYPE "cms"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__events_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_services_needs" AS ENUM('unsafe', 'housing', 'legal', 'wellbeing', 'family', 'hospital', 'exploitation', 'windrush');
  CREATE TYPE "cms"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__services_v_version_needs" AS ENUM('unsafe', 'housing', 'legal', 'wellbeing', 'family', 'hospital', 'exploitation', 'windrush');
  CREATE TYPE "cms"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__services_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_programmes_theme" AS ENUM('health', 'donation', 'leadership', 'empowerment', 'research');
  CREATE TYPE "cms"."enum_programmes_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__programmes_v_version_theme" AS ENUM('health', 'donation', 'leadership', 'empowerment', 'research');
  CREATE TYPE "cms"."enum__programmes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__programmes_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_people_team" AS ENUM('board', 'patrons', 'executive', 'community', 'policy', 'comms', 'volunteers');
  CREATE TYPE "cms"."enum_publications_type" AS ENUM('report', 'research', 'policy', 'resource');
  CREATE TYPE "cms"."enum_publications_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__publications_v_version_type" AS ENUM('report', 'research', 'policy', 'resource');
  CREATE TYPE "cms"."enum__publications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__publications_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_posts_kind" AS ENUM('press', 'statement', 'bulletin', 'case-study', 'testimonial', 'update');
  CREATE TYPE "cms"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__posts_v_version_kind" AS ENUM('press', 'statement', 'bulletin', 'case-study', 'testimonial', 'update');
  CREATE TYPE "cms"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__posts_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_videos_series" AS ENUM('CEO film', 'Health Hour', 'Events', 'Campaigns', 'Stories');
  CREATE TYPE "cms"."enum_jobs_employer" AS ENUM('cahn', 'partner');
  CREATE TYPE "cms"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__jobs_v_version_employer" AS ENUM('cahn', 'partner');
  CREATE TYPE "cms"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__jobs_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_grants_round_status" AS ENUM('open', 'upcoming', 'closed');
  CREATE TYPE "cms"."enum_grants_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__grants_v_version_round_status" AS ENUM('open', 'upcoming', 'closed');
  CREATE TYPE "cms"."enum__grants_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__grants_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_subscribers_topics" AS ENUM('e-bulletin', 'health-hour', 'events', 'jobs');
  CREATE TYPE "cms"."enum_subscribers_status" AS ENUM('subscribed', 'unsubscribed');
  CREATE TYPE "cms"."enum_donations_provider" AS ENUM('stripe', 'paystack');
  CREATE TYPE "cms"."enum_donations_frequency" AS ENUM('one-off', 'monthly');
  CREATE TYPE "cms"."enum_donations_status" AS ENUM('pending', 'paid', 'failed', 'cancelled', 'refunded');
  CREATE TYPE "cms"."enum_media_kind" AS ENUM('image', 'logo', 'flyer', 'video', 'document');
  CREATE TYPE "cms"."enum_users_sections" AS ENUM('homepage', 'pages', 'healthHour', 'events', 'services', 'research', 'opportunities', 'media', 'donations', 'newsletter');
  CREATE TYPE "cms"."enum_users_role" AS ENUM('admin', 'sectionAdmin', 'editor', 'viewer');
  CREATE TYPE "cms"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "cms"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "cms"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "cms"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "cms"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "cms"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__homepage_v_published_locale" AS ENUM('en', 'fr', 'pt');
  CREATE TYPE "cms"."enum_site_settings_social_platform" AS ENUM('Instagram', 'Facebook', 'X', 'YouTube', 'LinkedIn', 'TikTok', 'Linktree');
  CREATE TYPE "cms"."enum_site_settings_font_pair" AS ENUM('bricolage-inter', 'fraunces-inter', 'space-inter', 'dmserif-dmsans', 'poppins-opensans');
  CREATE TYPE "cms"."enum_site_settings_motion" AS ENUM('full', 'subtle', 'off');
  CREATE TYPE "cms"."enum_donation_settings_currencies_provider" AS ENUM('stripe', 'paystack');
  CREATE TABLE "cms"."pages_subnav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lede" varchar,
  	"image_id" integer,
  	"image_shape" "cms"."enum_pages_blocks_page_header_image_shape" DEFAULT 'arch',
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"text" varchar,
  	"colour" "cms"."enum_pages_blocks_timeline_items_colour" DEFAULT 'red'
  );
  
  CREATE TABLE "cms"."pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_columns_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "cms"."enum_pages_blocks_columns_tone" DEFAULT 'paper',
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_dot_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_dot_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_numbered_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_numbered_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "cms"."enum_pages_blocks_numbered_cards_tone" DEFAULT 'paper',
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_people_teams" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "cms"."enum_pages_blocks_people_teams",
  	"locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."pages_blocks_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The people behind CAHN',
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_url" varchar,
  	"link_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "cms"."pages_blocks_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "cms"."enum_pages_blocks_split_tone" DEFAULT 'paper',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"image_side" "cms"."enum_pages_blocks_split_image_side" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "cms"."enum_pages_blocks_cta_tone" DEFAULT 'paper',
  	"heading" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"link_new_tab" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Questions',
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"youtube_url" varchar,
  	"file_id" integer,
  	"poster_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Partners & supporters',
  	"group" "cms"."enum_pages_blocks_partners_group" DEFAULT 'all',
  	"style" "cms"."enum_pages_blocks_partners_style" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"parent_id" integer,
  	"path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_version_subnav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lede" varchar,
  	"image_id" integer,
  	"image_shape" "cms"."enum__pages_v_blocks_page_header_image_shape" DEFAULT 'arch',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"text" varchar,
  	"colour" "cms"."enum__pages_v_blocks_timeline_items_colour" DEFAULT 'red',
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_columns_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "cms"."enum__pages_v_blocks_columns_tone" DEFAULT 'paper',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_dot_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_dot_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_numbered_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_numbered_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "cms"."enum__pages_v_blocks_numbered_cards_tone" DEFAULT 'paper',
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_people_teams" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cms"."enum__pages_v_blocks_people_teams",
  	"locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The people behind CAHN',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_url" varchar,
  	"link_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "cms"."enum__pages_v_blocks_split_tone" DEFAULT 'paper',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"image_side" "cms"."enum__pages_v_blocks_split_image_side" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "cms"."enum__pages_v_blocks_cta_tone" DEFAULT 'paper',
  	"heading" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"link_new_tab" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Questions',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"youtube_url" varchar,
  	"file_id" integer,
  	"poster_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Partners & supporters',
  	"group" "cms"."enum__pages_v_blocks_partners_group" DEFAULT 'all',
  	"style" "cms"."enum__pages_v_blocks_partners_style" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_parent_id" integer,
  	"version_path" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."banners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tag_colour" "cms"."enum_banners_tag_colour" DEFAULT 'gold',
  	"link_url" varchar,
  	"image_id" integer,
  	"video_id" integer,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_banners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."banners_locales" (
  	"title" varchar,
  	"tag" varchar,
  	"line" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_banners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_tag_colour" "cms"."enum__banners_v_version_tag_colour" DEFAULT 'gold',
  	"version_link_url" varchar,
  	"version_image_id" integer,
  	"version_video_id" integer,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__banners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__banners_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_banners_v_locales" (
  	"version_title" varchar,
  	"version_tag" varchar,
  	"version_line" varchar,
  	"version_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"group" "cms"."enum_partners_group" DEFAULT 'current',
  	"show_in_carousel" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."health_hour_sessions_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "cms"."health_hour_sessions_speakers_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."health_hour_sessions_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "cms"."health_hour_sessions_resources_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."health_hour_sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"category" "cms"."enum_health_hour_sessions_category",
  	"session_date" timestamp(3) with time zone,
  	"flyer_id" integer,
  	"show_in_mockup" boolean DEFAULT true,
  	"replay_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_health_hour_sessions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."health_hour_sessions_locales" (
  	"topic" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_health_hour_sessions_v_version_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"photo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_health_hour_sessions_v_version_speakers_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_health_hour_sessions_v_version_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_health_hour_sessions_v_version_resources_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_health_hour_sessions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_category" "cms"."enum__health_hour_sessions_v_version_category",
  	"version_session_date" timestamp(3) with time zone,
  	"version_flyer_id" integer,
  	"version_show_in_mockup" boolean DEFAULT true,
  	"version_replay_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__health_hour_sessions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__health_hour_sessions_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_health_hour_sessions_v_locales" (
  	"version_topic" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."events_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar
  );
  
  CREATE TABLE "cms"."events_schedule_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."events_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "cms"."events_speakers_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "cms"."enum_events_category" DEFAULT 'community',
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"date_t_b_c" boolean,
  	"address" varchar,
  	"image_id" integer,
  	"registration_mode" "cms"."enum_events_registration_mode" DEFAULT 'onsite',
  	"registration_external_url" varchar,
  	"registration_capacity" numeric,
  	"gallery_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."events_locales" (
  	"title" varchar,
  	"venue" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"registration_cta_label" varchar DEFAULT 'Register',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."events_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."_events_v_version_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_events_v_version_schedule_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_events_v_version_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"photo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_events_v_version_speakers_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "cms"."enum__events_v_version_category" DEFAULT 'community',
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_date_t_b_c" boolean,
  	"version_address" varchar,
  	"version_image_id" integer,
  	"version_registration_mode" "cms"."enum__events_v_version_registration_mode" DEFAULT 'onsite',
  	"version_registration_external_url" varchar,
  	"version_registration_capacity" numeric,
  	"version_gallery_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__events_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_events_v_locales" (
  	"version_title" varchar,
  	"version_venue" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_registration_cta_label" varchar DEFAULT 'Register',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_events_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."event_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"tickets" numeric DEFAULT 1,
  	"access_needs" varchar,
  	"marketing_consent" boolean,
  	"locale" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."services_needs" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cms"."enum_services_needs",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"image_id" integer,
  	"flyer_id" integer,
  	"sensitive" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."services_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."services_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."_services_v_version_needs" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cms"."enum__services_v_version_needs",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_image_id" integer,
  	"version_flyer_id" integer,
  	"version_sensitive" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__services_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_services_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_services_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."programmes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"tag" varchar,
  	"theme" "cms"."enum_programmes_theme",
  	"image_id" integer,
  	"featured" boolean,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_programmes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."programmes_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"hover_text" varchar,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."programmes_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."_programmes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_tag" varchar,
  	"version_theme" "cms"."enum__programmes_v_version_theme",
  	"version_image_id" integer,
  	"version_featured" boolean,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__programmes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__programmes_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_programmes_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_hover_text" varchar,
  	"version_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_programmes_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"team" "cms"."enum_people_team" NOT NULL,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."people_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."publications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"type" "cms"."enum_publications_type",
  	"year" numeric,
  	"file_id" integer,
  	"cover_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_publications_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."publications_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."publications_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."_publications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_type" "cms"."enum__publications_v_version_type",
  	"version_year" numeric,
  	"version_file_id" integer,
  	"version_cover_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__publications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__publications_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_publications_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_publications_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"kind" "cms"."enum_posts_kind" DEFAULT 'press',
  	"published_at" timestamp(3) with time zone,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_kind" "cms"."enum__posts_v_version_kind" DEFAULT 'press',
  	"version_published_at" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"series" "cms"."enum_videos_series",
  	"youtube_url" varchar NOT NULL,
  	"thumbnail_id" integer,
  	"duration" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."videos_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."albums" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"cover_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."albums_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."albums_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "cms"."jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"employer" "cms"."enum_jobs_employer" DEFAULT 'cahn',
  	"partner_name" varchar,
  	"location" varchar,
  	"contract" varchar,
  	"salary" varchar,
  	"closes_at" timestamp(3) with time zone,
  	"apply_url" varchar,
  	"pack_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_jobs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."jobs_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."jobs_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_employer" "cms"."enum__jobs_v_version_employer" DEFAULT 'cahn',
  	"version_partner_name" varchar,
  	"version_location" varchar,
  	"version_contract" varchar,
  	"version_salary" varchar,
  	"version_closes_at" timestamp(3) with time zone,
  	"version_apply_url" varchar,
  	"version_pack_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__jobs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__jobs_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_jobs_v_locales" (
  	"version_title" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_jobs_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."grants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"round_status" "cms"."enum_grants_round_status" DEFAULT 'upcoming',
  	"opens_at" timestamp(3) with time zone,
  	"closes_at" timestamp(3) with time zone,
  	"guidance_id" integer,
  	"apply_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_grants_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."grants_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."grants_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."_grants_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_round_status" "cms"."enum__grants_v_version_round_status" DEFAULT 'upcoming',
  	"version_opens_at" timestamp(3) with time zone,
  	"version_closes_at" timestamp(3) with time zone,
  	"version_guidance_id" integer,
  	"version_apply_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__grants_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__grants_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_grants_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_grants_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."subscribers_topics" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cms"."enum_subscribers_topics",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar,
  	"status" "cms"."enum_subscribers_status" DEFAULT 'subscribed',
  	"source" varchar,
  	"consent_text" varchar,
  	"consent_at" timestamp(3) with time zone,
  	"token" varchar,
  	"locale" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."donations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"provider" "cms"."enum_donations_provider" NOT NULL,
  	"amount" numeric NOT NULL,
  	"covered_fees" numeric,
  	"currency" varchar NOT NULL,
  	"frequency" "cms"."enum_donations_frequency" DEFAULT 'one-off',
  	"status" "cms"."enum_donations_status" DEFAULT 'pending',
  	"email" varchar,
  	"name" varchar,
  	"gift_aid" boolean,
  	"provider_ref" varchar,
  	"subscription_ref" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "cms"."enum_media_kind" DEFAULT 'image',
  	"credit" varchar,
  	"document_text" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "cms"."media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."users_sections" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cms"."enum_users_sections",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "cms"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "cms"."enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"slug" varchar,
  	"summary" varchar,
  	"keywords" varchar,
  	"doc_text" varchar,
  	"path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"services_id" integer,
  	"programmes_id" integer,
  	"events_id" integer,
  	"publications_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"health_hour_sessions_id" integer
  );
  
  CREATE TABLE "cms"."forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "cms"."forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "cms"."enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "cms"."payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "cms"."enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "cms"."enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "cms"."payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "cms"."enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cms"."enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"banners_id" integer,
  	"partners_id" integer,
  	"health_hour_sessions_id" integer,
  	"events_id" integer,
  	"event_registrations_id" integer,
  	"services_id" integer,
  	"programmes_id" integer,
  	"people_id" integer,
  	"publications_id" integer,
  	"posts_id" integer,
  	"videos_id" integer,
  	"albums_id" integer,
  	"jobs_id" integer,
  	"grants_id" integer,
  	"subscribers_id" integer,
  	"donations_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"search_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "cms"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."homepage_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "cms"."homepage_areas_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_video_id" integer,
  	"banners_enabled" boolean DEFAULT true,
  	"banners_seconds" numeric DEFAULT 6,
  	"partners_enabled" boolean DEFAULT true,
  	"partners_loop_seconds" numeric DEFAULT 48,
  	"ceo_video_enabled" boolean DEFAULT true,
  	"ceo_video_youtube_url" varchar,
  	"ceo_video_file_id" integer,
  	"ceo_video_captions_id" integer,
  	"ceo_video_poster_id" integer,
  	"health_hour_enabled" boolean DEFAULT true,
  	"health_hour_sessions_count" varchar DEFAULT '400+',
  	"health_hour_flyer_seconds" numeric DEFAULT 4,
  	"health_hour_max_flyers" numeric DEFAULT 8,
  	"show_events" boolean DEFAULT true,
  	"_status" "cms"."enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."homepage_locales" (
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_highlight" varchar,
  	"hero_lede" varchar,
  	"partners_eyebrow" varchar DEFAULT 'Working together',
  	"partners_heading" varchar DEFAULT 'Partners, funders & supporters',
  	"ceo_video_eyebrow" varchar DEFAULT 'A message from our Chief Executive',
  	"ceo_video_title" varchar DEFAULT 'Our Work',
  	"ceo_video_text" varchar,
  	"health_hour_eyebrow" varchar DEFAULT 'Flagship programme · since 2020',
  	"health_hour_heading" varchar DEFAULT 'Do you have an hour?',
  	"health_hour_text" varchar,
  	"manifesto_eyebrow" varchar DEFAULT 'Black Health Manifesto',
  	"manifesto_heading" varchar DEFAULT 'Three mandates for change.',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"publications_id" integer
  );
  
  CREATE TABLE "cms"."_homepage_v_version_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_homepage_v_version_areas_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_video_id" integer,
  	"version_banners_enabled" boolean DEFAULT true,
  	"version_banners_seconds" numeric DEFAULT 6,
  	"version_partners_enabled" boolean DEFAULT true,
  	"version_partners_loop_seconds" numeric DEFAULT 48,
  	"version_ceo_video_enabled" boolean DEFAULT true,
  	"version_ceo_video_youtube_url" varchar,
  	"version_ceo_video_file_id" integer,
  	"version_ceo_video_captions_id" integer,
  	"version_ceo_video_poster_id" integer,
  	"version_health_hour_enabled" boolean DEFAULT true,
  	"version_health_hour_sessions_count" varchar DEFAULT '400+',
  	"version_health_hour_flyer_seconds" numeric DEFAULT 4,
  	"version_health_hour_max_flyers" numeric DEFAULT 8,
  	"version_show_events" boolean DEFAULT true,
  	"version__status" "cms"."enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__homepage_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_homepage_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_headline" varchar,
  	"version_hero_highlight" varchar,
  	"version_hero_lede" varchar,
  	"version_partners_eyebrow" varchar DEFAULT 'Working together',
  	"version_partners_heading" varchar DEFAULT 'Partners, funders & supporters',
  	"version_ceo_video_eyebrow" varchar DEFAULT 'A message from our Chief Executive',
  	"version_ceo_video_title" varchar DEFAULT 'Our Work',
  	"version_ceo_video_text" varchar,
  	"version_health_hour_eyebrow" varchar DEFAULT 'Flagship programme · since 2020',
  	"version_health_hour_heading" varchar DEFAULT 'Do you have an hour?',
  	"version_health_hour_text" varchar,
  	"version_manifesto_eyebrow" varchar DEFAULT 'Black Health Manifesto',
  	"version_manifesto_heading" varchar DEFAULT 'Three mandates for change.',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"publications_id" integer
  );
  
  CREATE TABLE "cms"."site_settings_main_nav_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_main_nav_children_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_main_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_main_nav_locales" (
  	"label" varchar NOT NULL,
  	"blurb" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_footer_columns_locales" (
  	"heading" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "cms"."enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"short_name" varchar DEFAULT 'CAHN',
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"mascot_id" integer,
  	"favicon_id" integer,
  	"ink" varchar DEFAULT '#0F1F18',
  	"paper" varchar DEFAULT '#F7F2E9',
  	"sand" varchar DEFAULT '#EFE7D8',
  	"muted" varchar DEFAULT '#4A5A52',
  	"green" varchar DEFAULT '#0B6B3F',
  	"red" varchar DEFAULT '#C23A2B',
  	"gold" varchar DEFAULT '#F0B323',
  	"red_text" varchar DEFAULT '#A12C1F',
  	"font_pair" "cms"."enum_site_settings_font_pair" DEFAULT 'bricolage-inter',
  	"radius" numeric DEFAULT 28,
  	"motion" "cms"."enum_site_settings_motion" DEFAULT 'full',
  	"helpline" varchar DEFAULT '077 1002 2382',
  	"email" varchar DEFAULT 'info@cahn.org.uk',
  	"address" varchar DEFAULT 'Transformation Community Resource Centre
  1st Floor, Richmond House
  11 Richmond Grove, Manchester M13 0LN',
  	"company_line" varchar DEFAULT 'Caribbean & African Health Network CIC · Registered in England and Wales · Company No. 10845632',
  	"og_image_id" integer,
  	"ga4_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."site_settings_locales" (
  	"site_name" varchar DEFAULT 'Caribbean & African Health Network',
  	"utility_text" varchar DEFAULT 'Health Hour — live every Saturday at 11:00',
  	"default_description" varchar,
  	"cookie_text" varchar DEFAULT 'We use essential cookies to run this site and, only with your consent, Google Analytics to understand how it is used.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."donation_settings_currencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"symbol" varchar NOT NULL,
  	"provider" "cms"."enum_donation_settings_currencies_provider" NOT NULL
  );
  
  CREATE TABLE "cms"."donation_settings_currencies_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."donation_settings_impacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."donation_settings_impacts_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."donation_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"allow_monthly" boolean DEFAULT true,
  	"cover_fees_percent" numeric DEFAULT 3,
  	"gift_aid" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."donation_settings_locales" (
  	"heading" varchar DEFAULT 'Your gift powers care that understands.',
  	"intro" varchar,
  	"other_ways" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."donation_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cms"."donation_settings_numbers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL
  );
  
  ALTER TABLE "cms"."pages_subnav" ADD CONSTRAINT "pages_subnav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_columns_columns" ADD CONSTRAINT "pages_blocks_columns_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_columns" ADD CONSTRAINT "pages_blocks_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_dot_grid_items" ADD CONSTRAINT "pages_blocks_dot_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_dot_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_dot_grid" ADD CONSTRAINT "pages_blocks_dot_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_numbered_cards_cards" ADD CONSTRAINT "pages_blocks_numbered_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_numbered_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_numbered_cards" ADD CONSTRAINT "pages_blocks_numbered_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_people_teams" ADD CONSTRAINT "pages_blocks_people_teams_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."pages_blocks_people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_people" ADD CONSTRAINT "pages_blocks_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_split_links" ADD CONSTRAINT "pages_blocks_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_split" ADD CONSTRAINT "pages_blocks_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_split" ADD CONSTRAINT "pages_blocks_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_partners" ADD CONSTRAINT "pages_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_version_subnav" ADD CONSTRAINT "_pages_v_version_subnav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_columns_columns" ADD CONSTRAINT "_pages_v_blocks_columns_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_columns" ADD CONSTRAINT "_pages_v_blocks_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_dot_grid_items" ADD CONSTRAINT "_pages_v_blocks_dot_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_dot_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_dot_grid" ADD CONSTRAINT "_pages_v_blocks_dot_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_numbered_cards_cards" ADD CONSTRAINT "_pages_v_blocks_numbered_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_numbered_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_numbered_cards" ADD CONSTRAINT "_pages_v_blocks_numbered_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_people_teams" ADD CONSTRAINT "_pages_v_blocks_people_teams_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_pages_v_blocks_people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_people" ADD CONSTRAINT "_pages_v_blocks_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_split_links" ADD CONSTRAINT "_pages_v_blocks_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_split" ADD CONSTRAINT "_pages_v_blocks_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_split" ADD CONSTRAINT "_pages_v_blocks_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_partners" ADD CONSTRAINT "_pages_v_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "cms"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."banners" ADD CONSTRAINT "banners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."banners" ADD CONSTRAINT "banners_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."banners_locales" ADD CONSTRAINT "banners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."banners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_banners_v" ADD CONSTRAINT "_banners_v_parent_id_banners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_banners_v" ADD CONSTRAINT "_banners_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_banners_v" ADD CONSTRAINT "_banners_v_version_video_id_media_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_banners_v_locales" ADD CONSTRAINT "_banners_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_banners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."health_hour_sessions_speakers" ADD CONSTRAINT "health_hour_sessions_speakers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."health_hour_sessions_speakers" ADD CONSTRAINT "health_hour_sessions_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."health_hour_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."health_hour_sessions_speakers_locales" ADD CONSTRAINT "health_hour_sessions_speakers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."health_hour_sessions_speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."health_hour_sessions_resources" ADD CONSTRAINT "health_hour_sessions_resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."health_hour_sessions_resources" ADD CONSTRAINT "health_hour_sessions_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."health_hour_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."health_hour_sessions_resources_locales" ADD CONSTRAINT "health_hour_sessions_resources_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."health_hour_sessions_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."health_hour_sessions" ADD CONSTRAINT "health_hour_sessions_flyer_id_media_id_fk" FOREIGN KEY ("flyer_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."health_hour_sessions_locales" ADD CONSTRAINT "health_hour_sessions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."health_hour_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v_version_speakers" ADD CONSTRAINT "_health_hour_sessions_v_version_speakers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v_version_speakers" ADD CONSTRAINT "_health_hour_sessions_v_version_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_health_hour_sessions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v_version_speakers_locales" ADD CONSTRAINT "_health_hour_sessions_v_version_speakers_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_health_hour_sessions_v_version_speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v_version_resources" ADD CONSTRAINT "_health_hour_sessions_v_version_resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v_version_resources" ADD CONSTRAINT "_health_hour_sessions_v_version_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_health_hour_sessions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v_version_resources_locales" ADD CONSTRAINT "_health_hour_sessions_v_version_resources_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_health_hour_sessions_v_version_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v" ADD CONSTRAINT "_health_hour_sessions_v_parent_id_health_hour_sessions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."health_hour_sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v" ADD CONSTRAINT "_health_hour_sessions_v_version_flyer_id_media_id_fk" FOREIGN KEY ("version_flyer_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_health_hour_sessions_v_locales" ADD CONSTRAINT "_health_hour_sessions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_health_hour_sessions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."events_schedule" ADD CONSTRAINT "events_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."events_schedule_locales" ADD CONSTRAINT "events_schedule_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."events_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."events_speakers" ADD CONSTRAINT "events_speakers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."events_speakers" ADD CONSTRAINT "events_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."events_speakers_locales" ADD CONSTRAINT "events_speakers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."events_speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."events" ADD CONSTRAINT "events_gallery_id_albums_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "cms"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."events_locales" ADD CONSTRAINT "events_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."events_texts" ADD CONSTRAINT "events_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_events_v_version_schedule" ADD CONSTRAINT "_events_v_version_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_events_v_version_schedule_locales" ADD CONSTRAINT "_events_v_version_schedule_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_events_v_version_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_events_v_version_speakers" ADD CONSTRAINT "_events_v_version_speakers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_events_v_version_speakers" ADD CONSTRAINT "_events_v_version_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_events_v_version_speakers_locales" ADD CONSTRAINT "_events_v_version_speakers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_events_v_version_speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_events_v" ADD CONSTRAINT "_events_v_version_gallery_id_albums_id_fk" FOREIGN KEY ("version_gallery_id") REFERENCES "cms"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_events_v_locales" ADD CONSTRAINT "_events_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_events_v_texts" ADD CONSTRAINT "_events_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "cms"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."services_needs" ADD CONSTRAINT "services_needs_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."services" ADD CONSTRAINT "services_flyer_id_media_id_fk" FOREIGN KEY ("flyer_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."services_locales" ADD CONSTRAINT "services_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."services_texts" ADD CONSTRAINT "services_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_services_v_version_needs" ADD CONSTRAINT "_services_v_version_needs_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_services_v" ADD CONSTRAINT "_services_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_services_v" ADD CONSTRAINT "_services_v_version_flyer_id_media_id_fk" FOREIGN KEY ("version_flyer_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_services_v_locales" ADD CONSTRAINT "_services_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_services_v_texts" ADD CONSTRAINT "_services_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."programmes" ADD CONSTRAINT "programmes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."programmes_locales" ADD CONSTRAINT "programmes_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."programmes_locales" ADD CONSTRAINT "programmes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."programmes_texts" ADD CONSTRAINT "programmes_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_programmes_v" ADD CONSTRAINT "_programmes_v_parent_id_programmes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_programmes_v" ADD CONSTRAINT "_programmes_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_programmes_v_locales" ADD CONSTRAINT "_programmes_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_programmes_v_locales" ADD CONSTRAINT "_programmes_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_programmes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_programmes_v_texts" ADD CONSTRAINT "_programmes_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_programmes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."people_locales" ADD CONSTRAINT "people_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."publications" ADD CONSTRAINT "publications_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."publications" ADD CONSTRAINT "publications_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."publications_locales" ADD CONSTRAINT "publications_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."publications_locales" ADD CONSTRAINT "publications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."publications_texts" ADD CONSTRAINT "publications_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_publications_v" ADD CONSTRAINT "_publications_v_parent_id_publications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_publications_v" ADD CONSTRAINT "_publications_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_publications_v" ADD CONSTRAINT "_publications_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_publications_v_locales" ADD CONSTRAINT "_publications_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_publications_v_locales" ADD CONSTRAINT "_publications_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_publications_v_texts" ADD CONSTRAINT "_publications_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."posts" ADD CONSTRAINT "posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_posts_v" ADD CONSTRAINT "_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."videos" ADD CONSTRAINT "videos_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."videos_locales" ADD CONSTRAINT "videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."albums" ADD CONSTRAINT "albums_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."albums_locales" ADD CONSTRAINT "albums_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."albums_rels" ADD CONSTRAINT "albums_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."jobs" ADD CONSTRAINT "jobs_pack_id_media_id_fk" FOREIGN KEY ("pack_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."jobs_locales" ADD CONSTRAINT "jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."jobs_texts" ADD CONSTRAINT "jobs_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_jobs_v" ADD CONSTRAINT "_jobs_v_version_pack_id_media_id_fk" FOREIGN KEY ("version_pack_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_jobs_v_locales" ADD CONSTRAINT "_jobs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_jobs_v_texts" ADD CONSTRAINT "_jobs_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."grants" ADD CONSTRAINT "grants_guidance_id_media_id_fk" FOREIGN KEY ("guidance_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."grants_locales" ADD CONSTRAINT "grants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."grants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."grants_texts" ADD CONSTRAINT "grants_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."grants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_grants_v" ADD CONSTRAINT "_grants_v_parent_id_grants_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."grants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_grants_v" ADD CONSTRAINT "_grants_v_version_guidance_id_media_id_fk" FOREIGN KEY ("version_guidance_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_grants_v_locales" ADD CONSTRAINT "_grants_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_grants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_grants_v_texts" ADD CONSTRAINT "_grants_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_grants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."subscribers_topics" ADD CONSTRAINT "subscribers_topics_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "cms"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."users_sections" ADD CONSTRAINT "users_sections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "cms"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "cms"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "cms"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "cms"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "cms"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "cms"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."search_rels" ADD CONSTRAINT "search_rels_health_hour_sessions_fk" FOREIGN KEY ("health_hour_sessions_id") REFERENCES "cms"."health_hour_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "cms"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "cms"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_banners_fk" FOREIGN KEY ("banners_id") REFERENCES "cms"."banners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "cms"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_health_hour_sessions_fk" FOREIGN KEY ("health_hour_sessions_id") REFERENCES "cms"."health_hour_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "cms"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk" FOREIGN KEY ("event_registrations_id") REFERENCES "cms"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "cms"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "cms"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "cms"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "cms"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "cms"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "cms"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "cms"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "cms"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grants_fk" FOREIGN KEY ("grants_id") REFERENCES "cms"."grants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "cms"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donations_fk" FOREIGN KEY ("donations_id") REFERENCES "cms"."donations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "cms"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "cms"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "cms"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "cms"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."homepage_areas" ADD CONSTRAINT "homepage_areas_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."homepage_areas" ADD CONSTRAINT "homepage_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."homepage_areas_locales" ADD CONSTRAINT "homepage_areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."homepage_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."homepage" ADD CONSTRAINT "homepage_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."homepage" ADD CONSTRAINT "homepage_ceo_video_file_id_media_id_fk" FOREIGN KEY ("ceo_video_file_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."homepage" ADD CONSTRAINT "homepage_ceo_video_captions_id_media_id_fk" FOREIGN KEY ("ceo_video_captions_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."homepage" ADD CONSTRAINT "homepage_ceo_video_poster_id_media_id_fk" FOREIGN KEY ("ceo_video_poster_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."homepage_locales" ADD CONSTRAINT "homepage_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."homepage_rels" ADD CONSTRAINT "homepage_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."homepage_rels" ADD CONSTRAINT "homepage_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "cms"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v_version_areas" ADD CONSTRAINT "_homepage_v_version_areas_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v_version_areas" ADD CONSTRAINT "_homepage_v_version_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v_version_areas_locales" ADD CONSTRAINT "_homepage_v_version_areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_homepage_v_version_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v" ADD CONSTRAINT "_homepage_v_version_ceo_video_file_id_media_id_fk" FOREIGN KEY ("version_ceo_video_file_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v" ADD CONSTRAINT "_homepage_v_version_ceo_video_captions_id_media_id_fk" FOREIGN KEY ("version_ceo_video_captions_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v" ADD CONSTRAINT "_homepage_v_version_ceo_video_poster_id_media_id_fk" FOREIGN KEY ("version_ceo_video_poster_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v_locales" ADD CONSTRAINT "_homepage_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v_locales" ADD CONSTRAINT "_homepage_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "cms"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_main_nav_children" ADD CONSTRAINT "site_settings_main_nav_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_main_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_main_nav_children_locales" ADD CONSTRAINT "site_settings_main_nav_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_main_nav_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_main_nav" ADD CONSTRAINT "site_settings_main_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_main_nav_locales" ADD CONSTRAINT "site_settings_main_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_main_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_footer_columns_links" ADD CONSTRAINT "site_settings_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_footer_columns_links_locales" ADD CONSTRAINT "site_settings_footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_footer_columns" ADD CONSTRAINT "site_settings_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_footer_columns_locales" ADD CONSTRAINT "site_settings_footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_mascot_id_media_id_fk" FOREIGN KEY ("mascot_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."donation_settings_currencies" ADD CONSTRAINT "donation_settings_currencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."donation_settings_currencies_locales" ADD CONSTRAINT "donation_settings_currencies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."donation_settings_currencies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."donation_settings_impacts" ADD CONSTRAINT "donation_settings_impacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."donation_settings_impacts_locales" ADD CONSTRAINT "donation_settings_impacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."donation_settings_impacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."donation_settings_locales" ADD CONSTRAINT "donation_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."donation_settings_texts" ADD CONSTRAINT "donation_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."donation_settings_numbers" ADD CONSTRAINT "donation_settings_numbers_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_subnav_order_idx" ON "cms"."pages_subnav" USING btree ("_order");
  CREATE INDEX "pages_subnav_parent_id_idx" ON "cms"."pages_subnav" USING btree ("_parent_id");
  CREATE INDEX "pages_subnav_locale_idx" ON "cms"."pages_subnav" USING btree ("_locale");
  CREATE INDEX "pages_blocks_page_header_order_idx" ON "cms"."pages_blocks_page_header" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_parent_id_idx" ON "cms"."pages_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_path_idx" ON "cms"."pages_blocks_page_header" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_locale_idx" ON "cms"."pages_blocks_page_header" USING btree ("_locale");
  CREATE INDEX "pages_blocks_page_header_image_idx" ON "cms"."pages_blocks_page_header" USING btree ("image_id");
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "cms"."pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "cms"."pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_items_locale_idx" ON "cms"."pages_blocks_timeline_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "cms"."pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "cms"."pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "cms"."pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_locale_idx" ON "cms"."pages_blocks_timeline" USING btree ("_locale");
  CREATE INDEX "pages_blocks_columns_columns_order_idx" ON "cms"."pages_blocks_columns_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_columns_columns_parent_id_idx" ON "cms"."pages_blocks_columns_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_columns_columns_locale_idx" ON "cms"."pages_blocks_columns_columns" USING btree ("_locale");
  CREATE INDEX "pages_blocks_columns_order_idx" ON "cms"."pages_blocks_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_columns_parent_id_idx" ON "cms"."pages_blocks_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_columns_path_idx" ON "cms"."pages_blocks_columns" USING btree ("_path");
  CREATE INDEX "pages_blocks_columns_locale_idx" ON "cms"."pages_blocks_columns" USING btree ("_locale");
  CREATE INDEX "pages_blocks_dot_grid_items_order_idx" ON "cms"."pages_blocks_dot_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_dot_grid_items_parent_id_idx" ON "cms"."pages_blocks_dot_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_dot_grid_items_locale_idx" ON "cms"."pages_blocks_dot_grid_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_dot_grid_order_idx" ON "cms"."pages_blocks_dot_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_dot_grid_parent_id_idx" ON "cms"."pages_blocks_dot_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_dot_grid_path_idx" ON "cms"."pages_blocks_dot_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_dot_grid_locale_idx" ON "cms"."pages_blocks_dot_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_numbered_cards_cards_order_idx" ON "cms"."pages_blocks_numbered_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_cards_cards_parent_id_idx" ON "cms"."pages_blocks_numbered_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_cards_cards_locale_idx" ON "cms"."pages_blocks_numbered_cards_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_numbered_cards_order_idx" ON "cms"."pages_blocks_numbered_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_cards_parent_id_idx" ON "cms"."pages_blocks_numbered_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_cards_path_idx" ON "cms"."pages_blocks_numbered_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_numbered_cards_locale_idx" ON "cms"."pages_blocks_numbered_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_people_teams_order_idx" ON "cms"."pages_blocks_people_teams" USING btree ("order");
  CREATE INDEX "pages_blocks_people_teams_parent_idx" ON "cms"."pages_blocks_people_teams" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_people_teams_locale_idx" ON "cms"."pages_blocks_people_teams" USING btree ("locale");
  CREATE INDEX "pages_blocks_people_order_idx" ON "cms"."pages_blocks_people" USING btree ("_order");
  CREATE INDEX "pages_blocks_people_parent_id_idx" ON "cms"."pages_blocks_people" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_people_path_idx" ON "cms"."pages_blocks_people" USING btree ("_path");
  CREATE INDEX "pages_blocks_people_locale_idx" ON "cms"."pages_blocks_people" USING btree ("_locale");
  CREATE INDEX "pages_blocks_split_links_order_idx" ON "cms"."pages_blocks_split_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_links_parent_id_idx" ON "cms"."pages_blocks_split_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_links_locale_idx" ON "cms"."pages_blocks_split_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_split_order_idx" ON "cms"."pages_blocks_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_parent_id_idx" ON "cms"."pages_blocks_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_path_idx" ON "cms"."pages_blocks_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_locale_idx" ON "cms"."pages_blocks_split" USING btree ("_locale");
  CREATE INDEX "pages_blocks_split_image_idx" ON "cms"."pages_blocks_split" USING btree ("image_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "cms"."pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "cms"."pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "cms"."pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_locale_idx" ON "cms"."pages_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "cms"."pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "cms"."pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "cms"."pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_locale_idx" ON "cms"."pages_blocks_cta" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "cms"."pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "cms"."pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locale_idx" ON "cms"."pages_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "cms"."pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "cms"."pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "cms"."pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_locale_idx" ON "cms"."pages_blocks_faq" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_order_idx" ON "cms"."pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "cms"."pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "cms"."pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_locale_idx" ON "cms"."pages_blocks_video" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_file_idx" ON "cms"."pages_blocks_video" USING btree ("file_id");
  CREATE INDEX "pages_blocks_video_poster_idx" ON "cms"."pages_blocks_video" USING btree ("poster_id");
  CREATE INDEX "pages_blocks_partners_order_idx" ON "cms"."pages_blocks_partners" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_parent_id_idx" ON "cms"."pages_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_path_idx" ON "cms"."pages_blocks_partners" USING btree ("_path");
  CREATE INDEX "pages_blocks_partners_locale_idx" ON "cms"."pages_blocks_partners" USING btree ("_locale");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "cms"."pages" USING btree ("slug");
  CREATE INDEX "pages_parent_idx" ON "cms"."pages" USING btree ("parent_id");
  CREATE INDEX "pages_path_idx" ON "cms"."pages" USING btree ("path");
  CREATE INDEX "pages_updated_at_idx" ON "cms"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "cms"."pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "cms"."pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "cms"."pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "cms"."pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "cms"."pages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_texts_order_parent" ON "cms"."pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_version_subnav_order_idx" ON "cms"."_pages_v_version_subnav" USING btree ("_order");
  CREATE INDEX "_pages_v_version_subnav_parent_id_idx" ON "cms"."_pages_v_version_subnav" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_subnav_locale_idx" ON "cms"."_pages_v_version_subnav" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_page_header_order_idx" ON "cms"."_pages_v_blocks_page_header" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_parent_id_idx" ON "cms"."_pages_v_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_path_idx" ON "cms"."_pages_v_blocks_page_header" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_locale_idx" ON "cms"."_pages_v_blocks_page_header" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_page_header_image_idx" ON "cms"."_pages_v_blocks_page_header" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_order_idx" ON "cms"."_pages_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_items_parent_id_idx" ON "cms"."_pages_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_locale_idx" ON "cms"."_pages_v_blocks_timeline_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "cms"."_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "cms"."_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "cms"."_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_locale_idx" ON "cms"."_pages_v_blocks_timeline" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_columns_columns_order_idx" ON "cms"."_pages_v_blocks_columns_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_columns_columns_parent_id_idx" ON "cms"."_pages_v_blocks_columns_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_columns_columns_locale_idx" ON "cms"."_pages_v_blocks_columns_columns" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_columns_order_idx" ON "cms"."_pages_v_blocks_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_columns_parent_id_idx" ON "cms"."_pages_v_blocks_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_columns_path_idx" ON "cms"."_pages_v_blocks_columns" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_columns_locale_idx" ON "cms"."_pages_v_blocks_columns" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_dot_grid_items_order_idx" ON "cms"."_pages_v_blocks_dot_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_dot_grid_items_parent_id_idx" ON "cms"."_pages_v_blocks_dot_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_dot_grid_items_locale_idx" ON "cms"."_pages_v_blocks_dot_grid_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_dot_grid_order_idx" ON "cms"."_pages_v_blocks_dot_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_dot_grid_parent_id_idx" ON "cms"."_pages_v_blocks_dot_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_dot_grid_path_idx" ON "cms"."_pages_v_blocks_dot_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_dot_grid_locale_idx" ON "cms"."_pages_v_blocks_dot_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_numbered_cards_cards_order_idx" ON "cms"."_pages_v_blocks_numbered_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_cards_cards_parent_id_idx" ON "cms"."_pages_v_blocks_numbered_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_cards_cards_locale_idx" ON "cms"."_pages_v_blocks_numbered_cards_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_numbered_cards_order_idx" ON "cms"."_pages_v_blocks_numbered_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_cards_parent_id_idx" ON "cms"."_pages_v_blocks_numbered_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_cards_path_idx" ON "cms"."_pages_v_blocks_numbered_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_numbered_cards_locale_idx" ON "cms"."_pages_v_blocks_numbered_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_people_teams_order_idx" ON "cms"."_pages_v_blocks_people_teams" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_people_teams_parent_idx" ON "cms"."_pages_v_blocks_people_teams" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_people_teams_locale_idx" ON "cms"."_pages_v_blocks_people_teams" USING btree ("locale");
  CREATE INDEX "_pages_v_blocks_people_order_idx" ON "cms"."_pages_v_blocks_people" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_people_parent_id_idx" ON "cms"."_pages_v_blocks_people" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_people_path_idx" ON "cms"."_pages_v_blocks_people" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_people_locale_idx" ON "cms"."_pages_v_blocks_people" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_split_links_order_idx" ON "cms"."_pages_v_blocks_split_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_links_parent_id_idx" ON "cms"."_pages_v_blocks_split_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_links_locale_idx" ON "cms"."_pages_v_blocks_split_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_split_order_idx" ON "cms"."_pages_v_blocks_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_parent_id_idx" ON "cms"."_pages_v_blocks_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_path_idx" ON "cms"."_pages_v_blocks_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_locale_idx" ON "cms"."_pages_v_blocks_split" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_split_image_idx" ON "cms"."_pages_v_blocks_split" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "cms"."_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "cms"."_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "cms"."_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_locale_idx" ON "cms"."_pages_v_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "cms"."_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "cms"."_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "cms"."_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_locale_idx" ON "cms"."_pages_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "cms"."_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "cms"."_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_locale_idx" ON "cms"."_pages_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "cms"."_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "cms"."_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "cms"."_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_locale_idx" ON "cms"."_pages_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "cms"."_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "cms"."_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "cms"."_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_locale_idx" ON "cms"."_pages_v_blocks_video" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_file_idx" ON "cms"."_pages_v_blocks_video" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_video_poster_idx" ON "cms"."_pages_v_blocks_video" USING btree ("poster_id");
  CREATE INDEX "_pages_v_blocks_partners_order_idx" ON "cms"."_pages_v_blocks_partners" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_parent_id_idx" ON "cms"."_pages_v_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_path_idx" ON "cms"."_pages_v_blocks_partners" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_partners_locale_idx" ON "cms"."_pages_v_blocks_partners" USING btree ("_locale");
  CREATE INDEX "_pages_v_parent_idx" ON "cms"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "cms"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "cms"."_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_path_idx" ON "cms"."_pages_v" USING btree ("version_path");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "cms"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "cms"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "cms"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "cms"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "cms"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "cms"."_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "cms"."_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "cms"."_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "cms"."_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "cms"."_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "cms"."_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "cms"."_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_texts_order_parent" ON "cms"."_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "banners__order_idx" ON "cms"."banners" USING btree ("_order");
  CREATE INDEX "banners_image_idx" ON "cms"."banners" USING btree ("image_id");
  CREATE INDEX "banners_video_idx" ON "cms"."banners" USING btree ("video_id");
  CREATE INDEX "banners_updated_at_idx" ON "cms"."banners" USING btree ("updated_at");
  CREATE INDEX "banners_created_at_idx" ON "cms"."banners" USING btree ("created_at");
  CREATE INDEX "banners__status_idx" ON "cms"."banners" USING btree ("_status");
  CREATE UNIQUE INDEX "banners_locales_locale_parent_id_unique" ON "cms"."banners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "banners_locales_parent_id_idx" ON "cms"."banners_locales" USING btree ("_parent_id");
  CREATE INDEX "_banners_v_parent_idx" ON "cms"."_banners_v" USING btree ("parent_id");
  CREATE INDEX "_banners_v_version_version__order_idx" ON "cms"."_banners_v" USING btree ("version__order");
  CREATE INDEX "_banners_v_version_version_image_idx" ON "cms"."_banners_v" USING btree ("version_image_id");
  CREATE INDEX "_banners_v_version_version_video_idx" ON "cms"."_banners_v" USING btree ("version_video_id");
  CREATE INDEX "_banners_v_version_version_updated_at_idx" ON "cms"."_banners_v" USING btree ("version_updated_at");
  CREATE INDEX "_banners_v_version_version_created_at_idx" ON "cms"."_banners_v" USING btree ("version_created_at");
  CREATE INDEX "_banners_v_version_version__status_idx" ON "cms"."_banners_v" USING btree ("version__status");
  CREATE INDEX "_banners_v_created_at_idx" ON "cms"."_banners_v" USING btree ("created_at");
  CREATE INDEX "_banners_v_updated_at_idx" ON "cms"."_banners_v" USING btree ("updated_at");
  CREATE INDEX "_banners_v_snapshot_idx" ON "cms"."_banners_v" USING btree ("snapshot");
  CREATE INDEX "_banners_v_published_locale_idx" ON "cms"."_banners_v" USING btree ("published_locale");
  CREATE INDEX "_banners_v_latest_idx" ON "cms"."_banners_v" USING btree ("latest");
  CREATE INDEX "_banners_v_autosave_idx" ON "cms"."_banners_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_banners_v_locales_locale_parent_id_unique" ON "cms"."_banners_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_banners_v_locales_parent_id_idx" ON "cms"."_banners_v_locales" USING btree ("_parent_id");
  CREATE INDEX "partners__order_idx" ON "cms"."partners" USING btree ("_order");
  CREATE INDEX "partners_logo_idx" ON "cms"."partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "cms"."partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "cms"."partners" USING btree ("created_at");
  CREATE INDEX "health_hour_sessions_speakers_order_idx" ON "cms"."health_hour_sessions_speakers" USING btree ("_order");
  CREATE INDEX "health_hour_sessions_speakers_parent_id_idx" ON "cms"."health_hour_sessions_speakers" USING btree ("_parent_id");
  CREATE INDEX "health_hour_sessions_speakers_photo_idx" ON "cms"."health_hour_sessions_speakers" USING btree ("photo_id");
  CREATE UNIQUE INDEX "health_hour_sessions_speakers_locales_locale_parent_id_uniqu" ON "cms"."health_hour_sessions_speakers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "health_hour_sessions_speakers_locales_parent_id_idx" ON "cms"."health_hour_sessions_speakers_locales" USING btree ("_parent_id");
  CREATE INDEX "health_hour_sessions_resources_order_idx" ON "cms"."health_hour_sessions_resources" USING btree ("_order");
  CREATE INDEX "health_hour_sessions_resources_parent_id_idx" ON "cms"."health_hour_sessions_resources" USING btree ("_parent_id");
  CREATE INDEX "health_hour_sessions_resources_file_idx" ON "cms"."health_hour_sessions_resources" USING btree ("file_id");
  CREATE UNIQUE INDEX "health_hour_sessions_resources_locales_locale_parent_id_uniq" ON "cms"."health_hour_sessions_resources_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "health_hour_sessions_resources_locales_parent_id_idx" ON "cms"."health_hour_sessions_resources_locales" USING btree ("_parent_id");
  CREATE INDEX "health_hour_sessions__order_idx" ON "cms"."health_hour_sessions" USING btree ("_order");
  CREATE INDEX "health_hour_sessions_flyer_idx" ON "cms"."health_hour_sessions" USING btree ("flyer_id");
  CREATE INDEX "health_hour_sessions_updated_at_idx" ON "cms"."health_hour_sessions" USING btree ("updated_at");
  CREATE INDEX "health_hour_sessions_created_at_idx" ON "cms"."health_hour_sessions" USING btree ("created_at");
  CREATE INDEX "health_hour_sessions__status_idx" ON "cms"."health_hour_sessions" USING btree ("_status");
  CREATE UNIQUE INDEX "health_hour_sessions_locales_locale_parent_id_unique" ON "cms"."health_hour_sessions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "health_hour_sessions_locales_parent_id_idx" ON "cms"."health_hour_sessions_locales" USING btree ("_parent_id");
  CREATE INDEX "_health_hour_sessions_v_version_speakers_order_idx" ON "cms"."_health_hour_sessions_v_version_speakers" USING btree ("_order");
  CREATE INDEX "_health_hour_sessions_v_version_speakers_parent_id_idx" ON "cms"."_health_hour_sessions_v_version_speakers" USING btree ("_parent_id");
  CREATE INDEX "_health_hour_sessions_v_version_speakers_photo_idx" ON "cms"."_health_hour_sessions_v_version_speakers" USING btree ("photo_id");
  CREATE UNIQUE INDEX "_health_hour_sessions_v_version_speakers_locales_locale_pare" ON "cms"."_health_hour_sessions_v_version_speakers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_health_hour_sessions_v_version_speakers_locales_parent__idx" ON "cms"."_health_hour_sessions_v_version_speakers_locales" USING btree ("_parent_id");
  CREATE INDEX "_health_hour_sessions_v_version_resources_order_idx" ON "cms"."_health_hour_sessions_v_version_resources" USING btree ("_order");
  CREATE INDEX "_health_hour_sessions_v_version_resources_parent_id_idx" ON "cms"."_health_hour_sessions_v_version_resources" USING btree ("_parent_id");
  CREATE INDEX "_health_hour_sessions_v_version_resources_file_idx" ON "cms"."_health_hour_sessions_v_version_resources" USING btree ("file_id");
  CREATE UNIQUE INDEX "_health_hour_sessions_v_version_resources_locales_locale_par" ON "cms"."_health_hour_sessions_v_version_resources_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_health_hour_sessions_v_version_resources_locales_parent_idx" ON "cms"."_health_hour_sessions_v_version_resources_locales" USING btree ("_parent_id");
  CREATE INDEX "_health_hour_sessions_v_parent_idx" ON "cms"."_health_hour_sessions_v" USING btree ("parent_id");
  CREATE INDEX "_health_hour_sessions_v_version_version__order_idx" ON "cms"."_health_hour_sessions_v" USING btree ("version__order");
  CREATE INDEX "_health_hour_sessions_v_version_version_flyer_idx" ON "cms"."_health_hour_sessions_v" USING btree ("version_flyer_id");
  CREATE INDEX "_health_hour_sessions_v_version_version_updated_at_idx" ON "cms"."_health_hour_sessions_v" USING btree ("version_updated_at");
  CREATE INDEX "_health_hour_sessions_v_version_version_created_at_idx" ON "cms"."_health_hour_sessions_v" USING btree ("version_created_at");
  CREATE INDEX "_health_hour_sessions_v_version_version__status_idx" ON "cms"."_health_hour_sessions_v" USING btree ("version__status");
  CREATE INDEX "_health_hour_sessions_v_created_at_idx" ON "cms"."_health_hour_sessions_v" USING btree ("created_at");
  CREATE INDEX "_health_hour_sessions_v_updated_at_idx" ON "cms"."_health_hour_sessions_v" USING btree ("updated_at");
  CREATE INDEX "_health_hour_sessions_v_snapshot_idx" ON "cms"."_health_hour_sessions_v" USING btree ("snapshot");
  CREATE INDEX "_health_hour_sessions_v_published_locale_idx" ON "cms"."_health_hour_sessions_v" USING btree ("published_locale");
  CREATE INDEX "_health_hour_sessions_v_latest_idx" ON "cms"."_health_hour_sessions_v" USING btree ("latest");
  CREATE INDEX "_health_hour_sessions_v_autosave_idx" ON "cms"."_health_hour_sessions_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_health_hour_sessions_v_locales_locale_parent_id_unique" ON "cms"."_health_hour_sessions_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_health_hour_sessions_v_locales_parent_id_idx" ON "cms"."_health_hour_sessions_v_locales" USING btree ("_parent_id");
  CREATE INDEX "events_schedule_order_idx" ON "cms"."events_schedule" USING btree ("_order");
  CREATE INDEX "events_schedule_parent_id_idx" ON "cms"."events_schedule" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_schedule_locales_locale_parent_id_unique" ON "cms"."events_schedule_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_schedule_locales_parent_id_idx" ON "cms"."events_schedule_locales" USING btree ("_parent_id");
  CREATE INDEX "events_speakers_order_idx" ON "cms"."events_speakers" USING btree ("_order");
  CREATE INDEX "events_speakers_parent_id_idx" ON "cms"."events_speakers" USING btree ("_parent_id");
  CREATE INDEX "events_speakers_photo_idx" ON "cms"."events_speakers" USING btree ("photo_id");
  CREATE UNIQUE INDEX "events_speakers_locales_locale_parent_id_unique" ON "cms"."events_speakers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_speakers_locales_parent_id_idx" ON "cms"."events_speakers_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "cms"."events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "cms"."events" USING btree ("image_id");
  CREATE INDEX "events_gallery_idx" ON "cms"."events" USING btree ("gallery_id");
  CREATE INDEX "events_updated_at_idx" ON "cms"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "cms"."events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "cms"."events" USING btree ("_status");
  CREATE INDEX "events_meta_meta_image_idx" ON "cms"."events_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "cms"."events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_locales_parent_id_idx" ON "cms"."events_locales" USING btree ("_parent_id");
  CREATE INDEX "events_texts_order_parent" ON "cms"."events_texts" USING btree ("order","parent_id");
  CREATE INDEX "_events_v_version_schedule_order_idx" ON "cms"."_events_v_version_schedule" USING btree ("_order");
  CREATE INDEX "_events_v_version_schedule_parent_id_idx" ON "cms"."_events_v_version_schedule" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_events_v_version_schedule_locales_locale_parent_id_unique" ON "cms"."_events_v_version_schedule_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_version_schedule_locales_parent_id_idx" ON "cms"."_events_v_version_schedule_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_speakers_order_idx" ON "cms"."_events_v_version_speakers" USING btree ("_order");
  CREATE INDEX "_events_v_version_speakers_parent_id_idx" ON "cms"."_events_v_version_speakers" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_speakers_photo_idx" ON "cms"."_events_v_version_speakers" USING btree ("photo_id");
  CREATE UNIQUE INDEX "_events_v_version_speakers_locales_locale_parent_id_unique" ON "cms"."_events_v_version_speakers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_version_speakers_locales_parent_id_idx" ON "cms"."_events_v_version_speakers_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "cms"."_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "cms"."_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_image_idx" ON "cms"."_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_gallery_idx" ON "cms"."_events_v" USING btree ("version_gallery_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "cms"."_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "cms"."_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "cms"."_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "cms"."_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "cms"."_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "cms"."_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "cms"."_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "cms"."_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "cms"."_events_v" USING btree ("autosave");
  CREATE INDEX "_events_v_version_meta_version_meta_image_idx" ON "cms"."_events_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "cms"."_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_locales_parent_id_idx" ON "cms"."_events_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_texts_order_parent" ON "cms"."_events_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "event_registrations_event_idx" ON "cms"."event_registrations" USING btree ("event_id");
  CREATE INDEX "event_registrations_updated_at_idx" ON "cms"."event_registrations" USING btree ("updated_at");
  CREATE INDEX "event_registrations_created_at_idx" ON "cms"."event_registrations" USING btree ("created_at");
  CREATE INDEX "services_needs_order_idx" ON "cms"."services_needs" USING btree ("order");
  CREATE INDEX "services_needs_parent_idx" ON "cms"."services_needs" USING btree ("parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "cms"."services" USING btree ("slug");
  CREATE INDEX "services_image_idx" ON "cms"."services" USING btree ("image_id");
  CREATE INDEX "services_flyer_idx" ON "cms"."services" USING btree ("flyer_id");
  CREATE INDEX "services_updated_at_idx" ON "cms"."services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "cms"."services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "cms"."services" USING btree ("_status");
  CREATE INDEX "services_meta_meta_image_idx" ON "cms"."services_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "cms"."services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_locales_parent_id_idx" ON "cms"."services_locales" USING btree ("_parent_id");
  CREATE INDEX "services_texts_order_parent" ON "cms"."services_texts" USING btree ("order","parent_id");
  CREATE INDEX "_services_v_version_needs_order_idx" ON "cms"."_services_v_version_needs" USING btree ("order");
  CREATE INDEX "_services_v_version_needs_parent_idx" ON "cms"."_services_v_version_needs" USING btree ("parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "cms"."_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "cms"."_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_image_idx" ON "cms"."_services_v" USING btree ("version_image_id");
  CREATE INDEX "_services_v_version_version_flyer_idx" ON "cms"."_services_v" USING btree ("version_flyer_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "cms"."_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "cms"."_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "cms"."_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "cms"."_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "cms"."_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "cms"."_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "cms"."_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "cms"."_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_autosave_idx" ON "cms"."_services_v" USING btree ("autosave");
  CREATE INDEX "_services_v_version_meta_version_meta_image_idx" ON "cms"."_services_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "cms"."_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_locales_parent_id_idx" ON "cms"."_services_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_texts_order_parent" ON "cms"."_services_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "programmes_slug_idx" ON "cms"."programmes" USING btree ("slug");
  CREATE INDEX "programmes_image_idx" ON "cms"."programmes" USING btree ("image_id");
  CREATE INDEX "programmes_updated_at_idx" ON "cms"."programmes" USING btree ("updated_at");
  CREATE INDEX "programmes_created_at_idx" ON "cms"."programmes" USING btree ("created_at");
  CREATE INDEX "programmes__status_idx" ON "cms"."programmes" USING btree ("_status");
  CREATE INDEX "programmes_meta_meta_image_idx" ON "cms"."programmes_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "programmes_locales_locale_parent_id_unique" ON "cms"."programmes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programmes_locales_parent_id_idx" ON "cms"."programmes_locales" USING btree ("_parent_id");
  CREATE INDEX "programmes_texts_order_parent" ON "cms"."programmes_texts" USING btree ("order","parent_id");
  CREATE INDEX "_programmes_v_parent_idx" ON "cms"."_programmes_v" USING btree ("parent_id");
  CREATE INDEX "_programmes_v_version_version_slug_idx" ON "cms"."_programmes_v" USING btree ("version_slug");
  CREATE INDEX "_programmes_v_version_version_image_idx" ON "cms"."_programmes_v" USING btree ("version_image_id");
  CREATE INDEX "_programmes_v_version_version_updated_at_idx" ON "cms"."_programmes_v" USING btree ("version_updated_at");
  CREATE INDEX "_programmes_v_version_version_created_at_idx" ON "cms"."_programmes_v" USING btree ("version_created_at");
  CREATE INDEX "_programmes_v_version_version__status_idx" ON "cms"."_programmes_v" USING btree ("version__status");
  CREATE INDEX "_programmes_v_created_at_idx" ON "cms"."_programmes_v" USING btree ("created_at");
  CREATE INDEX "_programmes_v_updated_at_idx" ON "cms"."_programmes_v" USING btree ("updated_at");
  CREATE INDEX "_programmes_v_snapshot_idx" ON "cms"."_programmes_v" USING btree ("snapshot");
  CREATE INDEX "_programmes_v_published_locale_idx" ON "cms"."_programmes_v" USING btree ("published_locale");
  CREATE INDEX "_programmes_v_latest_idx" ON "cms"."_programmes_v" USING btree ("latest");
  CREATE INDEX "_programmes_v_autosave_idx" ON "cms"."_programmes_v" USING btree ("autosave");
  CREATE INDEX "_programmes_v_version_meta_version_meta_image_idx" ON "cms"."_programmes_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_programmes_v_locales_locale_parent_id_unique" ON "cms"."_programmes_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_programmes_v_locales_parent_id_idx" ON "cms"."_programmes_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_programmes_v_texts_order_parent" ON "cms"."_programmes_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "people__order_idx" ON "cms"."people" USING btree ("_order");
  CREATE INDEX "people_photo_idx" ON "cms"."people" USING btree ("photo_id");
  CREATE INDEX "people_updated_at_idx" ON "cms"."people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "cms"."people" USING btree ("created_at");
  CREATE UNIQUE INDEX "people_locales_locale_parent_id_unique" ON "cms"."people_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "people_locales_parent_id_idx" ON "cms"."people_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "publications_slug_idx" ON "cms"."publications" USING btree ("slug");
  CREATE INDEX "publications_file_idx" ON "cms"."publications" USING btree ("file_id");
  CREATE INDEX "publications_cover_idx" ON "cms"."publications" USING btree ("cover_id");
  CREATE INDEX "publications_updated_at_idx" ON "cms"."publications" USING btree ("updated_at");
  CREATE INDEX "publications_created_at_idx" ON "cms"."publications" USING btree ("created_at");
  CREATE INDEX "publications__status_idx" ON "cms"."publications" USING btree ("_status");
  CREATE INDEX "publications_meta_meta_image_idx" ON "cms"."publications_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "publications_locales_locale_parent_id_unique" ON "cms"."publications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "publications_locales_parent_id_idx" ON "cms"."publications_locales" USING btree ("_parent_id");
  CREATE INDEX "publications_texts_order_parent" ON "cms"."publications_texts" USING btree ("order","parent_id");
  CREATE INDEX "_publications_v_parent_idx" ON "cms"."_publications_v" USING btree ("parent_id");
  CREATE INDEX "_publications_v_version_version_slug_idx" ON "cms"."_publications_v" USING btree ("version_slug");
  CREATE INDEX "_publications_v_version_version_file_idx" ON "cms"."_publications_v" USING btree ("version_file_id");
  CREATE INDEX "_publications_v_version_version_cover_idx" ON "cms"."_publications_v" USING btree ("version_cover_id");
  CREATE INDEX "_publications_v_version_version_updated_at_idx" ON "cms"."_publications_v" USING btree ("version_updated_at");
  CREATE INDEX "_publications_v_version_version_created_at_idx" ON "cms"."_publications_v" USING btree ("version_created_at");
  CREATE INDEX "_publications_v_version_version__status_idx" ON "cms"."_publications_v" USING btree ("version__status");
  CREATE INDEX "_publications_v_created_at_idx" ON "cms"."_publications_v" USING btree ("created_at");
  CREATE INDEX "_publications_v_updated_at_idx" ON "cms"."_publications_v" USING btree ("updated_at");
  CREATE INDEX "_publications_v_snapshot_idx" ON "cms"."_publications_v" USING btree ("snapshot");
  CREATE INDEX "_publications_v_published_locale_idx" ON "cms"."_publications_v" USING btree ("published_locale");
  CREATE INDEX "_publications_v_latest_idx" ON "cms"."_publications_v" USING btree ("latest");
  CREATE INDEX "_publications_v_autosave_idx" ON "cms"."_publications_v" USING btree ("autosave");
  CREATE INDEX "_publications_v_version_meta_version_meta_image_idx" ON "cms"."_publications_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_publications_v_locales_locale_parent_id_unique" ON "cms"."_publications_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_publications_v_locales_parent_id_idx" ON "cms"."_publications_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_publications_v_texts_order_parent" ON "cms"."_publications_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "cms"."posts" USING btree ("slug");
  CREATE INDEX "posts_image_idx" ON "cms"."posts" USING btree ("image_id");
  CREATE INDEX "posts_updated_at_idx" ON "cms"."posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "cms"."posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "cms"."posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "cms"."posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "cms"."posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "cms"."posts_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_texts_order_parent" ON "cms"."posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "cms"."_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "cms"."_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_image_idx" ON "cms"."_posts_v" USING btree ("version_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "cms"."_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "cms"."_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "cms"."_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "cms"."_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "cms"."_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "cms"."_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "cms"."_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "cms"."_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "cms"."_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "cms"."_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "cms"."_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "cms"."_posts_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_texts_order_parent" ON "cms"."_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "videos__order_idx" ON "cms"."videos" USING btree ("_order");
  CREATE INDEX "videos_thumbnail_idx" ON "cms"."videos" USING btree ("thumbnail_id");
  CREATE INDEX "videos_updated_at_idx" ON "cms"."videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "cms"."videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_locales_locale_parent_id_unique" ON "cms"."videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "videos_locales_parent_id_idx" ON "cms"."videos_locales" USING btree ("_parent_id");
  CREATE INDEX "albums__order_idx" ON "cms"."albums" USING btree ("_order");
  CREATE UNIQUE INDEX "albums_slug_idx" ON "cms"."albums" USING btree ("slug");
  CREATE INDEX "albums_cover_idx" ON "cms"."albums" USING btree ("cover_id");
  CREATE INDEX "albums_updated_at_idx" ON "cms"."albums" USING btree ("updated_at");
  CREATE INDEX "albums_created_at_idx" ON "cms"."albums" USING btree ("created_at");
  CREATE UNIQUE INDEX "albums_locales_locale_parent_id_unique" ON "cms"."albums_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "albums_locales_parent_id_idx" ON "cms"."albums_locales" USING btree ("_parent_id");
  CREATE INDEX "albums_rels_order_idx" ON "cms"."albums_rels" USING btree ("order");
  CREATE INDEX "albums_rels_parent_idx" ON "cms"."albums_rels" USING btree ("parent_id");
  CREATE INDEX "albums_rels_path_idx" ON "cms"."albums_rels" USING btree ("path");
  CREATE INDEX "albums_rels_media_id_idx" ON "cms"."albums_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "cms"."jobs" USING btree ("slug");
  CREATE INDEX "jobs_pack_idx" ON "cms"."jobs" USING btree ("pack_id");
  CREATE INDEX "jobs_updated_at_idx" ON "cms"."jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "cms"."jobs" USING btree ("created_at");
  CREATE INDEX "jobs__status_idx" ON "cms"."jobs" USING btree ("_status");
  CREATE UNIQUE INDEX "jobs_locales_locale_parent_id_unique" ON "cms"."jobs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "jobs_locales_parent_id_idx" ON "cms"."jobs_locales" USING btree ("_parent_id");
  CREATE INDEX "jobs_texts_order_parent" ON "cms"."jobs_texts" USING btree ("order","parent_id");
  CREATE INDEX "_jobs_v_parent_idx" ON "cms"."_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "cms"."_jobs_v" USING btree ("version_slug");
  CREATE INDEX "_jobs_v_version_version_pack_idx" ON "cms"."_jobs_v" USING btree ("version_pack_id");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "cms"."_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "cms"."_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "cms"."_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "cms"."_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "cms"."_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_snapshot_idx" ON "cms"."_jobs_v" USING btree ("snapshot");
  CREATE INDEX "_jobs_v_published_locale_idx" ON "cms"."_jobs_v" USING btree ("published_locale");
  CREATE INDEX "_jobs_v_latest_idx" ON "cms"."_jobs_v" USING btree ("latest");
  CREATE INDEX "_jobs_v_autosave_idx" ON "cms"."_jobs_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_jobs_v_locales_locale_parent_id_unique" ON "cms"."_jobs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_jobs_v_locales_parent_id_idx" ON "cms"."_jobs_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_texts_order_parent" ON "cms"."_jobs_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "grants_guidance_idx" ON "cms"."grants" USING btree ("guidance_id");
  CREATE INDEX "grants_updated_at_idx" ON "cms"."grants" USING btree ("updated_at");
  CREATE INDEX "grants_created_at_idx" ON "cms"."grants" USING btree ("created_at");
  CREATE INDEX "grants__status_idx" ON "cms"."grants" USING btree ("_status");
  CREATE UNIQUE INDEX "grants_locales_locale_parent_id_unique" ON "cms"."grants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "grants_locales_parent_id_idx" ON "cms"."grants_locales" USING btree ("_parent_id");
  CREATE INDEX "grants_texts_order_parent" ON "cms"."grants_texts" USING btree ("order","parent_id");
  CREATE INDEX "_grants_v_parent_idx" ON "cms"."_grants_v" USING btree ("parent_id");
  CREATE INDEX "_grants_v_version_version_guidance_idx" ON "cms"."_grants_v" USING btree ("version_guidance_id");
  CREATE INDEX "_grants_v_version_version_updated_at_idx" ON "cms"."_grants_v" USING btree ("version_updated_at");
  CREATE INDEX "_grants_v_version_version_created_at_idx" ON "cms"."_grants_v" USING btree ("version_created_at");
  CREATE INDEX "_grants_v_version_version__status_idx" ON "cms"."_grants_v" USING btree ("version__status");
  CREATE INDEX "_grants_v_created_at_idx" ON "cms"."_grants_v" USING btree ("created_at");
  CREATE INDEX "_grants_v_updated_at_idx" ON "cms"."_grants_v" USING btree ("updated_at");
  CREATE INDEX "_grants_v_snapshot_idx" ON "cms"."_grants_v" USING btree ("snapshot");
  CREATE INDEX "_grants_v_published_locale_idx" ON "cms"."_grants_v" USING btree ("published_locale");
  CREATE INDEX "_grants_v_latest_idx" ON "cms"."_grants_v" USING btree ("latest");
  CREATE INDEX "_grants_v_autosave_idx" ON "cms"."_grants_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_grants_v_locales_locale_parent_id_unique" ON "cms"."_grants_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_grants_v_locales_parent_id_idx" ON "cms"."_grants_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_grants_v_texts_order_parent" ON "cms"."_grants_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "subscribers_topics_order_idx" ON "cms"."subscribers_topics" USING btree ("order");
  CREATE INDEX "subscribers_topics_parent_idx" ON "cms"."subscribers_topics" USING btree ("parent_id");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "cms"."subscribers" USING btree ("email");
  CREATE INDEX "subscribers_token_idx" ON "cms"."subscribers" USING btree ("token");
  CREATE INDEX "subscribers_updated_at_idx" ON "cms"."subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "cms"."subscribers" USING btree ("created_at");
  CREATE UNIQUE INDEX "donations_reference_idx" ON "cms"."donations" USING btree ("reference");
  CREATE INDEX "donations_updated_at_idx" ON "cms"."donations" USING btree ("updated_at");
  CREATE INDEX "donations_created_at_idx" ON "cms"."donations" USING btree ("created_at");
  CREATE INDEX "media_folder_idx" ON "cms"."media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "cms"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "cms"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "cms"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "cms"."media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "cms"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "cms"."media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "cms"."media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "cms"."media_locales" USING btree ("_parent_id");
  CREATE INDEX "users_sections_order_idx" ON "cms"."users_sections" USING btree ("order");
  CREATE INDEX "users_sections_parent_idx" ON "cms"."users_sections" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "cms"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "cms"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "cms"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "cms"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "cms"."users" USING btree ("email");
  CREATE INDEX "search_updated_at_idx" ON "cms"."search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "cms"."search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "cms"."search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_locales_parent_id_idx" ON "cms"."search_locales" USING btree ("_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "cms"."search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "cms"."search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "cms"."search_rels" USING btree ("path");
  CREATE INDEX "search_rels_pages_id_idx" ON "cms"."search_rels" USING btree ("pages_id");
  CREATE INDEX "search_rels_services_id_idx" ON "cms"."search_rels" USING btree ("services_id");
  CREATE INDEX "search_rels_programmes_id_idx" ON "cms"."search_rels" USING btree ("programmes_id");
  CREATE INDEX "search_rels_events_id_idx" ON "cms"."search_rels" USING btree ("events_id");
  CREATE INDEX "search_rels_publications_id_idx" ON "cms"."search_rels" USING btree ("publications_id");
  CREATE INDEX "search_rels_jobs_id_idx" ON "cms"."search_rels" USING btree ("jobs_id");
  CREATE INDEX "search_rels_posts_id_idx" ON "cms"."search_rels" USING btree ("posts_id");
  CREATE INDEX "search_rels_health_hour_sessions_id_idx" ON "cms"."search_rels" USING btree ("health_hour_sessions_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "cms"."forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "cms"."forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "cms"."forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "cms"."forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_checkbox_locales_parent_id_idx" ON "cms"."forms_blocks_checkbox_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "cms"."forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "cms"."forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "cms"."forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "cms"."forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_locales_parent_id_idx" ON "cms"."forms_blocks_country_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "cms"."forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "cms"."forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "cms"."forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "cms"."forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_locales_parent_id_idx" ON "cms"."forms_blocks_email_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "cms"."forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "cms"."forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "cms"."forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "cms"."forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_locales_parent_id_idx" ON "cms"."forms_blocks_message_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "cms"."forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "cms"."forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "cms"."forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "cms"."forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_locales_parent_id_idx" ON "cms"."forms_blocks_number_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "cms"."forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "cms"."forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "cms"."forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_locales_parent_id_idx" ON "cms"."forms_blocks_select_options_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "cms"."forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "cms"."forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "cms"."forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "cms"."forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_locales_parent_id_idx" ON "cms"."forms_blocks_select_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "cms"."forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "cms"."forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "cms"."forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "cms"."forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_locales_parent_id_idx" ON "cms"."forms_blocks_text_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "cms"."forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "cms"."forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "cms"."forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "cms"."forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_locales_parent_id_idx" ON "cms"."forms_blocks_textarea_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "cms"."forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "cms"."forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "cms"."forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_locales_parent_id_idx" ON "cms"."forms_emails_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "cms"."forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "cms"."forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "cms"."forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_locales_parent_id_idx" ON "cms"."forms_locales" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "cms"."form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "cms"."form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "cms"."form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "cms"."form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "cms"."form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "cms"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "cms"."payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "cms"."payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "cms"."payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "cms"."payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "cms"."payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "cms"."payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "cms"."payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "cms"."payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "cms"."payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "cms"."payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "cms"."payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "cms"."payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "cms"."payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "cms"."payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "cms"."payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "cms"."payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "cms"."payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "cms"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "cms"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "cms"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "cms"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "cms"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "cms"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_banners_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("banners_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_health_hour_sessions_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("health_hour_sessions_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_event_registrations_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("event_registrations_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_programmes_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("programmes_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_publications_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("publications_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_grants_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("grants_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_donations_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("donations_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "cms"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "cms"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "cms"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "cms"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "cms"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "cms"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "cms"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "cms"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "cms"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_areas_order_idx" ON "cms"."homepage_areas" USING btree ("_order");
  CREATE INDEX "homepage_areas_parent_id_idx" ON "cms"."homepage_areas" USING btree ("_parent_id");
  CREATE INDEX "homepage_areas_image_idx" ON "cms"."homepage_areas" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_areas_locales_locale_parent_id_unique" ON "cms"."homepage_areas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_areas_locales_parent_id_idx" ON "cms"."homepage_areas_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_hero_video_idx" ON "cms"."homepage" USING btree ("hero_video_id");
  CREATE INDEX "homepage_ceo_video_ceo_video_file_idx" ON "cms"."homepage" USING btree ("ceo_video_file_id");
  CREATE INDEX "homepage_ceo_video_ceo_video_captions_idx" ON "cms"."homepage" USING btree ("ceo_video_captions_id");
  CREATE INDEX "homepage_ceo_video_ceo_video_poster_idx" ON "cms"."homepage" USING btree ("ceo_video_poster_id");
  CREATE INDEX "homepage__status_idx" ON "cms"."homepage" USING btree ("_status");
  CREATE INDEX "homepage_meta_meta_image_idx" ON "cms"."homepage_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "cms"."homepage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_locales_parent_id_idx" ON "cms"."homepage_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_rels_order_idx" ON "cms"."homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "cms"."homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "cms"."homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_media_id_idx" ON "cms"."homepage_rels" USING btree ("media_id");
  CREATE INDEX "homepage_rels_publications_id_idx" ON "cms"."homepage_rels" USING btree ("publications_id");
  CREATE INDEX "_homepage_v_version_areas_order_idx" ON "cms"."_homepage_v_version_areas" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_areas_parent_id_idx" ON "cms"."_homepage_v_version_areas" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_areas_image_idx" ON "cms"."_homepage_v_version_areas" USING btree ("image_id");
  CREATE UNIQUE INDEX "_homepage_v_version_areas_locales_locale_parent_id_unique" ON "cms"."_homepage_v_version_areas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_areas_locales_parent_id_idx" ON "cms"."_homepage_v_version_areas_locales" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_video_idx" ON "cms"."_homepage_v" USING btree ("version_hero_video_id");
  CREATE INDEX "_homepage_v_version_ceo_video_version_ceo_video_file_idx" ON "cms"."_homepage_v" USING btree ("version_ceo_video_file_id");
  CREATE INDEX "_homepage_v_version_ceo_video_version_ceo_video_captions_idx" ON "cms"."_homepage_v" USING btree ("version_ceo_video_captions_id");
  CREATE INDEX "_homepage_v_version_ceo_video_version_ceo_video_poster_idx" ON "cms"."_homepage_v" USING btree ("version_ceo_video_poster_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "cms"."_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "cms"."_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "cms"."_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_snapshot_idx" ON "cms"."_homepage_v" USING btree ("snapshot");
  CREATE INDEX "_homepage_v_published_locale_idx" ON "cms"."_homepage_v" USING btree ("published_locale");
  CREATE INDEX "_homepage_v_latest_idx" ON "cms"."_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "cms"."_homepage_v" USING btree ("autosave");
  CREATE INDEX "_homepage_v_version_meta_version_meta_image_idx" ON "cms"."_homepage_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_homepage_v_locales_locale_parent_id_unique" ON "cms"."_homepage_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_locales_parent_id_idx" ON "cms"."_homepage_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "cms"."_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "cms"."_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "cms"."_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_media_id_idx" ON "cms"."_homepage_v_rels" USING btree ("media_id");
  CREATE INDEX "_homepage_v_rels_publications_id_idx" ON "cms"."_homepage_v_rels" USING btree ("publications_id");
  CREATE INDEX "site_settings_main_nav_children_order_idx" ON "cms"."site_settings_main_nav_children" USING btree ("_order");
  CREATE INDEX "site_settings_main_nav_children_parent_id_idx" ON "cms"."site_settings_main_nav_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_main_nav_children_locales_locale_parent_id_uni" ON "cms"."site_settings_main_nav_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_main_nav_children_locales_parent_id_idx" ON "cms"."site_settings_main_nav_children_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_main_nav_order_idx" ON "cms"."site_settings_main_nav" USING btree ("_order");
  CREATE INDEX "site_settings_main_nav_parent_id_idx" ON "cms"."site_settings_main_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_main_nav_locales_locale_parent_id_unique" ON "cms"."site_settings_main_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_main_nav_locales_parent_id_idx" ON "cms"."site_settings_main_nav_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_columns_links_order_idx" ON "cms"."site_settings_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_links_parent_id_idx" ON "cms"."site_settings_footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_footer_columns_links_locales_locale_parent_id_" ON "cms"."site_settings_footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_footer_columns_links_locales_parent_id_idx" ON "cms"."site_settings_footer_columns_links_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_columns_order_idx" ON "cms"."site_settings_footer_columns" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_parent_id_idx" ON "cms"."site_settings_footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_footer_columns_locales_locale_parent_id_unique" ON "cms"."site_settings_footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_footer_columns_locales_parent_id_idx" ON "cms"."site_settings_footer_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "cms"."site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "cms"."site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "cms"."site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_dark_idx" ON "cms"."site_settings" USING btree ("logo_dark_id");
  CREATE INDEX "site_settings_mascot_idx" ON "cms"."site_settings" USING btree ("mascot_id");
  CREATE INDEX "site_settings_favicon_idx" ON "cms"."site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_og_image_idx" ON "cms"."site_settings" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "cms"."site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "cms"."site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "donation_settings_currencies_order_idx" ON "cms"."donation_settings_currencies" USING btree ("_order");
  CREATE INDEX "donation_settings_currencies_parent_id_idx" ON "cms"."donation_settings_currencies" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "donation_settings_currencies_locales_locale_parent_id_unique" ON "cms"."donation_settings_currencies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "donation_settings_currencies_locales_parent_id_idx" ON "cms"."donation_settings_currencies_locales" USING btree ("_parent_id");
  CREATE INDEX "donation_settings_impacts_order_idx" ON "cms"."donation_settings_impacts" USING btree ("_order");
  CREATE INDEX "donation_settings_impacts_parent_id_idx" ON "cms"."donation_settings_impacts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "donation_settings_impacts_locales_locale_parent_id_unique" ON "cms"."donation_settings_impacts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "donation_settings_impacts_locales_parent_id_idx" ON "cms"."donation_settings_impacts_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "donation_settings_locales_locale_parent_id_unique" ON "cms"."donation_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "donation_settings_locales_parent_id_idx" ON "cms"."donation_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "donation_settings_texts_order_parent" ON "cms"."donation_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "donation_settings_numbers_order_parent_idx" ON "cms"."donation_settings_numbers" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms"."pages_subnav" CASCADE;
  DROP TABLE "cms"."pages_blocks_page_header" CASCADE;
  DROP TABLE "cms"."pages_blocks_timeline_items" CASCADE;
  DROP TABLE "cms"."pages_blocks_timeline" CASCADE;
  DROP TABLE "cms"."pages_blocks_columns_columns" CASCADE;
  DROP TABLE "cms"."pages_blocks_columns" CASCADE;
  DROP TABLE "cms"."pages_blocks_dot_grid_items" CASCADE;
  DROP TABLE "cms"."pages_blocks_dot_grid" CASCADE;
  DROP TABLE "cms"."pages_blocks_numbered_cards_cards" CASCADE;
  DROP TABLE "cms"."pages_blocks_numbered_cards" CASCADE;
  DROP TABLE "cms"."pages_blocks_people_teams" CASCADE;
  DROP TABLE "cms"."pages_blocks_people" CASCADE;
  DROP TABLE "cms"."pages_blocks_split_links" CASCADE;
  DROP TABLE "cms"."pages_blocks_split" CASCADE;
  DROP TABLE "cms"."pages_blocks_rich_text" CASCADE;
  DROP TABLE "cms"."pages_blocks_cta" CASCADE;
  DROP TABLE "cms"."pages_blocks_faq_items" CASCADE;
  DROP TABLE "cms"."pages_blocks_faq" CASCADE;
  DROP TABLE "cms"."pages_blocks_video" CASCADE;
  DROP TABLE "cms"."pages_blocks_partners" CASCADE;
  DROP TABLE "cms"."pages" CASCADE;
  DROP TABLE "cms"."pages_locales" CASCADE;
  DROP TABLE "cms"."pages_texts" CASCADE;
  DROP TABLE "cms"."_pages_v_version_subnav" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_page_header" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_timeline_items" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_columns_columns" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_columns" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_dot_grid_items" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_dot_grid" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_numbered_cards_cards" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_numbered_cards" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_people_teams" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_people" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_split_links" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_split" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_cta" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_faq" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_video" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_partners" CASCADE;
  DROP TABLE "cms"."_pages_v" CASCADE;
  DROP TABLE "cms"."_pages_v_locales" CASCADE;
  DROP TABLE "cms"."_pages_v_texts" CASCADE;
  DROP TABLE "cms"."banners" CASCADE;
  DROP TABLE "cms"."banners_locales" CASCADE;
  DROP TABLE "cms"."_banners_v" CASCADE;
  DROP TABLE "cms"."_banners_v_locales" CASCADE;
  DROP TABLE "cms"."partners" CASCADE;
  DROP TABLE "cms"."health_hour_sessions_speakers" CASCADE;
  DROP TABLE "cms"."health_hour_sessions_speakers_locales" CASCADE;
  DROP TABLE "cms"."health_hour_sessions_resources" CASCADE;
  DROP TABLE "cms"."health_hour_sessions_resources_locales" CASCADE;
  DROP TABLE "cms"."health_hour_sessions" CASCADE;
  DROP TABLE "cms"."health_hour_sessions_locales" CASCADE;
  DROP TABLE "cms"."_health_hour_sessions_v_version_speakers" CASCADE;
  DROP TABLE "cms"."_health_hour_sessions_v_version_speakers_locales" CASCADE;
  DROP TABLE "cms"."_health_hour_sessions_v_version_resources" CASCADE;
  DROP TABLE "cms"."_health_hour_sessions_v_version_resources_locales" CASCADE;
  DROP TABLE "cms"."_health_hour_sessions_v" CASCADE;
  DROP TABLE "cms"."_health_hour_sessions_v_locales" CASCADE;
  DROP TABLE "cms"."events_schedule" CASCADE;
  DROP TABLE "cms"."events_schedule_locales" CASCADE;
  DROP TABLE "cms"."events_speakers" CASCADE;
  DROP TABLE "cms"."events_speakers_locales" CASCADE;
  DROP TABLE "cms"."events" CASCADE;
  DROP TABLE "cms"."events_locales" CASCADE;
  DROP TABLE "cms"."events_texts" CASCADE;
  DROP TABLE "cms"."_events_v_version_schedule" CASCADE;
  DROP TABLE "cms"."_events_v_version_schedule_locales" CASCADE;
  DROP TABLE "cms"."_events_v_version_speakers" CASCADE;
  DROP TABLE "cms"."_events_v_version_speakers_locales" CASCADE;
  DROP TABLE "cms"."_events_v" CASCADE;
  DROP TABLE "cms"."_events_v_locales" CASCADE;
  DROP TABLE "cms"."_events_v_texts" CASCADE;
  DROP TABLE "cms"."event_registrations" CASCADE;
  DROP TABLE "cms"."services_needs" CASCADE;
  DROP TABLE "cms"."services" CASCADE;
  DROP TABLE "cms"."services_locales" CASCADE;
  DROP TABLE "cms"."services_texts" CASCADE;
  DROP TABLE "cms"."_services_v_version_needs" CASCADE;
  DROP TABLE "cms"."_services_v" CASCADE;
  DROP TABLE "cms"."_services_v_locales" CASCADE;
  DROP TABLE "cms"."_services_v_texts" CASCADE;
  DROP TABLE "cms"."programmes" CASCADE;
  DROP TABLE "cms"."programmes_locales" CASCADE;
  DROP TABLE "cms"."programmes_texts" CASCADE;
  DROP TABLE "cms"."_programmes_v" CASCADE;
  DROP TABLE "cms"."_programmes_v_locales" CASCADE;
  DROP TABLE "cms"."_programmes_v_texts" CASCADE;
  DROP TABLE "cms"."people" CASCADE;
  DROP TABLE "cms"."people_locales" CASCADE;
  DROP TABLE "cms"."publications" CASCADE;
  DROP TABLE "cms"."publications_locales" CASCADE;
  DROP TABLE "cms"."publications_texts" CASCADE;
  DROP TABLE "cms"."_publications_v" CASCADE;
  DROP TABLE "cms"."_publications_v_locales" CASCADE;
  DROP TABLE "cms"."_publications_v_texts" CASCADE;
  DROP TABLE "cms"."posts" CASCADE;
  DROP TABLE "cms"."posts_locales" CASCADE;
  DROP TABLE "cms"."posts_texts" CASCADE;
  DROP TABLE "cms"."_posts_v" CASCADE;
  DROP TABLE "cms"."_posts_v_locales" CASCADE;
  DROP TABLE "cms"."_posts_v_texts" CASCADE;
  DROP TABLE "cms"."videos" CASCADE;
  DROP TABLE "cms"."videos_locales" CASCADE;
  DROP TABLE "cms"."albums" CASCADE;
  DROP TABLE "cms"."albums_locales" CASCADE;
  DROP TABLE "cms"."albums_rels" CASCADE;
  DROP TABLE "cms"."jobs" CASCADE;
  DROP TABLE "cms"."jobs_locales" CASCADE;
  DROP TABLE "cms"."jobs_texts" CASCADE;
  DROP TABLE "cms"."_jobs_v" CASCADE;
  DROP TABLE "cms"."_jobs_v_locales" CASCADE;
  DROP TABLE "cms"."_jobs_v_texts" CASCADE;
  DROP TABLE "cms"."grants" CASCADE;
  DROP TABLE "cms"."grants_locales" CASCADE;
  DROP TABLE "cms"."grants_texts" CASCADE;
  DROP TABLE "cms"."_grants_v" CASCADE;
  DROP TABLE "cms"."_grants_v_locales" CASCADE;
  DROP TABLE "cms"."_grants_v_texts" CASCADE;
  DROP TABLE "cms"."subscribers_topics" CASCADE;
  DROP TABLE "cms"."subscribers" CASCADE;
  DROP TABLE "cms"."donations" CASCADE;
  DROP TABLE "cms"."media" CASCADE;
  DROP TABLE "cms"."media_locales" CASCADE;
  DROP TABLE "cms"."users_sections" CASCADE;
  DROP TABLE "cms"."users_sessions" CASCADE;
  DROP TABLE "cms"."users" CASCADE;
  DROP TABLE "cms"."search" CASCADE;
  DROP TABLE "cms"."search_locales" CASCADE;
  DROP TABLE "cms"."search_rels" CASCADE;
  DROP TABLE "cms"."forms_blocks_checkbox" CASCADE;
  DROP TABLE "cms"."forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "cms"."forms_blocks_country" CASCADE;
  DROP TABLE "cms"."forms_blocks_country_locales" CASCADE;
  DROP TABLE "cms"."forms_blocks_email" CASCADE;
  DROP TABLE "cms"."forms_blocks_email_locales" CASCADE;
  DROP TABLE "cms"."forms_blocks_message" CASCADE;
  DROP TABLE "cms"."forms_blocks_message_locales" CASCADE;
  DROP TABLE "cms"."forms_blocks_number" CASCADE;
  DROP TABLE "cms"."forms_blocks_number_locales" CASCADE;
  DROP TABLE "cms"."forms_blocks_select_options" CASCADE;
  DROP TABLE "cms"."forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "cms"."forms_blocks_select" CASCADE;
  DROP TABLE "cms"."forms_blocks_select_locales" CASCADE;
  DROP TABLE "cms"."forms_blocks_text" CASCADE;
  DROP TABLE "cms"."forms_blocks_text_locales" CASCADE;
  DROP TABLE "cms"."forms_blocks_textarea" CASCADE;
  DROP TABLE "cms"."forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "cms"."forms_emails" CASCADE;
  DROP TABLE "cms"."forms_emails_locales" CASCADE;
  DROP TABLE "cms"."forms" CASCADE;
  DROP TABLE "cms"."forms_locales" CASCADE;
  DROP TABLE "cms"."form_submissions_submission_data" CASCADE;
  DROP TABLE "cms"."form_submissions" CASCADE;
  DROP TABLE "cms"."payload_kv" CASCADE;
  DROP TABLE "cms"."payload_jobs_log" CASCADE;
  DROP TABLE "cms"."payload_jobs" CASCADE;
  DROP TABLE "cms"."payload_folders_folder_type" CASCADE;
  DROP TABLE "cms"."payload_folders" CASCADE;
  DROP TABLE "cms"."payload_locked_documents" CASCADE;
  DROP TABLE "cms"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "cms"."payload_preferences" CASCADE;
  DROP TABLE "cms"."payload_preferences_rels" CASCADE;
  DROP TABLE "cms"."payload_migrations" CASCADE;
  DROP TABLE "cms"."homepage_areas" CASCADE;
  DROP TABLE "cms"."homepage_areas_locales" CASCADE;
  DROP TABLE "cms"."homepage" CASCADE;
  DROP TABLE "cms"."homepage_locales" CASCADE;
  DROP TABLE "cms"."homepage_rels" CASCADE;
  DROP TABLE "cms"."_homepage_v_version_areas" CASCADE;
  DROP TABLE "cms"."_homepage_v_version_areas_locales" CASCADE;
  DROP TABLE "cms"."_homepage_v" CASCADE;
  DROP TABLE "cms"."_homepage_v_locales" CASCADE;
  DROP TABLE "cms"."_homepage_v_rels" CASCADE;
  DROP TABLE "cms"."site_settings_main_nav_children" CASCADE;
  DROP TABLE "cms"."site_settings_main_nav_children_locales" CASCADE;
  DROP TABLE "cms"."site_settings_main_nav" CASCADE;
  DROP TABLE "cms"."site_settings_main_nav_locales" CASCADE;
  DROP TABLE "cms"."site_settings_footer_columns_links" CASCADE;
  DROP TABLE "cms"."site_settings_footer_columns_links_locales" CASCADE;
  DROP TABLE "cms"."site_settings_footer_columns" CASCADE;
  DROP TABLE "cms"."site_settings_footer_columns_locales" CASCADE;
  DROP TABLE "cms"."site_settings_social" CASCADE;
  DROP TABLE "cms"."site_settings" CASCADE;
  DROP TABLE "cms"."site_settings_locales" CASCADE;
  DROP TABLE "cms"."donation_settings_currencies" CASCADE;
  DROP TABLE "cms"."donation_settings_currencies_locales" CASCADE;
  DROP TABLE "cms"."donation_settings_impacts" CASCADE;
  DROP TABLE "cms"."donation_settings_impacts_locales" CASCADE;
  DROP TABLE "cms"."donation_settings" CASCADE;
  DROP TABLE "cms"."donation_settings_locales" CASCADE;
  DROP TABLE "cms"."donation_settings_texts" CASCADE;
  DROP TABLE "cms"."donation_settings_numbers" CASCADE;
  DROP TYPE "cms"."_locales";
  DROP TYPE "cms"."enum_pages_blocks_page_header_image_shape";
  DROP TYPE "cms"."enum_pages_blocks_timeline_items_colour";
  DROP TYPE "cms"."enum_pages_blocks_columns_tone";
  DROP TYPE "cms"."enum_pages_blocks_numbered_cards_tone";
  DROP TYPE "cms"."enum_pages_blocks_people_teams";
  DROP TYPE "cms"."enum_pages_blocks_split_tone";
  DROP TYPE "cms"."enum_pages_blocks_split_image_side";
  DROP TYPE "cms"."enum_pages_blocks_cta_tone";
  DROP TYPE "cms"."enum_pages_blocks_partners_group";
  DROP TYPE "cms"."enum_pages_blocks_partners_style";
  DROP TYPE "cms"."enum_pages_status";
  DROP TYPE "cms"."enum__pages_v_blocks_page_header_image_shape";
  DROP TYPE "cms"."enum__pages_v_blocks_timeline_items_colour";
  DROP TYPE "cms"."enum__pages_v_blocks_columns_tone";
  DROP TYPE "cms"."enum__pages_v_blocks_numbered_cards_tone";
  DROP TYPE "cms"."enum__pages_v_blocks_people_teams";
  DROP TYPE "cms"."enum__pages_v_blocks_split_tone";
  DROP TYPE "cms"."enum__pages_v_blocks_split_image_side";
  DROP TYPE "cms"."enum__pages_v_blocks_cta_tone";
  DROP TYPE "cms"."enum__pages_v_blocks_partners_group";
  DROP TYPE "cms"."enum__pages_v_blocks_partners_style";
  DROP TYPE "cms"."enum__pages_v_version_status";
  DROP TYPE "cms"."enum__pages_v_published_locale";
  DROP TYPE "cms"."enum_banners_tag_colour";
  DROP TYPE "cms"."enum_banners_status";
  DROP TYPE "cms"."enum__banners_v_version_tag_colour";
  DROP TYPE "cms"."enum__banners_v_version_status";
  DROP TYPE "cms"."enum__banners_v_published_locale";
  DROP TYPE "cms"."enum_partners_group";
  DROP TYPE "cms"."enum_health_hour_sessions_category";
  DROP TYPE "cms"."enum_health_hour_sessions_status";
  DROP TYPE "cms"."enum__health_hour_sessions_v_version_category";
  DROP TYPE "cms"."enum__health_hour_sessions_v_version_status";
  DROP TYPE "cms"."enum__health_hour_sessions_v_published_locale";
  DROP TYPE "cms"."enum_events_category";
  DROP TYPE "cms"."enum_events_registration_mode";
  DROP TYPE "cms"."enum_events_status";
  DROP TYPE "cms"."enum__events_v_version_category";
  DROP TYPE "cms"."enum__events_v_version_registration_mode";
  DROP TYPE "cms"."enum__events_v_version_status";
  DROP TYPE "cms"."enum__events_v_published_locale";
  DROP TYPE "cms"."enum_services_needs";
  DROP TYPE "cms"."enum_services_status";
  DROP TYPE "cms"."enum__services_v_version_needs";
  DROP TYPE "cms"."enum__services_v_version_status";
  DROP TYPE "cms"."enum__services_v_published_locale";
  DROP TYPE "cms"."enum_programmes_theme";
  DROP TYPE "cms"."enum_programmes_status";
  DROP TYPE "cms"."enum__programmes_v_version_theme";
  DROP TYPE "cms"."enum__programmes_v_version_status";
  DROP TYPE "cms"."enum__programmes_v_published_locale";
  DROP TYPE "cms"."enum_people_team";
  DROP TYPE "cms"."enum_publications_type";
  DROP TYPE "cms"."enum_publications_status";
  DROP TYPE "cms"."enum__publications_v_version_type";
  DROP TYPE "cms"."enum__publications_v_version_status";
  DROP TYPE "cms"."enum__publications_v_published_locale";
  DROP TYPE "cms"."enum_posts_kind";
  DROP TYPE "cms"."enum_posts_status";
  DROP TYPE "cms"."enum__posts_v_version_kind";
  DROP TYPE "cms"."enum__posts_v_version_status";
  DROP TYPE "cms"."enum__posts_v_published_locale";
  DROP TYPE "cms"."enum_videos_series";
  DROP TYPE "cms"."enum_jobs_employer";
  DROP TYPE "cms"."enum_jobs_status";
  DROP TYPE "cms"."enum__jobs_v_version_employer";
  DROP TYPE "cms"."enum__jobs_v_version_status";
  DROP TYPE "cms"."enum__jobs_v_published_locale";
  DROP TYPE "cms"."enum_grants_round_status";
  DROP TYPE "cms"."enum_grants_status";
  DROP TYPE "cms"."enum__grants_v_version_round_status";
  DROP TYPE "cms"."enum__grants_v_version_status";
  DROP TYPE "cms"."enum__grants_v_published_locale";
  DROP TYPE "cms"."enum_subscribers_topics";
  DROP TYPE "cms"."enum_subscribers_status";
  DROP TYPE "cms"."enum_donations_provider";
  DROP TYPE "cms"."enum_donations_frequency";
  DROP TYPE "cms"."enum_donations_status";
  DROP TYPE "cms"."enum_media_kind";
  DROP TYPE "cms"."enum_users_sections";
  DROP TYPE "cms"."enum_users_role";
  DROP TYPE "cms"."enum_forms_confirmation_type";
  DROP TYPE "cms"."enum_payload_jobs_log_task_slug";
  DROP TYPE "cms"."enum_payload_jobs_log_state";
  DROP TYPE "cms"."enum_payload_jobs_task_slug";
  DROP TYPE "cms"."enum_payload_folders_folder_type";
  DROP TYPE "cms"."enum_homepage_status";
  DROP TYPE "cms"."enum__homepage_v_version_status";
  DROP TYPE "cms"."enum__homepage_v_published_locale";
  DROP TYPE "cms"."enum_site_settings_social_platform";
  DROP TYPE "cms"."enum_site_settings_font_pair";
  DROP TYPE "cms"."enum_site_settings_motion";
  DROP TYPE "cms"."enum_donation_settings_currencies_provider";`)
}
