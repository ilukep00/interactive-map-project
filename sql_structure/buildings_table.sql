-- Table: public.buildings

-- DROP TABLE IF EXISTS public.buildings;

CREATE TABLE IF NOT EXISTS public.buildings
(
    building_id integer NOT NULL DEFAULT nextval('lands_land_id_seq'::regclass),
    building_cod character varying(10) COLLATE pg_catalog."default",
    geom geometry(Geometry,4326),
    observation character varying(100) COLLATE pg_catalog."default",
    register_date timestamp without time zone,
    state_id integer,
    CONSTRAINT lands_pkey PRIMARY KEY (building_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.buildings
    OWNER to postgres;