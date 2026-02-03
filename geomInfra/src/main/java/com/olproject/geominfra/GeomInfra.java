/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.olproject.geominfra;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

/**
 *
 * @author lukep
 */
public class GeomInfra {
    
    private static final String SQL_STRUCTURE_PATH = "../sql_structure/";
    public static final String BUILDING_TABLE_PATH = SQL_STRUCTURE_PATH+"buildings_table.sql";
    public static final String STREET_TABLE_PATH = SQL_STRUCTURE_PATH+"streets_table.sql";
    public static final String POINT_TABLE_PATH = SQL_STRUCTURE_PATH+"points_table.sql";
    public static final String BUILDING_REGISTER_PATH = SQL_STRUCTURE_PATH+"fn_building_register.sql";
    public static final String STREET_REGISTER_PATH = SQL_STRUCTURE_PATH+"fn_street_register.sql";
    public static final String POINT_REGISTER_PATH = SQL_STRUCTURE_PATH+"fn_point_register.sql";
    public static final String BUILDING_DELETION_PATH = SQL_STRUCTURE_PATH+"fn_building_deletion.sql";
    public static final String STREET_DELETION_PATH = SQL_STRUCTURE_PATH+"fn_street_deletion.sql";
    public static final String POINT_DELETION_PATH = SQL_STRUCTURE_PATH+"fn_point_deletion.sql";
    public static final String BUILDING_APPROVE_PATH = SQL_STRUCTURE_PATH+"fn_building_approve.sql";
    
    private static final String SAMPLEDATA_PATH = "../sampledata/";
    public static final String BUILDING_SAMPLEDATA_PATH = SAMPLEDATA_PATH+"building_sampledata.sql";
    public static final String STREET_SAMPLEDATA_PATH = SAMPLEDATA_PATH+"street_sampledata.sql";
    public static final String POINT_SAMPLEDATA_PATH = SAMPLEDATA_PATH+"point_sampledata.sql";
    
    private static final String GEOSERVERSTYLES_PATH = "../geoserver_styles/";
    public static final String BUILDING_GEOSERVERSTYLE_PATH = GEOSERVERSTYLES_PATH+"style_buildings.sld";
    public static final String STREET_GEOSERVERSTYLE_PATH = GEOSERVERSTYLES_PATH+"style_streets.sld";
    
    public static void main(String[] args) {
        String baseUrl = "jdbc:postgresql://localhost:5432/";
        
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Insert your postgres user name: ");
        String username = scanner.nextLine();
        
        System.out.println("Insert your postgres password: ");
        String password = scanner.nextLine();
        
        String dbName = "ol_project";
        
        try (Connection conn = DriverManager.getConnection(baseUrl+"postgres", username, password); 
                Statement stmt = conn.createStatement()) {
            
            String sql = "CREATE DATABASE "+dbName;
            stmt.execute(sql);
            
            System.out.println("Database created successfully!");
            
        } catch(SQLException e){
            System.err.println(e.getMessage());
            return;
        }
        
        try (Connection conn = DriverManager.getConnection(baseUrl+dbName, username, password); 
                Statement stmt = conn.createStatement()) {
            // Creating the extension of postgis for the new database created
            String sql = "CREATE EXTENSION postgis;";
            stmt.execute(sql);
            
            System.out.println("postgis extension created successfully for "+dbName+" !");
            
            // Creating buildings table
            SpringScriptUtility.runScript(BUILDING_TABLE_PATH, conn);
            System.out.println("Buldings table created successfully");
            
            // Creating streets table
            SpringScriptUtility.runScript(STREET_TABLE_PATH, conn);
            System.out.println("Streets table created successfully");
            
            // Creating points table
            SpringScriptUtility.runScript(POINT_TABLE_PATH, conn);
            System.out.println("Points table created successfully");
            
            // Adding register building function
            SpringScriptUtility.runScript(BUILDING_REGISTER_PATH, conn, ";;");
            System.out.println("register building function created successfully");
            
            // Adding register street function
            SpringScriptUtility.runScript(STREET_REGISTER_PATH, conn, ";;");
            System.out.println("register street function created successfully");
            
            // Adding register point function
            SpringScriptUtility.runScript(POINT_REGISTER_PATH, conn, ";;");
            System.out.println("register point function created successfully");
            
            // Adding deletion building function
            SpringScriptUtility.runScript(BUILDING_DELETION_PATH, conn, ";;");
            System.out.println("deletion building function created successfully");
            
            // Adding deletion street function
            SpringScriptUtility.runScript(STREET_DELETION_PATH, conn, ";;");
            System.out.println("deletion street function created successfully");
            
            // Adding deletion point function
            SpringScriptUtility.runScript(POINT_DELETION_PATH, conn, ";;");
            System.out.println("deletion point function created successfully");
            
            // Adding approve building function
            SpringScriptUtility.runScript(BUILDING_APPROVE_PATH, conn, ";;");
            System.out.println("approve building function created successfully");
            
            // Inserting building sampledata
            SpringScriptUtility.runScript(BUILDING_SAMPLEDATA_PATH, conn);
            System.out.println("building sampledata inserted successfully");
            
            // Inserting street sampledata
            SpringScriptUtility.runScript(STREET_SAMPLEDATA_PATH, conn);
            System.out.println("street sampledata inserted successfully");
            
            // Inserting point sampledata
            SpringScriptUtility.runScript(POINT_SAMPLEDATA_PATH, conn);
            System.out.println("point sampledata inserted successfully");
            
            System.out.println("Insert your geoserver user name: ");
            String geousername = scanner.nextLine();
        
            System.out.println("Insert your geoserver password: ");
            String geopassword = scanner.nextLine();
            
            GeoServerClient gsc = new GeoServerClient(geousername, geopassword);
            
            String geoServerWorkSpace = "ol_project";
            String geoServerDatastore = "ol_project_ds";
            
            gsc.createWorkspace(geoServerWorkSpace);
            gsc.createPostgisDatastore(geoServerWorkSpace, geoServerDatastore, dbName, username, password);
            gsc.publishBuilding(geoServerWorkSpace, geoServerDatastore);
            gsc.publishStreet(geoServerWorkSpace, geoServerDatastore);
            gsc.publishPoint(geoServerWorkSpace, geoServerDatastore);
            gsc.publishStyle(geoServerWorkSpace, BUILDING_GEOSERVERSTYLE_PATH, "buildings");
            gsc.publishStyle(geoServerWorkSpace, STREET_GEOSERVERSTYLE_PATH, "streets");
            gsc.assignStyleToLayer(geoServerWorkSpace, "buildings", "buildings");
            gsc.asssingGenericStyleToLayer(geoServerWorkSpace, "buildings", "polygon");
            gsc.assignStyleToLayer(geoServerWorkSpace, "streets", "streets");
            gsc.asssingGenericStyleToLayer(geoServerWorkSpace, "streets", "line");
            gsc.asssingGenericStyleToLayer(geoServerWorkSpace, "points", "point");
        } catch(Exception e){
            System.err.println(e.getMessage());
        }
        
    }
}
