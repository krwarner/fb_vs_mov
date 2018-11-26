var width = 1200,
    height = 600,
    centered;

var inputValue = 2018;
var time = ["2018","2020","2022","2024"];

var color = d3.scaleThreshold()
  .range(["#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"])
  .domain([0.014, 0.032, 0.045, 0.075, 0.1, 0.15, 0.3, 0.56]);
  
var colorFB = d3.scaleThreshold()
  .range(["#4d9900","#66cc00","#80ff00","#99ff33","#b3ff66","#ccff99"])
  .domain([-40000, -15000, -10000, -5000, -2500, 0]);

var colorDem = d3.scaleThreshold()
  .range(["#809fff","#4d79ff","#1a53ff","#0039e6","#002db3", "#002080", "#001a66"])
  .domain([1, 2500, 10000, 25000, 40000, 55000, 70000]);

var colorRep = d3.scaleThreshold()
  .range(["#ffcccc","#ff9999","#ff6666","#ff3333","#ff0000","#cc0000", "#990000"])
  .domain([1, 2500, 10000, 25000, 40000, 55000, 70000]);

var svg = d3.select(".scroll__figure").append("svg")
    .style("width", "100%")
    .style("height", "100%");

var tooltip = d3.select(".scroll__figure")
    .append("div")
    .attr("class", "tooltip")
    .style("background", "black")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

const projection = d3.geoAlbersUsa();
const albersPath = d3.geoPath()
    .projection(projection);

const hexTransform = d3.geoTransform({
      point: function(x, y) {
        this.stream.point(x, -y)
      }
    });

const path = d3.geoPath().projection(hexTransform);

const usAbbrs = {
      AL: 'Alabama',
      AK: 'Alaska',
      AS: 'American Samoa',
      AZ: 'Arizona',
      AR: 'Arkansas',
      CA: 'California',
      CO: 'Colorado',
      CT: 'Connecticut',
      DE: 'Delaware',
      DC: 'District Of Columbia',
      FM: 'Federated States Of Micronesia',
      FL: 'Florida',
      GA: 'Georgia',
      GU: 'Guam',
      HI: 'Hawaii',
      ID: 'Idaho',
      IL: 'Illinois',
      IN: 'Indiana',
      IA: 'Iowa',
      KS: 'Kansas',
      KY: 'Kentucky',
      LA: 'Louisiana',
      ME: 'Maine',
      MH: 'Marshall Islands',
      MD: 'Maryland',
      MA: 'Massachusetts',
      MI: 'Michigan',
      MN: 'Minnesota',
      MS: 'Mississippi',
      MO: 'Missouri',
      MT: 'Montana',
      NE: 'Nebraska',
      NV: 'Nevada',
      NH: 'New Hampshire',
      NJ: 'New Jersey',
      NM: 'New Mexico',
      NY: 'New York',
      NC: 'North Carolina',
      ND: 'North Dakota',
      MP: 'Northern Mariana Islands',
      OH: 'Ohio',
      OK: 'Oklahoma',
      OR: 'Oregon',
      PW: 'Palau',
      PA: 'Pennsylvania',
      PR: 'Puerto Rico',
      RI: 'Rhode Island',
      SC: 'South Carolina',
      SD: 'South Dakota',
      TN: 'Tennessee',
      TX: 'Texas',
      UT: 'Utah',
      VT: 'Vermont',
      VI: 'Virgin Islands',
      VA: 'Virginia',
      WA: 'Washington',
      WV: 'West Virginia',
      WI: 'Wisconsin',
      WY: 'Wyoming',
  }

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

const g = svg.append('g');

function clicked(d) {
    var x, y, k;

    if (d && centered !== d) {
      var centroid = albersPath.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;

      if (k === 4) {
        var rangeSlider = document.getElementsByClassName("range");
        for (var i = 0; i < rangeSlider.length; i++) {
            rangeSlider[i].style.zIndex = -1;
        }

        var rangeLabels = document.getElementsByClassName("range-labels");
        for (var i = 0; i < rangeLabels.length; i++) {
            rangeLabels[i].style.zIndex = -2;
        }
      }
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;

        if (k === 1) {
          var rangeSlider = document.getElementsByClassName("range");
          for (var i = 0; i < rangeSlider.length; i++) {
              rangeSlider[i].style.zIndex = 2;
          }

          var rangeLabels = document.getElementsByClassName("range-labels");
          for (var i = 0; i < rangeLabels.length; i++) {
              rangeLabels[i].style.zIndex = 1;
          }
        }
      }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}

