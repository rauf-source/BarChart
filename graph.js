fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response => response.json())
.then(json=> {
//creating our main svg for graph
const h = 400;
const w =  1000;
const padding =  60;
const svg =  d3.select("#graph")
			   .append("svg")
			   .attr("width", w)
			   .attr("height", h);
/*
getting data from json that we we need
and then assigning that data to arrays*/

//let's call the years (x-axis) as year
//and the gdp as gdp
let date =  json.data.map((n)=>{
	return n[0]
})
let gdp =  json.data.map((n)=>{
	return n[1]
})
/*d3.select("body")
.append("text")
.text("<b>what the heck</b>")
console.log(date, gdp)*/

//now we have arrays of dates and gdp

//fetch only years from  date and store it in years array also the quarters, 
let years = date.map((n)=>{
	
	return [parseInt(n.substring(0,4) ), returnQuarter(parseInt(n.substring(5,7)))] 
})
//seems like we have to create a function for assing quarter specifically using logic
//***********************making data given to us usefull for us in the program**************
function returnQuarter(n){
	switch(n){
		//1,4,7,10
		case 1:
		return "Q1";
		break;

		case 4:
		return "Q2";
		break;

		case 7:
		return "Q3";
		break;

		case 10:
		return "Q4";
		break;

		default:
		return "Qn"; 
	}
}
function returnPoints(n){
	switch(n){
		//1,4,7,10
		case 1:
		return 0;
		break;

		case 4:
		return 0.25;
		break;

		case 7:
		return 0.50;
		break;

		case 10:
		return 0.75;
		break;

		default:
		return "Qn"; 
	}
}
/*console.log(years)*/
//years array now has [(int) year, (String) quarter]

//now let's make gdpData array containing years and gdp, but only years this time
//found out later I also need width so I'm gonna divide everyvalue by total length, 
let gdpData = [];
for(let i = 0 ; i < json.data.length; i++){
	gdpData[i] =  [parseInt(json.data[i][0].substring(0,4) ), returnPoints(parseInt(json.data[i][0].substring(5,7)) ),parseInt(json.data[i][1]) ]

}

for(let i = 0; i <  gdpData.length;i++){
	gdpData[i][0] += gdpData[i][1] 
}

for(let i = 0; i <  gdpData.length;i++){
	gdpData[i].splice(1,1) 
	years[i][0] = gdpData[i][0]
}


console.log(gdpData);
//gdp is done, [year.quarter, ]
//x-scale for years
const xScale  =  d3.scaleLinear()
					.domain([d3.min(gdpData, d=>d[0]),d3.max(gdpData, d=> d[0])])
					.range([padding,w -padding])

const yScale  =  d3.scaleLinear()
					.domain([d3.min(gdpData, d=>d[1]),d3.max(gdpData, d=>d[1])])
					.range([h- padding,padding])
//make x and y axes
const xAxis =  d3.axisBottom(xScale);
const yAxis =  d3.axisLeft(yScale);
//(0 , y) 
svg.append("g")
.attr("transform", "translate(0 ," +(h - padding) + " )" )
.call(xAxis);
//(x,0)
svg.append("g")
.attr("transform", "translate(" + padding + ", 0)" )
.call(yAxis);
console.log(xScale(d3.max(gdpData,d=> d[0])))
//append rect elements to make graph with scales
//data is actually gdp

d3.select('svg').selectAll("rect")
.data(gdpData)
.enter()
.append("rect")
.attr("x", (d,i)=> xScale(d[0]))
.attr("y", (d,i)=> h - yScale(d[1]))
.attr("height", (d,i)=> h-280)
.attr("width", (d,i)=> 2);







})
