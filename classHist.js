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

day = 1;
index = 0;


var changeToDay = function()
{
  var input = document.getElementById("newDay").value;
  if (input<15)
  {
    index = input-1;
  }
  else if (input<30)
  {
    index = input-2;
  }
  else {
    index = input-3
  }
  var data = d3.json("classData.json");
  data.then(function(data){
    updateScreen(index,data);
  }
  ,
  function(err){
    console.log(err);
  })
  document.getElementById("newDay").value = "";
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





  var dayP = body.append("text").text("Day: "+day).classed("dayOn",true);

  var dayData = getDataForDay(data,index);

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

  var colors = d3.scaleOrdinal(d3.schemeSet2);


  var barArea = svg.append("g")
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x",function(d,i){
      //console.log("hi");
      return 68+xScale(d.x0);
    })
    .attr("y",function(d){
      console.log(d.length);
    return height + margins.top - yScale(data.length - d.length);})
    .attr("width",barWidth-10)
    .attr("height",function(d){
      return  yScale(data.length - d.length);})
    .attr("fill",function(d){
      return colors(d.length);
    });


    svg.append("g")
       .selectAll("text")
       .data(bins)
       .enter()
       .append("text")
       .attr("x",function(d,i){
         console.log("hi");
         return 68+xScale(d.x0);
       })
       .attr("y",function(d){
       return height + margins.top - yScale(data.length - d.length)-10;})
       .text(function(d){
         if (d.length!=0)
         {
         return d.length;
       }
       });


      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);



      svg.append("g").classed("yAxis",true)
                .call(yAxis)
                .attr("transform","translate("+(margins.left+10)+","+(margins.top)+")");
      svg.append("g").classed("xAxis",true)
                .call(xAxis)
                .attr("transform","translate("+(margins.left+20)+","+(margins.top+height)+")");

      var prevButton = body.append("button").classed("prevButton",true)
      .text("Prev")
      .on("click",function(){updateScreen(index-1,data, "prev",yScale);});

      var nextButton = body.append("button").classed("nextButton",true)
      .text("Next")
      .on("click",function(){updateScreen(index+1,data, "next",yScale);});

    }



    var updateScreen = function(theIndex,data, change,yScale)
    {
      var width = 400;
      var height = 400;
      width = width - margins.left -margins.right;
      height = height-margins.top-margins.bottom;
      var barWidth = width/data.length;
      var day = d3.select(".dayOn").textContent

      if (theIndex===-1)
      {
        theIndex=0;
      }
      if (theIndex===38)
      {
        theIndex = 37;
      }
      index=theIndex;

      var dayData = getDataForDay(data,theIndex);
      var xScale = d3.scaleLinear()
                    .domain([0,11])
                    .range([0,width]);

      var yScale = d3.scaleLinear()
                     .domain([0,data.length])
                     .range([height,0]);
      var binMaker = d3.histogram()
                      .domain(xScale.domain())
                      .thresholds(xScale.ticks(10));

      var bins = binMaker(dayData);
      day = data[0].quizes[theIndex].day;

      var colors = d3.scaleOrdinal(d3.schemeSet2);


      var barArea = d3.select("svg")
        .selectAll("rect")
        .data(bins)
        .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .attr("x",function(d,i){
          //console.log("hi");
          return 68+xScale(d.x0);
        })
        .attr("y",function(d){
          //console.log(d.length);
        return height + margins.top - yScale(data.length - d.length);})
        .attr("width",barWidth-10)
        .attr("height",function(d){return  yScale(data.length - d.length);})
        .attr("fill",function(d){
            return colors(d.length);
          });

          d3.select("svg")
             .selectAll("text")
             .data(bins)
             .transition()
             .duration(1000)
             .ease(d3.easeCubic)
             .attr("x",function(d,i){
               console.log("hi");
               return 68+xScale(d.x0);
             })
             .attr("y",function(d){
             return height + margins.top - yScale(data.length - d.length)-10;})
             .text(function(d){
               if (d.length!=0)
               {
               return d.length;
             }
             });

        var prevButton = d3.select("body").select(".prevButton")
        .on("click",function(){updateScreen(index-1,data, "prev",yScale);});
      //  console.log("after 1 button "+day);
        var nextButton = d3.select("body").select(".nextButton")
        .on("click",function(){updateScreen(index+1,data, "next",yScale);});

        var dayP = d3.select(".dayOn").text("Day: "+(day)+"    ");

    }



  var getDataForDay = function(data,indexOfDay)
  {
    var listOfQuizGrades = [];
    data.forEach(function(d,i)
    {
      //console.log(d.quizes);
      listOfQuizGrades.push(d.quizes[indexOfDay].grade);
    });
    console.log(listOfQuizGrades);

    return listOfQuizGrades;



  }
