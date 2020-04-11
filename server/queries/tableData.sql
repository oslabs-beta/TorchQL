SELECT pk.table_name AS "tableName", pk.primary_key AS "primaryKey", fk.foreign_keys AS "foreignKeys", td.columns

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
      'referenceTable', substring(pg_get_constraintdef(oid), 'REFERENCES (.*?)\('),
      'referenceKey',   substring(pg_get_constraintdef(oid), 'REFERENCES.*?\((.*?)\)')
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
      'columnName',              col.column_name,
      'dataType',                col.data_type,
      'columnDefault',           col.column_default,
      'charMaxLength', col.character_maximum_length,
      'isNullable',              col.is_nullable
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