/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.olproject.geominfra;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.ByteArrayEntity;
/**
 *
 * @author lukep
 */
public class GeoServerClient {
    
    private final String geoserverUrl = "http://localhost:8080/geoserver/rest";
    private final String user;
    private final String password;

    public GeoServerClient( String user,String password) {
        this.user = user;
        this.password = password;
    }
    
    public void createWorkspace(String workspace) throws Exception {
        String url = this.geoserverUrl + "/workspaces";

        String json = """
        {
          "workspace": {
            "name": "%s"
          }
        }
        """.formatted(workspace);

        sendPost(url, json);
        System.out.println("Workspace created: " + workspace);
    }
    
    public void createPostgisDatastore(String workspace, String datastoreName, String postgresDBName, String postgresUserName, String postgresPassord) throws Exception {
        String url = this.geoserverUrl + "/workspaces/" + workspace + "/datastores";

        String json = """
        {
          "dataStore": {
            "name": "%s",
            "connectionParameters": {
              "entry": [
                { "@key": "dbtype", "$": "postgis" },
                { "@key": "host", "$": "localhost" },
                { "@key": "port", "$": "5432" },
                { "@key": "database", "$": "%s" },
                { "@key": "user", "$": "%s" },
                { "@key": "passwd", "$": "%s" }
              ]
            }
          }
        }
        """.formatted(datastoreName,postgresDBName,postgresUserName,postgresPassord);

        sendPost(url, json);
        System.out.println("Datastore created: " + datastoreName);
    }
    
        
    public void publishBuilding(
        String workspace,
        String datastore) throws Exception {

        String url = this.geoserverUrl + "/workspaces/" + workspace +
                     "/datastores/" + datastore + "/featuretypes";

        String json = """
        {
          "featureType": {
            "name": "buildings",
            "nativeName": "buildings",
            "srs": "EPSG:4326",
            "nativeBoundingBox": {
                "minx": -1.639344877562201,
                "maxx": -1.638712161089852,
                "miny": 42.816931923319146,
                "maxy": 42.817389469858426,
                "crs": "EPSG:4326"
            },
            "latLonBoundingBox": {
                "minx": -1.639344877562201,
                "maxx": -1.638712161089852,
                "miny": 42.816931923319146,
                "maxy": 42.817389469858426,
                "crs": "EPSG:4326"
            },
            "attributes": {
                "attribute": [
                  {
                    "name": "geom"
                  },
                  {
                     "name": "building_cod"                                                 
                  },
                  {
                     "name": "state_id"                                                                       
                  }
                ]
             }
          }
        }
        """;

        sendPost(url, json);
        System.out.println("Published layer: buildings");
    }
    
    public void publishStreet(
        String workspace,
        String datastore) throws Exception {

        String url = this.geoserverUrl + "/workspaces/" + workspace +
                     "/datastores/" + datastore + "/featuretypes";

        String json = """
        {
          "featureType": {
            "name": "streets",
            "nativeName": "streets",
            "srs": "EPSG:4326",
            "nativeBoundingBox": {
                "minx": -1.640374540463723,
                "maxx": -1.639841458957705,
                "miny": 42.81699431171151,
                "maxy": 42.817385340848915,
                "crs": "EPSG:4326"
            },
            "latLonBoundingBox": {
                "minx": -1.640374540463723,
                "maxx": -1.639841458957705,
                "miny": 42.81699431171151,
                "maxy": 42.817385340848915,
                "crs": "EPSG:4326"
            },
            "attributes": {
                "attribute": [
                  {
                    "name": "geom"
                  },
                  {
                    "name": "name"
                  }
                ]
             }
          }
        }
        """;

        sendPost(url, json);
        System.out.println("Published layer: streets");
    }
    
    public void publishPoint(
        String workspace,
        String datastore) throws Exception {

        String url = this.geoserverUrl + "/workspaces/" + workspace +
                     "/datastores/" + datastore + "/featuretypes";

        String json = """
        {
          "featureType": {
            "name": "points",
            "nativeName": "points",
            "srs": "EPSG:4326",
            "nativeBoundingBox": {
                "minx": -1.639618000591409,
                "maxx": -1.639418000591409,
                "miny": 42.81705380117765,
                "maxy": 42.81725380117766,
                "crs": "EPSG:4326"
            },
            "latLonBoundingBox": {
                "minx": -1.639618000591409,
                "maxx": -1.639418000591409,
                "miny": 42.81705380117765,
                "maxy": 42.81725380117766,
                "crs": "EPSG:4326"
            },
            "attributes": {
                "attribute": [
                  {
                    "name": "geom"
                  }
                ]
             }
          }
        }
        """;

        sendPost(url, json);
        System.out.println("Published layer: points");
    }
    
    public String readSld(String path) throws Exception {
        return Files.readString(Path.of(path));
    }
    
    public void publishStyle(String workspace, String styleFilePath, String styleName) throws Exception{
        String url = this.geoserverUrl + "/workspaces/" + workspace +
                     "/styles?name=" + styleName;
        
        String styleContent = readSld(styleFilePath);
        sendSldPost(url, styleContent);
        System.out.println("Published style:"+ styleName);
    }
    
   private void sendSldPost(String url, String xml)throws Exception {
        try (CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(url);
            post.setHeader("Content-Type", "application/vnd.ogc.sld+xml; charset=UTF-8");

            String auth = this.user + ":" + this.password;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            post.setHeader("Authorization", "Basic " + encodedAuth);
            
            byte[] bytes = xml.getBytes(StandardCharsets.UTF_8);
            post.setEntity(new ByteArrayEntity(bytes, ContentType.create("application/vnd.ogc.sld+xml", StandardCharsets.UTF_8)));

            client.execute(post, response -> {
                int code = response.getCode();
                if (code != 201 && code != 200) {
                    throw new RuntimeException("Error GeoServer: HTTP " + code);
                }
                return null;
            });
        }
    }   
    
    private void sendPost(String url, String json) throws Exception {
        try (CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(url);
            post.setHeader("Content-Type", "application/json");

            String auth = this.user + ":" + this.password;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            post.setHeader("Authorization", "Basic " + encodedAuth);

            post.setEntity(new StringEntity(json, ContentType.APPLICATION_JSON));

            client.execute(post, response -> {
                int code = response.getCode();
                if (code != 201 && code != 200) {
                    throw new RuntimeException("Error GeoServer: HTTP " + code);
                }
                return null;
            });
        }
    }   
}
