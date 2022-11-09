import React from "react";
import "./app.scss" 
import { StocksLineChart } from "./line-chart-stocks/line-chart-stocks";
 
import { WeatherScatterPlot } from "./scatter-plot-weather/scatter-plot-weather";
import { Navigate, NavLink, Route, Routes } from "react-router-dom"; 
import { PopulationPiechart } from "./pie-chart-population/pie-chart-population";
import { BasicBarchart } from "./bar-chart-basic/bar-chart-basic";

export const App = () => {
    return ( 
        <>
          <div className="nav-links">
                <NavLink to="/scatter-plot" className={({ isActive }) => (isActive ? "nav-active-link" : "nav-link")}>
                    Weather Scatter Plot
                </NavLink>
                <NavLink to="/line-chart" className={({ isActive }) => (isActive ? "nav-active-link" : "nav-link")}>
                    Stock Line Chart
                </NavLink> 
                <NavLink to="/pie-chart" className={({ isActive }) => (isActive ? "nav-active-link" : "nav-link")}>
                    Population Pie Chart
                </NavLink> 
                <NavLink to="/basic-bar-chart" className={({ isActive }) => (isActive ? "nav-active-link" : "nav-link")}>
                    Basic Bar Chart
                </NavLink> 
          </div> 
          <div className="d3-app">   
                <Routes>
                    <Route path="/" element={<Navigate replace to="/scatter-plot" />} />
                    <Route path="/scatter-plot" element={<WeatherScatterPlot />} />
                    <Route path="/line-chart" element={<StocksLineChart />} />
                    <Route path="/pie-chart" element={<PopulationPiechart />} />
                    <Route path="/basic-bar-chart" element={<BasicBarchart />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
          </div>  
        </>
    )
}