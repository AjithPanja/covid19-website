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
	var width = 950,
    height = 500;
	var pat = "maps/"+j+".json";
	var ob = j+"_district";
	if(j=="india")
	{
		ob = j;
	}
	var path = d3.geo.path();
	
	
	var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);
	
	
	
	d3.json(pat, function(error, topology) {
		console.log(topology);
		var featureCollection = topojson.feature(topology, topology['objects'][ob]);
		var bounds = d3.geo.bounds(featureCollection);
		console.log(bounds);
		var sc = 25000/(bounds[1][1]-bounds[0][1]);
		console.log();
		
		var centerX = d3.sum(bounds, function(d) {return d[0];})/2,
		centerY = d3.sum(bounds, function(d) {return d[1];})/2 ;
		
		
		
		var projection = d3.geo.mercator()
		.scale(sc)
		.center([centerX, centerY]);
		
		path.projection(projection);
		
		svg.selectAll("path")
		.data(featureCollection.features)
		.enter().append("path")
		.attr("d", path)
		.on('click', function(d){
			var l = d['properties']['st_nm'];
			summa(l);
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