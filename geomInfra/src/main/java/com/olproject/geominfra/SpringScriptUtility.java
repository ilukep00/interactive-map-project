/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.olproject.geominfra;

import java.sql.Connection;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

/**
 *
 * @author lukep
 */
public class SpringScriptUtility {
    public static void runScript(String path, Connection connection) {
        boolean continueOnError = false;
        boolean ignoreFailedDrops = false;
        String commentPrefix = "--";
        String separator = ";";
        String blockCommentStartDelimiter = "/*";
        String blockCommentEndDelimiter = "*/";
        
        ScriptUtils.executeSqlScript(
          connection,
          new EncodedResource(new PathResource(path)),
          continueOnError,
          ignoreFailedDrops,
          commentPrefix,
          separator,
          blockCommentStartDelimiter,
          blockCommentEndDelimiter
        );
    }
    public static void runScript(String path, Connection connection, String separator) {
        boolean continueOnError = false;
        boolean ignoreFailedDrops = false;
        String commentPrefix = "--";
        String blockCommentStartDelimiter = "/*";
        String blockCommentEndDelimiter = "*/";
        
        ScriptUtils.executeSqlScript(
          connection,
          new EncodedResource(new PathResource(path)),
          continueOnError,
          ignoreFailedDrops,
          commentPrefix,
          separator,
          blockCommentStartDelimiter,
          blockCommentEndDelimiter
        );
    }
}
