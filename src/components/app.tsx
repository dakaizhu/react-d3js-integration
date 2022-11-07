import React from "react";
import "./app.scss" 
import { StocksLineChart } from "./line-chart-stocks/line-chart-stocks";
 
import { WeatherScatterPlot } from "./scatter-plot-weather/scatter-plot-weather";
import { Navigate, NavLink, Route, Routes } from "react-router-dom"; 

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
          </div> 
          <div className="d3-app">   
                <Routes>
                    <Route path="/" element={<Navigate replace to="/scatter-plot" />} />
                    <Route path="/scatter-plot" element={<WeatherScatterPlot />} />
                    <Route path="/line-chart" element={<StocksLineChart />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
          </div>  
        </>
    )
}