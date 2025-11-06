CREATE OR REPLACE FUNCTION public.fn_building_register(
	p_wkt character varying,
	p_building_cod character varying,
	p_observation character varying
)
RETURNS SETOF bigint
LANGUAGE 'plpgsql'
VOLATILE PARALLEL UNSAFE

AS $BODY$
BEGIN

	INSERT INTO public.buildings(building_cod, geom, observation, register_date, state_id)
	VALUES (p_building_cod, ST_GeomFromText(p_wkt, 4326), p_observation, now(), 2);

	return query
	SELECT currval('lands_land_id_seq');
END;
$BODY$;