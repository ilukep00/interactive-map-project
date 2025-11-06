--
-- PostgreSQL database dump
--

\restrict y11l1TYWqo0rPliYSQsj1PwnpPH5A80hGrM5rJZqvDNBLnafwpaLBnqYopIlPjj

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-06 20:28:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 25666)
-- Name: buildings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buildings (
    building_id integer CONSTRAINT lands_land_id_not_null NOT NULL,
    building_cod character varying(10),
    geom public.geometry(Geometry,4326),
    observation character varying(100),
    register_date timestamp without time zone,
    state_id integer
);


ALTER TABLE public.buildings OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25665)
-- Name: lands_land_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lands_land_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lands_land_id_seq OWNER TO postgres;

--
-- TOC entry 5829 (class 0 OID 0)
-- Dependencies: 225
-- Name: lands_land_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lands_land_id_seq OWNED BY public.buildings.building_id;


--
-- TOC entry 5667 (class 2604 OID 25669)
-- Name: buildings building_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings ALTER COLUMN building_id SET DEFAULT nextval('public.lands_land_id_seq'::regclass);


--
-- TOC entry 5830 (class 0 OID 0)
-- Dependencies: 225
-- Name: lands_land_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lands_land_id_seq', 11, true);


--
-- TOC entry 5669 (class 2606 OID 25674)
-- Name: buildings lands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT lands_pkey PRIMARY KEY (building_id);


-- Completed on 2025-11-06 20:28:03

--
-- PostgreSQL database dump complete
--

\unrestrict y11l1TYWqo0rPliYSQsj1PwnpPH5A80hGrM5rJZqvDNBLnafwpaLBnqYopIlPjj

