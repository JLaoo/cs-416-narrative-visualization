let currentData = [];
let endDateIndex = 49;
let currentButton = 1;

const dateSlider = document.getElementById("dateSlider");
const sliderValue = document.getElementById("sliderValue");

function buttonClicked(buttonNumber) {
    console.log("Button " + buttonNumber + " clicked");
    d3.csv("data/cleaned_data.csv").then(function(data) {
        currentData = [];
        let startDate = 0;
        let endDate = 0;
        if (buttonNumber == 1) {
            currentButton = 1;
            dateSlider.max = 49;
            dateSlider.value = 49;
            sliderValue.textContent = 1799;
            startDate = 0;
            endDate = 1799;
        } else if (buttonNumber == 2) {
            currentButton = 2;
            dateSlider.max = 99;
            dateSlider.value = 99;
            sliderValue.textContent = 1899;
            startDate = 1800;
            endDate = 1899;
        } else if (buttonNumber == 3) {
            currentButton = 3;
            dateSlider.max = 99;
            dateSlider.value = 99;
            sliderValue.textContent = 1999;
            startDate = 1900;
            endDate = 1999;
        } else {
            currentButton = 4;
            dateSlider.max = 20;
            dateSlider.value = 20;
            sliderValue.textContent = 2020;
            startDate = 2000;
            endDate = 9999;
        }
        data.forEach(function(d) {
            if (d.year >= startDate && d.year <= endDate) {
                currentData.push(d);
            }
        });
        endDateIndex = currentData.length - 1;
        updateGraph();
        updateText(buttonNumber);
    });
}

function updateText(buttonNumber) {
    if (buttonNumber == 1) {
        document.getElementById('updated-text').textContent = "During the 18th century, carbon emissions in the UK were just beginning to ramp up with the start of the First Industrial Revolution. The First Industrial Revolution brought along with it many new inventions, but perhaps most importantly, in the context of CO2 emissions, greatly increased the amount of coal that was burned. During the 50 years displayed in this graph, we can see cumulative carbon emissions begin to slightly trend higher indicating that carbon emissions are indeed increasing year by year. However, this effect will be much more pronounced with the turn of the century.";
    } else if (buttonNumber == 2) {
        document.getElementById('updated-text').textContent = "With the 19th century, even more carbon emitting inventions are produced and become commercially widespread. The start of the second industrial revolution which brought with it great changes in standardization, mass production, and industrialization. While these changes great with regards to the technological advancement of mankind, these changes also brought along massive increases in CO2 emissions with the drastic increase in the burning of fuel. As we can see, the upward curve of the emissions graph in the 19th century is much more pronounced than that of the 18th century indicating the massive changes in technology this century.";
    } else if (buttonNumber == 3) {
        document.getElementById('updated-text').textContent = "In the 20th century, CO2 emissions continued to rapidly rise at a steady pace as demands for power and fuel increased, especially with the mass commercialization of automobiles and air transportation. However, it’s also during this century that climate change science came into prominence as undeniable proof that the atmosphere’s CO2 levels were increasing and causing temperatures to rise. While there were some scientists who brought up the possibility of man-made climate change as early as the 18th century, these claims were quickly dismissed as impossible. However, with the evidence provided by Dr. Charles David Keeling and other phenomena such as the hole in the ozone layer, countries were forced into action with one of the major milestones of the fight against climate change being the formation of the IPCC by the UN.";
    } else {
        document.getElementById('updated-text').textContent = "As climate change became a more urgent issue in the 21st century, the UK, arguably one of the leaders in climate change policy among the major economies of the world, passed several legally binding acts to try and limit its net carbon emissions.The UK Climate Change Act requires the government to set binding five-year carbon budgets based on science and reviews of the act have found that the law has helped reduce emissions in the UK, particularly in the power sector. The Paris agreement is a legally binding international treaty among countries to limit global warming to less than 2 degrees Celsius above pre-industrial levels. The zero net emissions law is a commitment from the UK to reduce its greenhouse gas emissions by 100% from 1990 levels by 2050, which would mean effectively “flattening the curve” in the above graph. As we can see in the graph for the 21st century, the curve appears to be slowly trending downwards, perhaps a sign that climate change policies are indeed effective in lowering carbon emissions.";
    }
}

const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const width = 1500 - margin.left - margin.right;
const height = 900 - margin.top - margin.bottom;

