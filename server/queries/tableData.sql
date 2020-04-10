SELECT pk.table_name, pk.primary_key, fk.foreign_keys, td.columns

FROM (                                            --  Primary key data (pk)
---------------------------------------------------------------------------
  SELECT  conrelid::regclass AS table_name,
          substring(pg_get_constraintdef(oid), '\((.*?)\)')  AS primary_key
  FROM pg_constraint
  WHERE  contype = 'p' AND connamespace = 'public'::regnamespace
---------------------------------------------------------------------------
) AS pk

INNER JOIN (                                                   -- Foreign key data (fk)
---------------------------------------------------------------------------------------
  SELECT conrelid::regclass AS table_name, json_agg(
    json_build_object(
      'name',            substring(pg_get_constraintdef(oid), '\((.*?)\)'),
      'reference_table', substring(pg_get_constraintdef(oid), 'REFERENCES (.*?)\('),
      'reference_key',   substring(pg_get_constraintdef(oid), 'REFERENCES.*?\((.*?)\)')
    )
  ) AS foreign_keys
  FROM pg_constraint
  WHERE  contype = 'f' AND connamespace = 'public'::regnamespace
  GROUP BY table_name
---------------------------------------------------------------------------------------
) AS fk
ON pk.table_name = fk.table_name

INNER JOIN (                                   -- Table data (td)
-----------------------------------------------------------------
  SELECT tab.table_name, json_agg(
    json_build_object(
      'column_name',              col.column_name,
      'data_type',                col.data_type,
      'column_default',           col.column_default,
      'character_maximum_length', col.character_maximum_length,
      'is_nullable',              col.is_nullable
    )
  ) AS columns

  -- Table names
  FROM (
    SELECT table_name FROM information_schema.tables
    WHERE table_type='BASE TABLE' AND table_schema='public'
  ) AS tab

  -- Table columns
  INNER JOIN information_schema.columns AS col
  ON tab.table_name = col.table_name
  GROUP BY tab.table_name
-----------------------------------------------------------------
) AS td
ON td.table_name::regclass = pk.table_name