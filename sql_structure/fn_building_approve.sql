CREATE OR REPLACE FUNCTION public.fn_building_approve(
	p_building_id integer
	)
    RETURNS SETOF int 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN

	UPDATE public.buildings
	SET state_id=1
	WHERE building_id = p_building_id;

	return query
	SELECT p_building_id;
END;
$BODY$;;