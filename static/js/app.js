// Create URL variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Read in JSON 
d3.json(url).then(function(data) {

});

// Plots
function Plots(id) {

    d3.json(url).then(function(data) {
        // Create data references  
        let samples = data.samples;
        let idFilter = samples.filter(sample => sample.id === id);
        let firstValue = idFilter[0];
        let sampleValueTop10 = firstValue.sample_values.slice(0, 10).reverse();
        let otuIdTop10 = firstValue.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let otuLabelTop10 = firstValue.otu_labels.slice(0, 10).reverse();
        
        // Bar Chart 
        let graphData = {
            x: sampleValueTop10,
            y: otuIdTop10,
            text: otuLabelTop10,
            type: "bar",
            orientation: "h"
        };
  
        // Data trace array
        let traceData = [graphData];

        let layout = {
            height: 600,
            width: 800
        };
    
        Plotly.newPlot("bar", traceData, layout);

        // Bubble Chart 
        let bubbleData = {
            x: firstValue.otu_ids,
            y: firstValue.sample_values,
            text: firstValue.otu_labels,
            mode: 'markers',
            marker: {
                color: firstValue.otu_ids,
                size: firstValue.sample_values
            }
        };

        // Data trace array
        let tracebubble = [bubbleData];

        let bubbleLayout = {
            height: 600,
            width: 1000
        };

        Plotly.newPlot("bubble", tracebubble, bubbleLayout);

    });

}

// Init function for dropdown menu 
function init() {
    d3.json(url).then(function(data) {

        // Select dropdown menu and grab information
        let dropdownMenu = d3.select("#selDataset");
        let name = data.names;

        // Append IDs to dropdown menu
        name.forEach((id) => {
            dropdownMenu.append("option").text(id)
        });
    
        // Determine inital graph data 
        let firstData = name[0];

        // Display inital graphs 
        Plots(firstData);
        Demographics(firstData);
    });
};

// Demographics 
function Demographics(id) {

    // Grab information
    d3.json(url).then(function(data) {

        // Filter metadata for each ID
        let demoInfo = data.metadata.filter(info => info.id == id);

        // Grab first value
        let firstDemo = demoInfo[0];

        // Select metadata location in html file
        d3.select("#sample-metadata").html("");

        // Append each key-value pair 
        Object.entries(firstDemo).forEach(([key, value]) => {
            console.log(key, value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Update the Plots
function optionChanged(value) { 
    Plots(value);
    Demographics(value);
}
  
init();