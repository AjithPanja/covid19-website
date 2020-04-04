const Http = new XMLHttpRequest();
const url='https://api.covid19india.org/v2/state_district_wise.json';


var a,start;
var labels = []
var data = []
var state_labels = []
var state_data = []
function starting(){
	get_state_details('india');
}
function getLabels(){
	return labels;
}
function getData(){
	return data;
}
function get_state_details(j){
	d3.select('svg').remove()
	var width = 400,
    height = 450;
	var pat = "maps/"+j+".json";
	var ob = j+"_district";
	if(j=="india")
	{
		ob = j;
	}
	var path = d3.geo.path();
	
	
	var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height)
	.attr("viewBox","0 0 600 500")
	.attr("preserveAspectRatio","xMidYMid meet")
	
	
	
	d3.json(pat, function(error, topology) {
		console.log(topology);
		var featureCollection = topojson.feature(topology, topology['objects'][ob]);
		var bounds = d3.geo.bounds(featureCollection);
		console.log(bounds);
		var sc = 20000/(bounds[1][1]-bounds[0][1]);
		var ad = 0;
		var bd = 0;
		if(j=="india")
		{
			sc = 1000;
			ad = 10;
			bd = 1.5;
		}
		else if(j=="tamilnadu")
		{
			sc = 1200;
			ad = 10;
			bd = 1.5;
		}
		else if(j=="kerala")
		{
			sc = 5000;
			ad = 3;
			bd = 0;
		}
		else if(j=="andhrapradesh")
		{
			sc = 3500;
			ad = 3;
			bd = 0;
		}
		else if(j=="karnataka")
		{
			sc = 4000;
			ad = 3;
			bd = 0;
		}
		else if(j=="telangana")
		{
			sc = 5200;
			ad = 2;
			bd = 0;
		}
		else if(j=="maharashtra")
		{
			sc = 3500;
			ad = 3;
			bd = 0;
		}
		else if(j=="madhyapradesh")
		{
			sc = 3500;
			ad = 3;
			bd = 0;
		}
		else if(j=="odisha")
		{
			sc = 4500;
			ad = 2;
			bd = 0;
		}
		else if(j=="chhattisgarh")
		{
			sc = 4500;
			ad = 2;
			bd = 0;
		}
		else if(j=="westbengal")
		{
			sc = 4500;
			ad = 3;
			bd = 0;
		}
		else if(j=="gujarat")
		{
			sc = 4500;
			ad = 2.5;
			bd = 0;
		}
		else if(j=="rajasthan")
		{
			sc = 3500;
			ad = 3;
			bd = 0;
		}
		else if(j=="uttarpradesh")
		{
			sc = 4000;
			ad = 2.5;
			bd = 0;
		}
		else if(j=="haryana")
		{
			sc = 7000;
			ad = 1.5;
			bd = 0;
		}
		else if(j=="punjab")
		{
			sc = 7500;
			ad = 1.5;
			bd = 0;
		}
		else if(j=="himachalpradesh")
		{
			sc = 7500;
			ad = 1.5;
			bd = 0;
		}
		
		else if(j=="uttarakhand")
		{
			sc = 7500;
			ad = 1.5;
			bd = 0;
		}
		else if(j=="arunachalpradesh")
		{
			sc = 5000;
			ad = 2;
			bd = 0;
		}
		else if(j=="nagaland")
		{
			sc = 10000;
			ad = 1;
			bd = 0;
		}
		else if(j=="manipur")
		{
			sc = 10000;
			ad = 1;
			bd = 0;
		}
		else if(j=="mizoram")
		{
			sc = 10000;
			ad = 1.5;
			bd = 0;
		}
		else if(j=="tripura")
		{
			sc = 12000;
			ad = 1;
			bd = 0;
		}
		else if(j=="assam")
		{
			sc = 5000;
			ad = 2;
			bd = 0;
		}
		else if(j=="meghalaya")
		{
			sc = 7000;
			ad = 2;
			bd = 0;
		}
		else if(j=="bihar")
		{
			sc = 5000;
			ad = 2;
			bd = 0;
		}
		else if(j=="jharkhand")
		{
			sc = 6000;
			ad = 1.5;
			bd = 0;
		}
		else if(j=="ladakh")
		{
			sc = 3000;
			ad = 2.5;
			bd = 0;
		}
		else if(j=="sikkim")
		{
			sc = 15000;
			ad = 0.75;
			bd = 0;
		}
		console.log("scale :" + sc);
		var centerX = (bounds[0][0]+bounds[1][0])/2 + ad,
		centerY = (bounds[0][1]+bounds[1][1])/2 + bd;
		
		
		var same = null;
		var projection = d3.geo.mercator()
		.scale(sc)
		.center([centerX,centerY]);
		
		path.projection(projection);
		
		svg.selectAll("path")
		.data(featureCollection.features)
		.enter().append("path")
		.attr("d", path)
		.attr("class", "bar allCircles")
		.on('click', function(d){
			if(same === d)
			{
				same = null;
				var l = d['properties']['st_nm'];
				summa(l);
			}
			else
			{
					same = d;
					console.log(same);
					d3.selectAll('.allCircles').style('fill','#CCCCCC'); //fill all circles black
					d3.select(this).style("fill", "red");
			}
		})
		.on('mouseout', function(d){
			document.getElementById('name').innerHTML= "District/State"; 
			document.getElementById('count').innerHTML= 0; 
			document.getElementById('now').innerHTML= 0;
		})
		
		.on('mouseover', function(d){
			console.log(d);
			if(!d['properties']['district'])
			{
				var name = d['properties']['st_nm'];
				//console.log("here");
				
				//name = name.replace(/ /g,'').toLowerCase();
				//console.log(name);
				var confirmed =0;
				var now=0;
				for(k=0;k<a.length;k++)
				{
					//console.log(a[k]['state']);
					
					if(a[k]['state']==name)
					{//console.log(a[k]);
						for(i=0;i<a[k]['districtData'].length;i++)
						{			
							
							confirmed += a[k]['districtData'][i]['confirmed'];
							now += a[k]['districtData'][i]['delta']['confirmed'];
							
							//console.log(confirmed);
						}
					}
				}	
			}
			else
			{
				var name = d['properties']['district'];
				console.log(start);
				for(i=0;i<a[start]['districtData'].length;i++)
				{	
					if(a[start]['districtData'][i]['district'] == name)
					{		
						var confirmed = a[start]['districtData'][i]['confirmed'];
						var now = a[start]['districtData'][i]['delta']['confirmed']
						//console.log(confirmed);
					}
				}
			}
			if(!confirmed)
			{
				confirmed=0;
				now=0;
			}
			document.getElementById('name').innerHTML= name; 
			document.getElementById('count').innerHTML= confirmed; 
			document.getElementById('now').innerHTML= now; 
			
		});
	});
}


