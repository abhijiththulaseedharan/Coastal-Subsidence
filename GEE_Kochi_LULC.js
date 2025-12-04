// // Define the area of interest (AOI)
// var aoi = ee.Geometry.Rectangle([76.15998, 9.88114, 76.42001, 10.18006]);

// var dataset = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
//     .filterDate('2024-12-14', '2024-12-16')
//     .filterBounds(aoi);  // Filter by AOI

// // Function to apply scaling factors to the image
// function applyScaleFactors(image) {
//   // Apply scaling to optical bands (SR_B1 to SR_B7)
//   var opticalBands = image.select(['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'])
//     .multiply(0.0000275).add(-0.2);
  
//   // Apply scaling to the thermal band (ST_B10)
//   var thermalBands = image.select('ST_B10')
//     .multiply(0.00341802).add(149.0);

//   // Add the scaled bands back to the image
//   return image.addBands(opticalBands, null, true)
//               .addBands(thermalBands, null, true);
// }

// // Apply the scaling function to the dataset
// dataset = dataset.map(applyScaleFactors);

// // Select the first image from the dataset (for visualization)
// var firstImage = dataset.first().clip(aoi);

// // Visualization parameters for true-color composite
// var visualization = {
//   bands: ['SR_B4', 'SR_B3', 'SR_B2'],  // RGB bands
//   min: 0.0,
//   max: 0.3
// };

// // Add the image layer to the map
// Map.centerObject(aoi, 10);  // Center the map on the AOI
// Map.addLayer(firstImage, visualization, 'True Color (432)');

// // Calculate NDBI
// var ndbi = firstImage.normalizedDifference(['SR_B6', 'SR_B5']).rename('NDBI');

// // Calculate NDVI: (NIR - Red) / (NIR + Red)
// var ndvi = firstImage.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');

// // Calculate NDWI: (Green - NIR) / (Green + NIR)
// var ndwi = firstImage.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI');

// // Add the indices as bands to the image
// var withIndices = firstImage.addBands([ndvi, ndwi]);

// // False Color Composite Visualization (Standard False Color: NIR, Red, Green)
// var falseColorVis = {
//   bands: ['SR_B5', 'SR_B4', 'SR_B3'],
//   min: 0,
//   max: 0.3,
//   gamma: 1.4
// };

// // NDBI Visualization
// var ndbiVis = {
//   min: -1,
//   max: 1,
//   palette: ['blue', 'white', 'red']  // Blue = low values, Red = high values
// };

// // Visualization parameters for NDVI
// var ndviVis = {
//   min: -1,
//   max: 1,
//   palette: ['blue', 'white', 'green']
// };

// // Visualization parameters for NDWI
// var ndwiVis = {
//   min: -1,
//   max: 1,
//   palette: ['brown', 'white', 'blue']
// };

// // Add layers to the map
// Map.centerObject(aoi, 12);
// Map.addLayer(firstImage, falseColorVis, 'False Color Composite');
// Map.addLayer(ndbi, ndbiVis, 'NDBI');
// Map.addLayer(ndvi, ndviVis, 'NDVI');
// Map.addLayer(ndwi, ndwiVis, 'NDWI');

// // Print band names and first image properties
// print('Band Names:', firstImage.bandNames());
// print('First Image Properties:', firstImage);

// var label = [1,2,3,4];
// var classNames = ['Urban', 'Water', 'Vegetation', 'Barren'];
// var classPalette = ['Red', 'Blue', 'Green', 'Yellow'];
// var columns = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7', 'label', 'sample', 'classNames', 'classPalette'];
// var features = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'];

// //sample
// var samples = ee.FeatureCollection([Urban, Water, Vegetation, Barren]);

// print(samples)

// Define the Area of Interest (AOI) for your study region
var aoi = ee.Geometry.Rectangle([76.15998, 9.88114, 76.42001, 10.18006]);

// Load Landsat image collection for the specified date range and AOI
var dataset = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
    .filterDate('2024-12-14', '2024-12-16')
    .filterBounds(aoi);  // Filter by AOI

// Function to apply scaling factors to the image
function applyScaleFactors(image) {
  // Apply scaling to optical bands (SR_B1 to SR_B7)
  var opticalBands = image.select(['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'])
    .multiply(0.0000275).add(-0.2);
  
  // Apply scaling to the thermal band (ST_B10)
  var thermalBands = image.select('ST_B10')
    .multiply(0.00341802).add(149.0);

  // Add the scaled bands back to the image
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBands, null, true);
}

// Apply the scaling function to the dataset
dataset = dataset.map(applyScaleFactors);

// Select the first image from the dataset and clip it to the AOI
var firstImage = dataset.first().clip(aoi);

// Calculate NDVI, NDWI, and NDBI indices
var ndvi = firstImage.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');  // Vegetation
var ndwi = firstImage.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI');  // Water
var ndbi = firstImage.normalizedDifference(['SR_B6', 'SR_B5']).rename('NDBI');  // Built-up

// Add the calculated indices as new bands
var withIndices = firstImage.addBands([ndvi, ndwi, ndbi]);

var KochiImage = withIndices.select(['NDBI','NDVI','NDWI','SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']).toFloat();
print(KochiImage)

// Visualization parameters for true-color composite (RGB bands)
var visualization = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3
};

// Add the image to the map for visualization
Map.centerObject(aoi, 10);
Map.addLayer(firstImage, visualization, 'True Color (432)');

// Visualization parameters for NDVI, NDWI, and NDBI
var ndbiVis = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'red']
};

var ndviVis = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'green']
};

var ndwiVis = {
  min: -1,
  max: 1,
  palette: ['brown', 'white', 'blue']
};

// Add layers for NDVI, NDWI, NDBI visualization
Map.addLayer(ndbi, ndbiVis, 'NDBI');
Map.addLayer(ndvi, ndviVis, 'NDVI');
Map.addLayer(ndwi, ndwiVis, 'NDWI');

print(Urban)
print(Water)
print(Vegetation)
print(Barren)

var FeaLabelsKochi = ee.FeatureCollection([Urban, Water, Vegetation, Barren]);

Export.table.toDrive(FeaLabelsKochi)
Export.image.toDrive(KochiImage);