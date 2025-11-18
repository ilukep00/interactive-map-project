CREATE OR REPLACE FUNCTION public.fn_point_register(
	p_wkt character varying,
	p_name character varying)
    RETURNS SETOF bigint 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN

	INSERT INTO public.points(geom, name, register_date, state_id)
	VALUES (ST_GeomFromText(p_wkt, 4326), p_name, now(), 1);

	return query
	SELECT currval('points_point_id_seq');
END;
$BODY$;