var movData = d3.csv("https://gist.githubusercontent.com/krwarner/b1e1358cfb016cdce5b3b9e2633b8d48/raw/63628367dc185fbdad67a79c9d069c063e56076c/fb_mov_data_years.csv");
var topoData = d3.json("https://gist.githubusercontent.com/krwarner/ba149b4ed187b80cce4b9aad2135ddae/raw/8d564df8079729c819781819a084c9a1587dc434/congress_topo.json");
var hexTopo = d3.json('https://gist.githubusercontent.com/jeremiak/1c986c7b533dd1dc271e48e10c37adf5/raw/58a3dfce70ef6c32ba2b941f35471c5b0da0dfbf/us-hex-tiles.topo.json');

Promise.all([movData, topoData, hexTopo]).then(ready);

function ready(data) {
  // var dataStep = document.getElementsByClassNames("step");
  // for (var i = 0; i < dataStep.length; i++) {
  //             if (d3.select(dataStep[i]).attr("data-step") == 1) 
  //         }
  
  // console.log(mov_vs_fb20);
  let mov_vs_fb = data['0'];
  let congressTopo = data['1'];
  let hexTopo = data['2'];

  const hasNoCongressionalRep = ['Puerto Rico', 'District of Columbia', 'U.S. Virgin Islands', 'Guam', 'Northern Mariana Islands', 'American Samoa'];
  const geojson = topojson.feature(congressTopo, congressTopo.objects.congress);
  const filtered = geojson.features.filter(f => !hasNoCongressionalRep.includes(f.properties.STATE));
  geojson.features = filtered;

  const congress = geojson;

  var hex = topojson.feature(hexTopo, hexTopo.objects.tiles);
    
  function getCorrespondingHex(state, district) {
    const stateHex = hex.features.find(f => f.properties.name === state.toUpperCase())
    if (stateHex.geometry.type === 'Polygon') return stateHex
    return {
      ...stateHex,
      geometry: {
        type: 'Polygon',
        coordinates: stateHex.geometry.coordinates[+district - 1]
       }
    }
  }
      
    
  const features = congress.features.map(feature => {
    const { CONG_DIST: cd, STATE: state } = feature.properties
    const hex = getCorrespondingHex(state, cd)
    return {
      ...feature,
      paths: {
        district: albersPath(feature),
        hex: path(hex)
      }
    }
  });

  mov_vs_fbByDist18 = {};
  mov_vs_fbByDist20 = {};
  mov_vs_fbByDist22 = {};
  mov_vs_fbByDist24 = {};
  
  mov_vs_fb.forEach(function(d) {
    d.mov_vs_FB = +d.mov_vs_FB;
    d.mov_2016 = +d.mov_2016;
    d.party = d.party;
    d.pct_change16_20 = +d.pct_change16_20;
    d.poe_2018 = +d.poe_2018; 
    d.year = +d.year;
    if (d.year == 2018) {
      mov_vs_fbByDist18[d.GEOID] = d;
    } else if (d.year == 2020) {
      mov_vs_fbByDist20[d.GEOID] = d;
    } else if (d.year == 2022) {
      mov_vs_fbByDist22[d.GEOID] = d;
    } else if (d.year == 2024) {
      mov_vs_fbByDist24[d.GEOID] = d;
    }
  });

  var format = d3.format(".2%");
  var commas = d3.format(",");

  // console.log(mov_vs_fb);

  var subset = topojson.feature(congressTopo, congressTopo.objects.congress).features.filter(function(d) {
    return d.id in (mov_vs_fbByDist18);
  });
  
  g.attr('data-current', 'albers')
  g.selectAll("path")
      .data(features)
    .enter().append("path")
      .attr("class", 'cd-path')
      .style("fill", initialState)
      .style("stroke", "#595959")
      .style("stroke-width", "0.15px")
      .attr('d', d => d.paths.district)
      .attr('data-district', d => `${d.properties.STATE.toUpperCase()}-${d.properties.CONG_DIST}`)
      .on("click", clicked)
      .on("mouseover", function(d) {
        if (d.id in mov_vs_fbByDist18) {
          var val = mov_vs_fbByDist18[d.id];
          var fill_color = color(val["poe_2018"]);
          tooltip.html("");
          tooltip.style("visibility", "visible")
            .style("border", "7px solid " + fill_color)
            .zIndex = 100;

          tooltip.append("h3").text(val.geolabel);

          tooltip.append("div")
            .text("Margin of Victory 2016: " + commas(val["mov_2016"]));
          tooltip.append("div")
            .text("Margin of Victory Compared to Foreign Born Growth: " + commas(val["mov_vs_FB"]));
          tooltip.append("div")
            .style("color", "white")
            .text("Foreign Born Percentage of Electorate 2018: " + format(val["poe_2018"]));

          d3.selectAll("path.cd-path")
            .style("opacity", 0.3)
          d3.select(this)
            .style("opacity", 1)
            .style("stroke", "#222")
            .raise();
        }
      })
      .on("mousemove", function() {
        return tooltip.style("top", (d3.event.pageY-(pageYOffset)) + "px").style("left", (d3.event.pageX - 660) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
        d3.selectAll("path.cd-path")
          .style("opacity", 1);
      });
  
    // when the input range changes update the rectangle 

 //  var stepSlide = step._groups[0][1].className;

 //  console.log(stepSlide === "step is-active");

 // if (stepSlide === "step is-active") {
 //        d3.select('#timeslide')._groups[0][0].value = "3";
 //        console.log(d3.select('#timeslide')._groups[0][0].value = "3");
 //        d3.select("#timeslide").on("input", function() {
 //            update(+this.value);
 //        });
 // } else {
    d3.select("#timeslide").on("input", function() {
      update(+this.value);
    });
 // }
  
  function update(value) {
    document.getElementById("range").innerHTML=time[value];
    inputValue = time[value];

    // var dataStep = document.getElementById("datastep1");
    
    g.selectAll("path.cd-path")
      .style("fill", function(d) {
        return timeMatch(d);
        })
      
  }

  // svg.append("path")
  //     .datum(topojson.mesh(us, us.objects.STATE_FIPS, function(a, b) { return a.id !== b.id; }))
  //     .attr("class", "STATE_FIPS")
  //     .attr("d", path);

  g.append("text")
    .style("font-weight", "bold")
    .attr("x", width - 430)
    .attr("y", height - 250)
    .text("Margin of Victory vs");
  g.append("text")
    .style("font-weight", "bold")
    .attr("x", width - 430)
    .attr("y", height - 232)
    .text("Foreign Born Growth");

  var legend1 = g.selectAll(".legend")
    .data(colorDem.domain().reverse())
    .enter().append("g")
    .attr("transform", function(d,i) {
      return "translate(" + (width-410) + "," + (height - 224 + 16 * i) + ")";
    });

  legend1.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) {
      return colorDem(d);
    });

  legend1.append("text")
    .attr("x", 16)
    .attr("y", 9)
    .style("font-size", "10px")
    .text(function(d) {
      return commas(d);
    });
    
  var legend2 = g.selectAll(".legend")
  .data(colorRep.domain().reverse())
  .enter().append("g")
  .attr("transform", function(d,i) {
    return "translate(" + (width-425) + "," + (height - 224 + 16 * i) + ")";
  });

  legend2.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) {
      return colorRep(d);
    });
  
  var legend3 = g.selectAll(".legend")
    .data(colorFB.domain().reverse())
    .enter().append("g")
    .attr("transform", function(d,i) {
      return "translate(" + (width-350) + "," + (height - 224 + 16 * i) + ")";
    });

  legend3.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) {
      return colorFB(d);
    });

  legend3.append("text")
    .attr("x", 16)
    .attr("y", 9)
    .style("font-size", "10px")
    .text(function(d) {
      return commas(d);
    });
    
    function use_data(d) {
      if (inputValue == "2018") {
        return mov_vs_fbByDist18[d.id];
      } else if (inputValue == "2020") {
        return mov_vs_fbByDist20[d.id];
      } else if (inputValue == "2022") {
        return mov_vs_fbByDist22[d.id];
      } else if (inputValue == "2024") {
        return mov_vs_fbByDist24[d.id];
      }
    }
    
    function timeMatch(d) {
        if (inputValue == "2018") {
          if (d.id in mov_vs_fbByDist18) {
            var green_val = mov_vs_fbByDist18[d.id];
            var blue_val = mov_vs_fbByDist18[d.id];
            var red_val = mov_vs_fbByDist18[d.id];
            if (mov_vs_fbByDist18[d.id]["party"] == "R" && mov_vs_fbByDist18[d.id]["mov_vs_FB"] > 0) {
                return colorRep(red_val["mov_vs_FB"]);
            } else if (mov_vs_fbByDist18[d.id]["party"] == "D" && mov_vs_fbByDist18[d.id]["mov_vs_FB"] > 0) {
                return colorDem(blue_val["mov_vs_FB"]);
            } else if (mov_vs_fbByDist18[d.id]["mov_vs_FB"] <= 0) {
                return colorFB(green_val["mov_vs_FB"]);
            } 
          } else {
                 if (d.properties.PARTY_AFF == "Democrat") {
                    return "#e6ffff";
                  } else {
                    return "#ffebe6";
                  }
            } 
        } else if (inputValue == "2020") {
          if (d.id in mov_vs_fbByDist20) {
            var green_val = mov_vs_fbByDist20[d.id];
            var blue_val = mov_vs_fbByDist20[d.id];
            var red_val = mov_vs_fbByDist20[d.id];
            if (mov_vs_fbByDist20[d.id]["party"] == "R" && mov_vs_fbByDist20[d.id]["mov_vs_FB"] > 0) {
            return colorRep(red_val["mov_vs_FB"]);
            } else if (mov_vs_fbByDist20[d.id]["party"] == "D" && mov_vs_fbByDist20[d.id]["mov_vs_FB"] > 0) {
                return colorDem(blue_val["mov_vs_FB"]);
            } else if (mov_vs_fbByDist20[d.id]["mov_vs_FB"] <= 0) {
                return colorFB(green_val["mov_vs_FB"]);
            } 
          } else {
                 if (d.properties.PARTY_AFF == "Democrat") {
                    return "#e6ffff";
                  } else {
                    return "#ffebe6";
                  }
            }
        } else if (inputValue == "2022") {
          if (d.id in mov_vs_fbByDist22) {
            var green_val = mov_vs_fbByDist22[d.id];
            var blue_val = mov_vs_fbByDist22[d.id];
            var red_val = mov_vs_fbByDist22[d.id];
            if (mov_vs_fbByDist22[d.id]["party"] == "R" && mov_vs_fbByDist22[d.id]["mov_vs_FB"] > 0) {
            return colorRep(red_val["mov_vs_FB"]);
            } else if (mov_vs_fbByDist22[d.id]["party"] == "D" && mov_vs_fbByDist22[d.id]["mov_vs_FB"] > 0) {
                return colorDem(blue_val["mov_vs_FB"]);
            } else if (mov_vs_fbByDist22[d.id]["mov_vs_FB"] <= 0) {
                return colorFB(green_val["mov_vs_FB"]);
            }  
          } else {
                 if (d.properties.PARTY_AFF == "Democrat") {
                    return "#e6ffff";
                  } else {
                    return "#ffebe6";
                  }
            }
        } else {
          if (d.id in mov_vs_fbByDist24) {
            var green_val = mov_vs_fbByDist24[d.id];
            var blue_val = mov_vs_fbByDist24[d.id];
            var red_val = mov_vs_fbByDist24[d.id];
            if (mov_vs_fbByDist24[d.id]["party"] == "R" && mov_vs_fbByDist24[d.id]["mov_vs_FB"] > 0) {
            return colorRep(red_val["mov_vs_FB"]);
            } else if (mov_vs_fbByDist24[d.id]["party"] == "D" && mov_vs_fbByDist24[d.id]["mov_vs_FB"] > 0) {
                return colorDem(blue_val["mov_vs_FB"]);
            } else if (mov_vs_fbByDist24[d.id]["mov_vs_FB"] <= 0) {
                return colorFB(green_val["mov_vs_FB"]);
            } 
          } else {
                 if (d.properties.PARTY_AFF == "Democrat") {
                    return "#e6ffff";
                  } else {
                    return "#ffebe6";
                  }
            } 
        }
    }

    function initialState(d){
      
      if (document.getElementById("range").innerHTML == 2018) {
        if (d.id in mov_vs_fbByDist18) {
          var green_val = mov_vs_fbByDist18[d.id];
          var blue_val = mov_vs_fbByDist18[d.id];
          var red_val = mov_vs_fbByDist18[d.id];
          if (mov_vs_fbByDist18[d.id]["party"] == "R" && mov_vs_fbByDist18[d.id]["mov_vs_FB"] > 0) {
              return colorRep(red_val["mov_vs_FB"]);
          } else if (mov_vs_fbByDist18[d.id]["party"] == "D" && mov_vs_fbByDist18[d.id]["mov_vs_FB"] > 0) {
              return colorDem(blue_val["mov_vs_FB"]);
          } else if (mov_vs_fbByDist18[d.id]["mov_vs_FB"] <= 0) {
              return colorFB(green_val["mov_vs_FB"]);
          } else {
            return '#000';
          }
        } else {
          if (d.properties.PARTY_AFF == "Democrat") {
                  return "#e6ffff";
                } else {
                  return "#ffebe6";
                }
          }
      }
    }
}

