create or replace function get_package(p_package_id uuid)
returns setof json as $$
    select get_package_version(p_package_id, p.latest_version)
    from package p
    where p.package_id = p_package_id;
$$ language sql;
