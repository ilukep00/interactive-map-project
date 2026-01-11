/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.olproject.geominfra;

import java.util.Base64;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.ContentType;
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
