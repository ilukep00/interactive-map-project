-- Table: public.streets

-- DROP TABLE IF EXISTS public.streets;

CREATE TABLE IF NOT EXISTS public.streets
(
    street_id integer NOT NULL DEFAULT nextval('streets_street_id_seq'::regclass),
    geom geometry(Geometry,4326),
    register_date timestamp without time zone,
    name character varying COLLATE pg_catalog."default",
    state_id integer,
    CONSTRAINT streets_pkey PRIMARY KEY (street_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.streets
    OWNER to postgres;