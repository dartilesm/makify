create extension vector with schema extensions;

create table "public"."Document" (
    "id" text not null default gen_random_uuid(),
    "name" text,
    "url" text,
    "chatId" text,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "metadata" jsonb
);


create table "public"."DocumentSections" (
    "embedding" vector(768),
    "chatId" text,
    "text" text,
    "pageNumber" integer,
    "documentId" text,
    "textChunk" text,
    "id" uuid not null default extensions.gen_random_uuid()
);


alter table "public"."DocumentSections" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "firstName" text,
    "lastName" text,
    "email" text,
    "avatarUrl" text,
    "role" text
);


alter table "public"."profiles" enable row level security;

alter table "public"."Chat" alter column "createdAt" set default now();

alter table "public"."Chat" alter column "createdAt" set data type timestamp with time zone using "createdAt"::timestamp with time zone;

alter table "public"."Chat" alter column "id" set default gen_random_uuid();

alter table "public"."Chat" alter column "updatedAt" set default now();

alter table "public"."Chat" alter column "updatedAt" set data type timestamp with time zone using "updatedAt"::timestamp with time zone;

CREATE UNIQUE INDEX "DocumentSections_id_key" ON public."DocumentSections" USING btree (id);

CREATE UNIQUE INDEX "DocumentSections_pkey" ON public."DocumentSections" USING btree (id);

CREATE UNIQUE INDEX "Document_chatId_key" ON public."Document" USING btree ("chatId");

CREATE UNIQUE INDEX "Document_id_key" ON public."Document" USING btree (id);

CREATE UNIQUE INDEX "Document_pkey" ON public."Document" USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."Document" add constraint "Document_pkey" PRIMARY KEY using index "Document_pkey";

alter table "public"."DocumentSections" add constraint "DocumentSections_pkey" PRIMARY KEY using index "DocumentSections_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."Document" add constraint "Document_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Document" validate constraint "Document_chatId_fkey";

alter table "public"."DocumentSections" add constraint "DocumentSections_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"(id) ON DELETE CASCADE not valid;

alter table "public"."DocumentSections" validate constraint "DocumentSections_chatId_fkey";

alter table "public"."DocumentSections" add constraint "DocumentSections_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."DocumentSections" validate constraint "DocumentSections_documentId_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.role
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_threshold double precision, document_id uuid)
 RETURNS SETOF "DocumentSections"
 LANGUAGE sql
AS $function$
  select *
  from "DocumentSections"
  where "DocumentSections".embedding <#> query_embedding < -match_threshold 
  and "DocumentSections"."chatId"::text = document_id::text
  order by "DocumentSections"."pageNumber" asc
$function$
;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_threshold double precision, match_count integer)
 RETURNS SETOF "DocumentSections"
 LANGUAGE sql
AS $function$
  select *
  from "DocumentSections"
  where "DocumentSections".embedding <#> query_embedding < -match_threshold
  order by "DocumentSections"."pageNumber" asc
  limit least(match_count, 200);
$function$
;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_threshold double precision, match_count integer, document_id uuid)
 RETURNS SETOF "DocumentSections"
 LANGUAGE sql
AS $function$
  select *
  from "DocumentSections"
  where "DocumentSections".embedding <#> query_embedding < -match_threshold 
  and "DocumentSections"."chatId"::text = document_id::text
  order by "DocumentSections"."pageNumber" asc
  limit least(match_count, 200);
$function$
;

grant delete on table "public"."Document" to "anon";

grant insert on table "public"."Document" to "anon";

grant references on table "public"."Document" to "anon";

grant select on table "public"."Document" to "anon";

grant trigger on table "public"."Document" to "anon";

grant truncate on table "public"."Document" to "anon";

grant update on table "public"."Document" to "anon";

grant delete on table "public"."Document" to "authenticated";

grant insert on table "public"."Document" to "authenticated";

grant references on table "public"."Document" to "authenticated";

grant select on table "public"."Document" to "authenticated";

grant trigger on table "public"."Document" to "authenticated";

grant truncate on table "public"."Document" to "authenticated";

grant update on table "public"."Document" to "authenticated";

grant delete on table "public"."Document" to "service_role";

grant insert on table "public"."Document" to "service_role";

grant references on table "public"."Document" to "service_role";

grant select on table "public"."Document" to "service_role";

grant trigger on table "public"."Document" to "service_role";

grant truncate on table "public"."Document" to "service_role";

grant update on table "public"."Document" to "service_role";

grant delete on table "public"."DocumentSections" to "anon";

grant insert on table "public"."DocumentSections" to "anon";

grant references on table "public"."DocumentSections" to "anon";

grant select on table "public"."DocumentSections" to "anon";

grant trigger on table "public"."DocumentSections" to "anon";

grant truncate on table "public"."DocumentSections" to "anon";

grant update on table "public"."DocumentSections" to "anon";

grant delete on table "public"."DocumentSections" to "authenticated";

grant insert on table "public"."DocumentSections" to "authenticated";

grant references on table "public"."DocumentSections" to "authenticated";

grant select on table "public"."DocumentSections" to "authenticated";

grant trigger on table "public"."DocumentSections" to "authenticated";

grant truncate on table "public"."DocumentSections" to "authenticated";

grant update on table "public"."DocumentSections" to "authenticated";

grant delete on table "public"."DocumentSections" to "dashboard_user";

grant insert on table "public"."DocumentSections" to "dashboard_user";

grant references on table "public"."DocumentSections" to "dashboard_user";

grant select on table "public"."DocumentSections" to "dashboard_user";

grant trigger on table "public"."DocumentSections" to "dashboard_user";

grant truncate on table "public"."DocumentSections" to "dashboard_user";

grant update on table "public"."DocumentSections" to "dashboard_user";

grant delete on table "public"."DocumentSections" to "service_role";

grant insert on table "public"."DocumentSections" to "service_role";

grant references on table "public"."DocumentSections" to "service_role";

grant select on table "public"."DocumentSections" to "service_role";

grant trigger on table "public"."DocumentSections" to "service_role";

grant truncate on table "public"."DocumentSections" to "service_role";

grant update on table "public"."DocumentSections" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "enabled for all"
on "public"."DocumentSections"
as permissive
for all
to public
using (true);



