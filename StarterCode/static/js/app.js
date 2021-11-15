/* "samples":[{"id": "940", 
"otu_ids": [1167, 2859, 482, 2264, 41, 1189, 2244, 1193, 2167, 1208,  2188, 357, 342], 
"sample_values": [163, 126, 113, 78, 71, 51, 50, 47, 40, 40, 37, 36, 30, 28, 25, 23, 22, 19, 19, 14, 133, 2, 2], 
"otu_labels": ["Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria;Firmicutes", "Bacteria"]} 

*  Create a horizontal bar chart with a dropdown menu to display the t 10 OTUs found in that individual.
*  Use sample_values as the values for the bar chart.
*  Use otu_ids as the labels for the bar chart.
*  Use otu_labels as the hovertext for the chart.
*  Create a bubble chart that displays each sample.
*  Use otu_ids for the x values.
*  Use sample_values for the y values.
*  Use sample_values for the marker size.
*  Use otu_ids for the marker colors.
*  Use otu_labels for the text values.
*/


file = "/data/samples.json"

// ADDING NAMES TO DROPDOWN
d3.json(file).then(function(data) {
    var names = data.names;
    names.forEach(name => {
        d3.select("#selector").append("option").text(name);
    });
});

// EVENT LISTENER FOR UPDATING PLOT
d3.selectAll("#selector").on("change", updatePlot);


// SET DEFAULT PLOTS
function plotting (idNumber) {
    d3.json(file).then(function(data) {
    var samples = data.samples;
    defaultSamples = data.samples.filter(sample => sample.id == "940")[0];
    var allSamples = defaultSamples.sample_values;
    var allIds = defaultSamples.otu_ids;
    var allLabels = defaultSamples.otu_labels;
    var tenSamples = allSamples.slice(0,10);
    var tenIds = allIds.slice(0,10);
    var tenLabels = allLabels.slice(0,10);


    // ADD RESPONSIVE CONFIG FOR PLOTS
    var config = {responsive: true};
    // BAR CHART
    var barTrace = {
        x: tenSamples,
        y: tenIds.map(id => `OTU ${id}--`),
        text: tenLabels,
        type: "bar",
        orientation: "h",
        hoverlabel: { bgcolor: "#FFF", color: "black"},
        marker: {
                color: 'rgb(132, 147, 36)',
                width: 1,
            line: {
                color: 'rgb(1, 41, 95)',
                width: 1.5
        }}
        };

    var barLayout = {
        title: {text: "Top 10 Operational Taxonomic Units (OTUs)",
        size:"100px"},
        xaxis: {title: "Value"},
        yaxis: {title: "OTU ID"},
        autosize: true,
        margin:{
            t:50,
            r:50,
            b:100,
            l:100
          },
        plot_bgcolor:'rgba(0,0,0,0)',
        paper_bgcolor:'rgba(0,0,0,0)',
    };



    var barData = [barTrace];
    Plotly.newPlot("bar", barData, barLayout, config);
    
    // SIDEBAR DATA
    var defaultSidebar = data.metadata.filter(sample => sample.id === 940)[0];
    Object.entries(defaultSidebar).forEach(([key, value]) => d3.select("#sample-metadata").append("p").html(`<strong style="font-weight:700;">${key}</strong>: <div style="font-weight:500;">${value}</div>`));

    // BUBBLE PLOT
    var colors = [
    "#01295F","#437F97","#849324","#FFB30F","#CEE5F2","#CEE5F2","#22547B","#AC370C","#64895E","#C2A31A","#E7CC81","#435E42","#CC8B00","#BBCF3A","#88854C","#A52422","#8B728E","#D95D39"
    ]

    var bubbleTrace = {
        x: allIds,
        y: allSamples,
        text: allLabels,
        mode: "markers",
        autosize:true,
        marker: {
            color: colors,
            size: allSamples
        }
    };

    var bubbleLayout = {
        title: "All Operational Taxonomic Units (OTUs)",
        yaxis: {title: "Value"},
        xaxis: {title: "OTU ID"},
        plot_bgcolor:'rgba(0,0,0,0)',
        paper_bgcolor:'rgba(0,0,0,0)',
    };


    var bubbleData = [bubbleTrace];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

}); 
};

plotting();

// FUNCTION TO UPDATE PLOT
function updatePlot() {
    d3.json(file).then(function(data) {
    var dropDown = d3.select("#selector");
    var selection = dropDown.property("value");
    var updatedSample = data.samples.filter(sample => sample.id == selection);
    var updateData = updatedSample[0];
    var allSamplesUpdate = updateData.sample_values;
    var allidsUpdate = updateData.otu_ids;
    var allLabelsUpdate = updateData.otu_labels;
    var tenSampleUpdate = allSamplesUpdate.slice(0,10);
    var tenIdsUpdate = allidsUpdate.slice(0,10);
    var tenLabelsUpdate = allLabelsUpdate.slice(0,10);


    // RESTYLE PLOTS WITH NEW DATA
    Plotly.restyle("bar", "text", [tenLabelsUpdate]);
    Plotly.restyle("bar", "x", [tenSampleUpdate]);
    Plotly.restyle("bar", "y", [tenIdsUpdate.map(id => `OTU ${id}`)]);

    Plotly.restyle("bubble", "text", [tenLabelsUpdate]);
    Plotly.restyle("bubble", "x", [allidsUpdate]);
    Plotly.restyle("bubble", "y", [allSamplesUpdate]);

    // UPDATE SIDEBAR SECTION WITH NEW DEMOGRAPHIC DATA
    var sidebarUpdate = data.metadata.filter(sample => sample.id == selection)[0];

    var sidebar = d3.selectAll("#sample-metadata");
    sidebar.html("");

    Object.entries(sidebarUpdate).forEach(([key, value]) => d3.select("#sample-metadata").append("p").html(`<strong style="font-weight:700;">${key}</strong>: <div style="font-weight:500;">${value}</div>`));

    });
};

