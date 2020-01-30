-- get_chart_repositories returns all available chart repositories as a json
-- array.
create or replace function get_chart_repositories()
returns setof json as $$
    select coalesce(json_agg(row_to_json(chart_repository)), '[]')
    from chart_repository;
$$ language sql;
