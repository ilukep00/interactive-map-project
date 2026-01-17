<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc">

  <UserStyle>
    <Name>buildings</Name>

    <FeatureTypeStyle>

      <Rule>
        <Name>Pending</Name>
        <ogc:Filter>
          <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>state_id</ogc:PropertyName>
            <ogc:Literal>2</ogc:Literal>
          </ogc:PropertyIsEqualTo>
        </ogc:Filter>

        <PolygonSymbolizer>
          <Fill>
            <CssParameter name="fill">#0d39e8</CssParameter>
            <CssParameter name="fill-opacity">0.75</CssParameter>
          </Fill>
          <Stroke>
            <CssParameter name="stroke">#072cff</CssParameter>
            <CssParameter name="stroke-width">2</CssParameter>
          </Stroke>
        </PolygonSymbolizer>
      </Rule>

      <Rule>
        <Name>Approve</Name>
        <ogc:Filter>
          <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>state_id</ogc:PropertyName>
            <ogc:Literal>1</ogc:Literal>
          </ogc:PropertyIsEqualTo>
        </ogc:Filter>

        <PolygonSymbolizer>
          <Fill>
            <CssParameter name="fill">#00ff0d</CssParameter>
            <CssParameter name="fill-opacity">0.75</CssParameter>
          </Fill>
          <Stroke>
            <CssParameter name="stroke">#072cff</CssParameter>
            <CssParameter name="stroke-width">2</CssParameter>
          </Stroke>
        </PolygonSymbolizer>
      </Rule>

      <Rule>
        <TextSymbolizer>
          <Label>
            <ogc:PropertyName>building_cod</ogc:PropertyName>
          </Label>
          <Font>
            <CssParameter name="font-family">Arial</CssParameter>
            <CssParameter name="font-size">13</CssParameter>
            <CssParameter name="font-weight">bold</CssParameter>
          </Font>
          <Fill>
            <CssParameter name="fill">#ffffff</CssParameter>
          </Fill>
        </TextSymbolizer>
      </Rule>

    </FeatureTypeStyle>
  </UserStyle>
</StyledLayerDescriptor>