const parent=React.createElement("div",{id:"parent"},React.createElement("h1",{},"Parent"),React.createElement("div",{id:"child"},React.createElement("h2",{},"Helloguys")));



const root=ReactDOM.createRoot(document.getElementById("root"));
root.render(parent);