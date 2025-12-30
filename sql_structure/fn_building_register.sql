-- FUNCTION: public.fn_building_register(character varying, character varying, character varying)

-- DROP FUNCTION IF EXISTS public.fn_building_register(character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.fn_building_register(
	p_wkt character varying,
	p_building_cod character varying,
	p_observation character varying)
    RETURNS SETOF bigint 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN

	INSERT INTO public.buildings(building_cod, geom, observation, register_date, state_id)
	VALUES (p_building_cod, ST_GeomFromText(p_wkt, 4326), p_observation, now(), 2);

	return query
	SELECT currval('buildings_building_id_seq');
END;
$BODY$;;

