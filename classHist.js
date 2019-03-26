var data = d3.json("classData.json");
data.then(function(data){
  initializeScreen(data);
}
,
function(err){
  console.log(err);
})


var margins ={
  top:10,
  bottom:50,
  left:50,
  right:10
}

var initializeScreen = function(data)
{

  var width = 400;
  var height = 400;
  var body = d3.select("body");
  var svg  = body.append("svg")
              .attr("width",width)
              .attr("height",height)

  width = width - margins.left -margins.right;
  height = height-margins.top-margins.bottom;
  var barWidth = width/data.length;


  var day = 1;
  var dayP = body.append("text").text(day).classed("dayOn",true);

  var dayData = getDataForDay(data,day-1);

  console.log(dayData);
  var xScale = d3.scaleLinear()
                .domain([0,11])
                .range([0,width]);

  var binMaker = d3.histogram()
                  .domain(xScale.domain())
                  .thresholds(xScale.ticks(10));

  var bins = binMaker(dayData);
  console.log(bins);
  var yScale = d3.scaleLinear()
                 .domain([0,data.length])
                 .range([height,0]);

  var barArea = svg.append("g")
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x",function(d,i){
      //console.log("hi");
      return 102.5+xScale(d.x0);
    })
    .attr("y",function(d){
      console.log(d.length);
    return height + margins.top - yScale(data.length - d.length);})
    .attr("width",barWidth-10)
    .attr("height",function(d){
      return  yScale(data.length - d.length);});

      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);



      svg.append("g").classed("yAxis",true)
                .call(yAxis)
                .attr("transform","translate("+(margins.left+20)+","+(margins.top)+")");
      svg.append("g").classed("xAxis",true)
                .call(xAxis)
                .attr("transform","translate("+(margins.left+20)+","+(margins.top+height)+")");

      var prevButton = body.append("button").classed("prevButton",true)
      .text("Prev")
      .on("click",function(){updateScreen(day-2,data, "prev");});

      var nextButton = body.append("button").classed("nextButton",true)
      .text("Next")
      .on("click",function(){updateScreen(day,data, "next");});

    }



    var updateScreen = function(newDay,data, change)
    {
      var width = 400;
      var height = 400;
      width = width - margins.left -margins.right;
      height = height-margins.top-margins.bottom;
      var barWidth = width/data.length;
      var day = d3.select(".dayOn").textContent
      if (change==="next")
      {
        day+=1;
      }
      else {
        day-=1;
      }

      if (day===-1)
      {
        day=0;
      }
      if (day===38)
      {
        day = 37;
      }

      var dayData = getDataForDay(data,day-1);

      var xScale = d3.scaleLinear()
                    .domain([0,10])
                    .range([0,width]);

      var binMaker = d3.histogram()
                      .domain(xScale.domain())
                      .thresholds(xScale.ticks(10));

      var bins = binMaker(dayData);


      var barArea = d3.select("svg")
        .selectAll("rect")
        .data(bins)
        .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .attr("y",function(d){
        return height + margins.top - yScale(data.length - d.length);})
        .attr("height",function(d){
          return  yScale(data.length - d.length);});

          var prevButton = d3.select("body").select(".prevButton")
          .on("click",function(){updateScreen(day-1,data, "prev");});
          console.log("after 1 button "+day);
          var nextButton = d3.select("body").select(".nextButton")
          .on("click",function(){updateScreen(day+1,data, "next");});

        var dayP = d3.select(".dayOn").text("    "+(data[0].quizes[day-1].day)+"    ");


    }



  var getDataForDay = function(data,indexOfDay)
  {
    console.log("called");
    var listOfQuizGrades = [];
    data.forEach(function(d,i)
    {
      listOfQuizGrades.push(d.quizes[indexOfDay].grade);
    });

    return listOfQuizGrades;



  }