Http.onreadystatechange = (e) => {
	
	if (Http.readyState == 4 && Http.status == 200)
	{
		f = Http.responseText;
		var i =0;
		a = JSON.parse(f);
		console.log(a);
		var len = a.length;
		var state_len,total=0;
		for(i=0;i<len;i++)
		{
			labels[i] = a[i]['state'];
			state_len = a[i]['districtData'].length;
			total=0;
			for(j=0;j<state_len;j++)
			{
				total+= a[i]['districtData'][j]['confirmed']
			}
			data[i] = total;
		}
		draw_chart();
		get_state_details('india');
	}
	
};
Http.open("GET", url);
Http.send();
function draw_chart(){
	//Chart.defaults.global.defaultFontColor = "white";
	chart = new Chart(document.getElementById("bar-chart"), {
		type: 'bar',
		data: {
			labels: getLabels(),
			datasets: [
				{
					label: "People",
					backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
					data: getData()
				}
			]
		},
		options: {
			onClick: graphClickEvent,
			scales: {
				xAxes: [{ stacked: false ,autoSkip: false,gridLines: {
					display:false
				}}],
				yAxes: [{
					ticks: {
						beginAtZero:true
					},
					gridLines: {
						display:false
					},
					stacked: false
				}]
			},
			legend: { display: false },
			title: {
				display: true,
				text: 'Covid-19 Affected population in 2020'
			},
			
		}
	});
}
function summa(i){
	//console.log(array);
	var j=0;
	for(j=0;j<a.length;j++)
	{
		if(a[j]['state']==i)
		{
			start = j;
			break;
		}
	}
	
	
	i = i.replace(/ /g,'');
	i = i.toLowerCase();
	
	//console.log(labels[i]);
	//document.getElementById('State').innerHTML = labels[i]
	//document.getElementById('Confirmed').innerHTML = data[i]
	//console.log(data[i]);
	get_state_details(i);
}	
function graphClickEvent(event, array){
	//console.log(array);
	var i = array[0]['_view']['label'];
	start = array[0]['_index'];
	
	window.location = "#get_Map";
	i = i.replace(/ /g,'');
	i = i.toLowerCase();
	
	//console.log(labels[i]);
	//document.getElementById('State').innerHTML = labels[i]
	//document.getElementById('Confirmed').innerHTML = data[i]
	//console.log(data[i]);
	get_state_details(i);
}	

