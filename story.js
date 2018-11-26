// using d3 for convenience
//1
var container = d3.select('#main-map-scroll');
var graphic = container.select('.scroll__figure');
var chart = graphic.select('.figure__chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

// initialize the scrollama
var scroller = scrollama();

//1
// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;

	graphic
		.style('width', bodyWidth + 'px')
		.style('height', window.innerHeight + 'px');

	var chartMargin = 32;
	var textWidth = text.node().offsetWidth;
	var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;

	chart
		.style('width', chartWidth + 'px')
		.style('height', Math.floor(window.innerHeight / 2) + 'px');


	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response, d) {

	var movData = d3.csv("https://gist.githubusercontent.com/krwarner/b1e1358cfb016cdce5b3b9e2633b8d48/raw/63628367dc185fbdad67a79c9d069c063e56076c/fb_mov_data_years.csv");
	var topoData = d3.json("https://gist.githubusercontent.com/krwarner/ba149b4ed187b80cce4b9aad2135ddae/raw/8d564df8079729c819781819a084c9a1587dc434/congress_topo.json");
	var hexTopo = d3.json('https://gist.githubusercontent.com/jeremiak/1c986c7b533dd1dc271e48e10c37adf5/raw/58a3dfce70ef6c32ba2b941f35471c5b0da0dfbf/us-hex-tiles.topo.json');

	Promise.all([movData, topoData, hexTopo]).then(next);

	function next(data) {

	  let mov_vs_fb = data['0'];
	  let congressTopo = data['1'];
	  let hexTopo = data['2'];

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

	  var subset = topojson.feature(congressTopo, congressTopo.objects.congress).features.filter(function(d) {
	    return d.id in (mov_vs_fbByDist18);
	  });

	  function timeMatch(d) {
        if (inputValue == "2018") {
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
              return "#000";
          }
        } else if (inputValue == "2020") {
          var green_val = mov_vs_fbByDist20[d.id];
          var blue_val = mov_vs_fbByDist20[d.id];
          var red_val = mov_vs_fbByDist20[d.id];
          if (mov_vs_fbByDist20[d.id]["party"] == "R" && mov_vs_fbByDist20[d.id]["mov_vs_FB"] > 0) {
          return colorRep(red_val["mov_vs_FB"]);
          } else if (mov_vs_fbByDist20[d.id]["party"] == "D" && mov_vs_fbByDist20[d.id]["mov_vs_FB"] > 0) {
              return colorDem(blue_val["mov_vs_FB"]);
          } else if (mov_vs_fbByDist20[d.id]["mov_vs_FB"] <= 0) {
              return colorFB(green_val["mov_vs_FB"]);
          } else {
              return "#000";
          }
        } else if (inputValue == "2022") {
          var green_val = mov_vs_fbByDist22[d.id];
          var blue_val = mov_vs_fbByDist22[d.id];
          var red_val = mov_vs_fbByDist22[d.id];
          if (mov_vs_fbByDist22[d.id]["party"] == "R" && mov_vs_fbByDist22[d.id]["mov_vs_FB"] > 0) {
          return colorRep(red_val["mov_vs_FB"]);
          } else if (mov_vs_fbByDist22[d.id]["party"] == "D" && mov_vs_fbByDist22[d.id]["mov_vs_FB"] > 0) {
              return colorDem(blue_val["mov_vs_FB"]);
          } else if (mov_vs_fbByDist22[d.id]["mov_vs_FB"] <= 0) {
              return colorFB(green_val["mov_vs_FB"]);
          } else {
              return "#000";
          }
        } else {
          var green_val = mov_vs_fbByDist24[d.id];
          var blue_val = mov_vs_fbByDist24[d.id];
          var red_val = mov_vs_fbByDist24[d.id];
          if (mov_vs_fbByDist24[d.id]["party"] == "R" && mov_vs_fbByDist24[d.id]["mov_vs_FB"] > 0) {
          return colorRep(red_val["mov_vs_FB"]);
          } else if (mov_vs_fbByDist24[d.id]["party"] == "D" && mov_vs_fbByDist24[d.id]["mov_vs_FB"] > 0) {
              return colorDem(blue_val["mov_vs_FB"]);
          } else if (mov_vs_fbByDist24[d.id]["mov_vs_FB"] <= 0) {
              return colorFB(green_val["mov_vs_FB"]);
          } else {
              return "#000";
          }
        }
    }

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

  // add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step
	// chart.select('p').text(response.index + 1)
	if (response.index === 0) {
		var rangeSlider = document.getElementsByClassName("range");
	    for (var i = 0; i < rangeSlider.length; i++) {
	        rangeSlider[i].style.zIndex = -1;
	    }

	    var rangeLabels = document.getElementsByClassName("range-labels");
	    for (var i = 0; i < rangeLabels.length; i++) {
	        rangeLabels[i].style.zIndex = -2;
	    }

	    var centroid = [200.9239094452596, 314.3187471561403];
	        x = centroid[0];
	        y = centroid[1];
	        k = 4;
	        centered = d;

	    g.selectAll("path")
	        .classed("active", centered && function(d) { return d === centered; });

	    g.transition()
	        .duration(1500)
	        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	        .style("stroke-width", 1.5 / k + "px");
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

        g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

	    g.transition()
	        .duration(1500)
	        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	        .style("stroke-width", 1.5 / k + "px");
		}
	}

	if (step._groups[0][1].className === 'step is-active') {

		inputValue = "2024";
		d3.select('#timeslide')._groups[0][0].value = "3";

	    g.selectAll("path.cd-path")
	      .style("fill", function(d) {
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
	       })
	}

	// const hasNoCongressionalRep = ['Puerto Rico', 'District of Columbia', 'U.S. Virgin Islands', 'Guam', 'Northern Mariana Islands', 'American Samoa'];
	// const geojson = topojson.feature(congressTopo, congressTopo.objects.congress);
	// const filtered = geojson.features.filter(f => !hasNoCongressionalRep.includes(f.properties.STATE));
	// geojson.features = filtered;

	// const congress = geojson;

	// hex = topojson.feature(hexTopo, hexTopo.objects.tiles)
	  
	//   function getCorrespondingHex(state, district) {
	//     const stateHex = hex.features.find(f => f.properties.name === state.toUpperCase())
	//     if (stateHex.geometry.type === 'Polygon') return stateHex
	//     return {
	//       ...stateHex,
	//       geometry: {
	//         type: 'Polygon',
	//         coordinates: stateHex.geometry.coordinates[+district - 1]
	//        }
	//     }
	//   }
	    
	  
	//   const features = congress.features.map(feature => {
	//     const { CONG_DIST: cd, STATE: state } = feature.properties
	//     const hex = getCorrespondingHex(state, cd)
	//     return {
	//       ...feature,
	//       paths: {
	//         district: albersPath(feature),
	//         hex: path(hex)
	//       }
	//     }
	//   });

	if (step._groups[0][2].className === 'step is-active') {

		  // const g = svg.append('g').attr('id', 'map').attr('transform', 'translate(0, 0) scale(1)')

		  // const stateBorders = Object.entries(usAbbrs).map(d => {
		  //   return topojson.merge(hexTopo, hexTopo.objects.tiles.geometries.filter(geometry => (
		  //     geometry.properties.name === d[1].toUpperCase()
		  //   )))
		  // });
		  
		  // g.append('g')
		  //   .selectAll('path')
		  //   .data(stateBorders)
		  //     .enter()
		  //       .append('path')
		  //         .attr('d', path)
		  //         .attr('stroke', '#ccc')
		  //         .attr('stroke-width', '3')
		  //         .attr('fill', 'none')

		  const current = g.attr('data-current')
		    const duration = 2000
		    const delay = 100
		    g.attr('data-current', (current === 'albers' ? 'hex' : 'albers'))
		    g.selectAll('path.cd-path')
		      .transition()
		        .duration(duration)
		        .delay(delay)
		        .attrTween('d', function(d) {
		          const data = this.__data__
		          if (current === 'albers') {
		            return flubber.interpolate(data.paths.district, data.paths.hex);
		          } else {
		            return flubber.interpolate(data.paths.hex, data.paths.district);
		          }
		        });

		    g.transition()
		      .duration(duration)
		      .delay(delay)
		      .attrTween('transform', function () {
		        let scale, tY
		        if (current === 'albers') {
		          scale = d3.interpolateNumber(1, .45)
		          tY = d3.interpolateNumber(0, 600 / 1.25)
		        } else {
		          scale = d3.interpolateNumber(.45, 1)
		          tY = d3.interpolateNumber(600 / 1.25, 0)
		        }

		        return function(t) {
		          return `translate(0, ${tY(t)}) scale(${scale(t)})`
		        }
		      });
	}

	}
	
}

function handleContainerEnter(response) {
	// response = { direction }

	// sticky the graphic (old school)
	graphic.classed('is-fixed', true);
	graphic.classed('is-bottom', false);
}

function handleContainerExit(response) {
	// response = { direction }

	// un-sticky the graphic, and pin to top/bottom of container
	graphic.classed('is-fixed', false);
	graphic.classed('is-bottom', response.direction === 'down');
}

function init() {
	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller.setup({
		// container: '#main-map-scroll',
		// graphic: '.scroll__figure',
		// text: '.scroll__text',
		step: '.scroll__text .step',
		offset: 0.75,
		debug: false
	})
		.onStepEnter(handleStepEnter)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit)

	// setup resize event
	window.addEventListener('resize', handleResize);
}

// kick things off
init();