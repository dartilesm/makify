create extension if not exists "vector" with schema "public" version '0.7.0';

create table "public"."Document" (
    "id" text not null,
    "name" text,
    "url" text,
    "chatId" text,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null,
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

CREATE UNIQUE INDEX "DocumentSections_id_key" ON public."DocumentSections" USING btree (id);

CREATE UNIQUE INDEX "DocumentSections_pkey" ON public."DocumentSections" USING btree (id);

CREATE UNIQUE INDEX "Document_chatId_key" ON public."Document" USING btree ("chatId");

CREATE UNIQUE INDEX "Document_id_key" ON public."Document" USING btree (id);

CREATE UNIQUE INDEX "Document_pkey" ON public."Document" USING btree (id);

alter table "public"."Document" add constraint "Document_pkey" PRIMARY KEY using index "Document_pkey";

alter table "public"."DocumentSections" add constraint "DocumentSections_pkey" PRIMARY KEY using index "DocumentSections_pkey";

alter table "public"."Document" add constraint "Document_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Document" validate constraint "Document_chatId_fkey";

alter table "public"."DocumentSections" add constraint "DocumentSections_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."DocumentSections" validate constraint "DocumentSections_documentId_fkey";

set check_function_bodies = off;

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