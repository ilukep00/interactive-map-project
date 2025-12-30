CREATE OR REPLACE FUNCTION public.fn_point_deletion(
	p_geom_id integer
	)
    RETURNS SETOF int 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN

	DELETE FROM public.points
	WHERE point_id = p_geom_id;

	return query
	SELECT p_geom_id;
END;
$BODY$;;