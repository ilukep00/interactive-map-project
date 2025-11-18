-- Table: public.points

-- DROP TABLE IF EXISTS public.points;

CREATE TABLE IF NOT EXISTS public.points
(
    point_id integer NOT NULL DEFAULT nextval('points_point_id_seq'::regclass),
    geom geometry(Geometry,4326),
    name character varying(100) COLLATE pg_catalog."default",
    register_date timestamp without time zone,
    state_id integer,
    CONSTRAINT points_pkey PRIMARY KEY (point_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.points
    OWNER to postgres;