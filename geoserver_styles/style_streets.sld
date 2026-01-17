<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc">

  <UserStyle>
    <Name>streets</Name>
    <Title>Streets style</Title>

    <FeatureTypeStyle>

      <!-- Line style -->
      <Rule>
        <Name>Single symbol</Name>

        <LineSymbolizer>
          <Stroke>
            <CssParameter name="stroke">#d50a25</CssParameter>
            <CssParameter name="stroke-width">4</CssParameter>
            <CssParameter name="stroke-linejoin">round</CssParameter>
            <CssParameter name="stroke-linecap">round</CssParameter>
            <CssParameter name="stroke-dasharray">2 7</CssParameter>
          </Stroke>
        </LineSymbolizer>
      </Rule>

      <!-- Label style -->
      <Rule>
        <TextSymbolizer>
          <Label>
            <ogc:PropertyName>name</ogc:PropertyName>
          </Label>

          <Font>
            <CssParameter name="font-family">Arial</CssParameter>
            <CssParameter name="font-size">13</CssParameter>
          </Font>

          <LabelPlacement>
            <LinePlacement>
              <PerpendicularOffset>11</PerpendicularOffset>
            </LinePlacement>
          </LabelPlacement>

          <Fill>
            <CssParameter name="fill">#d50a25</CssParameter>
          </Fill>

          <!-- GeoServer vendor options -->
          <VendorOption name="followLine">true</VendorOption>
          <VendorOption name="maxDisplacement">10</VendorOption>
          <VendorOption name="repeat">150</VendorOption>
        </TextSymbolizer>
      </Rule>

    </FeatureTypeStyle>
  </UserStyle>

</StyledLayerDescriptor>