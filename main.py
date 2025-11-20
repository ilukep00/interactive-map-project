from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from ps_utilities.ps_call_postgres_function import call_postgres_function

class Building(BaseModel):
    p_wkt: str
    p_building_cod: str
    p_observation: str

class BaseObject(BaseModel):
    p_wkt: str
    p_name: str

class BuildingApprove(BaseModel):
    p_building_id: int

class GeometryDeletion(BaseModel):
    p_geom_id: int

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/registerBuilding/")
async def register_building(item: Building):
    return call_postgres_function('fn_building_register',item.p_wkt, item.p_building_cod, item.p_observation)

@app.post("/registerStreet/")
async def register_street(item: BaseObject):
    return call_postgres_function('fn_street_register',item.p_wkt, item.p_name)

@app.post("/buildingApprove/")
async def building_approve(item: BuildingApprove):
    return call_postgres_function('fn_building_approve',item.p_building_id)

@app.post("/registerPoint/")
async def register_point(item: BaseObject):
    return call_postgres_function('fn_point_register',item.p_wkt, item.p_name)

@app.post("/buildingDeletion/")
async def building_deletion(item: GeometryDeletion):
    return call_postgres_function('fn_building_deletion',item.p_geom_id)

@app.post("/streetDeletion/")
async def street_deletion(item: GeometryDeletion):
    return call_postgres_function('fn_street_deletion',item.p_geom_id)

@app.post("/pointDeletion/")
async def street_deletion(item: GeometryDeletion):
    return call_postgres_function('fn_point_deletion',item.p_geom_id)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)