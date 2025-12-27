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

    public static void main(String[] args) {
        String baseUrl = "jdbc:postgresql://localhost:5432/";
        
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Insert your postgres user name: ");
        String username = scanner.nextLine();
        
        System.out.println("Insert your postgres password: ");
        String password = scanner.nextLine();
        
        System.out.println("Insert your database name: ");
        String dbName = scanner.nextLine();
        
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
        } catch(SQLException e){
            System.err.println(e.getMessage());
        }
        
    }
}