const parseDate = d3.timeParse("%Y");
const formatDate = d3.timeFormat("%Y");
const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function updateGraph() {
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale);

    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    const data = currentData
        .map(d => ({ date: parseDate(d.year), value: parseInt(d.co2_emission_tons) }))
        .slice(0, endDateIndex + 1);

    xScale.domain(d3.extent(data, d => d.date));
    yScale.domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);
    yScale.domain(d3.extent(data, d => d.value));

    svg.selectAll(".line").remove();
    svg.selectAll(".y-axis").remove();
    svg.selectAll(".x-axis").remove();
    svg.selectAll(".data-point").remove();
    svg.selectAll("text").remove();
    svg.selectAll(".annotation-group").remove();

    const yMidpoint = (yScale.range()[0] + yScale.range()[1]) / 2;
    const xMidpoint = (xScale.range()[0] + xScale.range()[1]) / 2;

    const dataPoints = svg.selectAll(".data-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.value))
        .attr("r", 6)
        .attr("fill", "red")
        .on("mouseover", function(d) {
            d = d.target.__data__
            let xAdj, yAdj
            if (xScale(d.date) >= xMidpoint) {
                xAdj = -130
            } else {
                xAdj = 10
            }
            if (yScale(d.value) >= yMidpoint) {
                yAdj = -20
            } else {
                yAdj = 20
            }
            console.log(d.value);
            const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .attr("transform", "translate(" + (xScale(d.date) + xAdj) + "," + (yScale(d.value) + yAdj) + ")");
            tooltip.append("text")
                .text("Year: " + formatDate(d.date))
                .style("font-weight", "bold")
                .attr("fill", "blue");
            tooltip.append("text")
                .attr("y", 20)
                .text("Emissions: " + d.value)
                .style("font-weight", "bold")
                .attr("fill", "blue");
        })
        .on("mouseout", function() {
            svg.select(".tooltip").remove();
        });

    const type = d3.annotationCallout
    const annotations1 = [{
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1760: Start of the First Industrial Revolution"
      },
      data: {date: "1760", value: 106193712},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1769: James Watt invents an improved steam engine"
      },
      data: {date: "1769", value: 210159712},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1791: John Barber invents the gas turbine"
      },
      data: {date: "1791", value: 567242160},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1792: William Murdoch invents gas lighting"
      },
      data: {date: "1792", value: 588665568},
      className: "show-bg",
      dy: 50,
      dx: 50
    }]
 const annotations2 = [{
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1870: Start of the Second Industrial Revolution"
      },
      data: {date: "1870", value: 7071545648},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1814: George Stephenson builds the first practical steam locomotive"
      },
      data: {date: "1814", value: 1235731632},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1858: Jean Lenoir invents an internal combustion engine"
      },
      data: {date: "1858", value: 4734917584},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1885: Karl Benz invents the first practical automobile to be powered by an internal-combustion engine"
      },
      data: {date: "1885", value: 11338962480},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1892: Rudolf Diesel invents the diesel-fueled internal combustion engine"
      },
      data: {date: "1892", value: 13716528416},
      className: "show-bg",
      dy: -50,
      dx: -30
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1832: William Sturgeon develops the first practical electric motor"
      },
      data: {date: "1832", value: 2125365488},
      className: "show-bg",
      dy: -50,
      dx: -30
    },
    ]
 const annotations3 = [{
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1908: Henry Ford launches the Ford Model T"
      },
      data: {date: "1908", value: 20269387232},
      className: "show-bg",
      dy: -90,
      dx: 10
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1954: Bell Labs demonstrates the first practical silicon solar cell"
      },
      data: {date: "1954", value: 41326559387},
      className: "show-bg",
      dy: -50,
      dx: -30
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1952: The DH 106 Comet debuts as the world's first commercial jet airliner"
      },
      data: {date: "1952", value: 40233338951},
      className: "show-bg",
      dy: 50,
      dx: 50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1958: Dr. Charles David Keeling provides the first evidence that CO2 levels are rising"
      },
      data: {date: "1958", value: 43604864569},
      className: "show-bg",
      dy: 50,
      dx: 90
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1985: Scientists discover a hole in the ozone layer above Antarctica"
      },
      data: {date: "1985", value: 59810567411},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1956: First commercial nuclear power is produced at Calder Hall, Cumbria, England"
      },
      data: {date: "1956", value: 42477834583},
      className: "show-bg",
      dy: -150,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "1988: The Intergovernmental Panel on Climate Change (IPCC) is established by the UN"
      },
      data: {date: "1988", value: 61521082716},
      className: "show-bg",
      dy: 50,
      dx: 50
    },
    ]
  const annotations4 = [{
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "2008: The UK Climate Change Act is passed"
      },
      data: {date: "2008", value: 72992999493},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "2015: The UK, along with 195 other countries, sign up to the Paris Agreement"
      },
      data: {date: "2015", value: 76293764798},
      className: "show-bg",
      dy: -50,
      dx: -50
    },
    {
      note: {
        bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
        title: "2019: The UK becomes the first major economy in the world to pass net zero emissions law"
      },
      data: {date: "2019", value: 77831566725},
      className: "show-bg",
      dy: 100,
      dx: -50
    },
    ]

 let annotations;
 if (currentButton == 1) {
    annotations = annotations1;
 } else if (currentButton == 2) {
    annotations = annotations2;
 } else if (currentButton == 3) {
    annotations = annotations3;
 } else {
    annotations = annotations4;
 }

const makeAnnotations = d3.annotation()
  .notePadding(15)
  .type(type)
  .accessors({
    x: d => xScale(parseDate(d.date)),
    y: d => yScale(d.value)
  })
  .accessorsInverse({
     date: d => timeFormat(x.invert(d.x)),
     close: d => y.invert(d.y)
  })
  .annotations(annotations)

    if (data.length > 1) {
        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations)
    }

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("CO2 Emission (Tons) ");


    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}

dateSlider.addEventListener("input", function() {
    endDateIndex = parseInt(this.value);
    updateGraph();
    sliderValue.textContent = currentData[endDateIndex].year;
});

buttonClicked(1);
