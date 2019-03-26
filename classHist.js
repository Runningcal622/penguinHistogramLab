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
                .domain([0,10])
                .range([0,width]);

  var binMaker = d3.histogram()
                  .domain(xScale.domain)
                  .threshold(xScale.ticks(10));

  var bins = binMaker(dayData);

  var yScale = d3.scaleLinear()
                 .domain([0,data.length])
                 .range([height,0]);

  var barArea = svg.append("g")
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x",function(d,i){
      console.log("hi");
      return i*barWidth + margins.left;
    })
    .attr("y",function(d){
    return height + margins.top - yScale(10 - d.length);})
    .attr("width",barWidth-10)
    .attr("height",function(d){
      return  yScale(10 - d.length);});



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
