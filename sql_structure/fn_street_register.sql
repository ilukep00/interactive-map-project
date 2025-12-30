-- FUNCTION: public.fn_street_register(character varying, character varying)

-- DROP FUNCTION IF EXISTS public.fn_street_register(character varying, character varying);

CREATE OR REPLACE FUNCTION public.fn_street_register(
	p_wkt character varying,
	p_name character varying)
    RETURNS SETOF bigint 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN

	INSERT INTO public.streets(geom, register_date, name, state_id)
	VALUES ( ST_GeomFromText(p_wkt, 4326), now(), p_name, 1);

	return query
	SELECT currval('streets_street_id_seq');
END;
$BODY$;;

ALTER FUNCTION public.fn_street_register(character varying, character varying)
    OWNER TO postgres;;
