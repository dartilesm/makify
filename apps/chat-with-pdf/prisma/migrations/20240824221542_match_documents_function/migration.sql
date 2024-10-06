-- Match documents using negative inner product (<#>)
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  document_id uuid
)
returns setof "DocumentSections"
language sql
as $$
  select *
  from "DocumentSections"
  where "DocumentSections".embedding <#> query_embedding < -match_threshold 
  and "DocumentSections"."chatId"::text = document_id::text
  order by "DocumentSections"."pageNumber" asc
$$;