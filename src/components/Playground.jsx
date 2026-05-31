import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { FaCogs, FaChartLine, FaLeaf, FaHourglassHalf, FaThermometerHalf, FaWind, FaCloudRain, FaPercentage } from 'react-icons/fa';

const Playground = () => {
    const [activeTab, setActiveTab] = useState('maintenance');

    // 1. Predictive Maintenance State
    const [operatingHours, setOperatingHours] = useState(2500);
    const [vibration, setVibration] = useState(2.8);
    const [temperature, setTemperature] = useState(55);

    // 2. Crop Price State
    const [rainfall, setRainfall] = useState(200);
    const [cropTemp, setCropTemp] = useState(26);
    const [inflation, setInflation] = useState(5.2);

    // Calculated state for Maintenance
    const [maintHealth, setMaintHealth] = useState(100);
    const [maintRul, setMaintRul] = useState(72);
    const [maintChartData, setMaintChartData] = useState([]);

    // Calculated state for Crop Price
    const [cropPrice, setCropPrice] = useState(65);
    const [cropTrend, setCropTrend] = useState('Stable');
    const [cropChartData, setCropChartData] = useState([]);

    // Recalculate Maintenance Values
    useEffect(() => {
        // Base wear from hours (up to 35% reduction at 10,000 hrs)
        const wearHours = (operatingHours / 10000) * 35;
        // Thermal wear (increases above 60°C, up to 35% reduction at 120°C)
        const wearTemp = Math.max(0, (temperature - 50) / 70) * 35;
        // Mechanical wear from vibration (increases above 2.0 mm/s, up to 40% reduction at 15.0 mm/s)
        const wearVib = Math.max(0, (vibration - 1.5) / 13.5) * 40;

        const calculatedHealth = Math.max(0, Math.min(100, Math.round(100 - (wearHours + wearTemp + wearVib))));
        setMaintHealth(calculatedHealth);

        // Calculate RUL (ranges from 0 to 72 hours)
        // High vibration accelerates degradation factor
        const degradationSpeed = Math.max(0.5, vibration / 2.5) * Math.max(0.8, temperature / 60);
        const calculatedRul = Math.max(0, Math.min(72, Number(((calculatedHealth / 100) * 72 * (1 / degradationSpeed)).toFixed(1))));
        setMaintRul(calculatedRul);

        // Generate Forecast Decay curve for RUL (7 points over time)
        const points = [];
        const steps = 7; // intervals
        for (let i = 0; i < steps; i++) {
            const timeStep = (i / (steps - 1)) * 72; // hours in advance
            // Exponential wear curve
            const decay = Math.exp(-((degradationSpeed * 0.015) * (i / (steps - 1) * 3)));
            const stepHealth = Math.max(0, Math.round(calculatedHealth * decay));
            points.push({ x: timeStep, y: stepHealth });
        }
        setMaintChartData(points);
    }, [operatingHours, vibration, temperature]);

    // Recalculate Crop Price Values
    useEffect(() => {
        // Base stable price of a standard crop basket (e.g., ₹50 / kg)
        const basePrice = 45;

        // Optimal Rainfall is 200mm. Drought or extreme flood raises prices.
        const rainDelta = Math.abs(rainfall - 200);
        const rainImpact = rainDelta < 50 ? 0 : Math.pow((rainDelta - 50) / 150, 1.8) * 45;

        // Optimal Temperature is 25°C. Heatwaves or cold snaps raise prices.
        const tempDelta = Math.abs(cropTemp - 25);
        const tempImpact = tempDelta < 4 ? 0 : Math.pow((tempDelta - 4) / 15, 1.5) * 35;

        // Inflation multiplier
        const inflationMultiplier = 1 + (inflation / 100);

        // Calculate combined raw price
        const calculatedPrice = Math.max(25, Math.min(280, Math.round((basePrice + rainImpact + tempImpact) * inflationMultiplier)));
        setCropPrice(calculatedPrice);

        // Determine Market Trend
        const volatility = rainImpact + tempImpact;
        let trend = 'Stable';
        if (volatility > 45) {
            trend = 'Highly Volatile (Scarcity)';
        } else if (volatility > 20) {
            trend = 'Bullish (Rising Demand)';
        } else if (rainfall > 320 || cropTemp > 38) {
            trend = 'Extreme Scarcity Risk';
        } else if (rainfall >= 180 && rainfall <= 230 && cropTemp >= 22 && cropTemp <= 27) {
            trend = 'Stable (High Yield / Abundance)';
        }
        setCropTrend(trend);

        // Generate Price Trend over next 6 months with realistic sinusoidal seasoning
        const points = [];
        const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
        for (let i = 0; i < 6; i++) {
            // Seasonal multiplier (e.g. price rises in winter months, fluctuating with rainfall setting)
            const seasonPhase = Math.sin((i / 5) * Math.PI + (rainfall / 150));
            const seasonalFluc = seasonPhase * (12 + (rainImpact * 0.15));
            const monthPrice = Math.max(15, Math.round(calculatedPrice + seasonalFluc + (i * (inflation / 4))));
            points.push({ name: months[i], y: monthPrice });
        }
        setCropChartData(points);
    }, [rainfall, cropTemp, inflation]);

    // Helpers to scale values for SVG coordinates
    // Charts viewport: viewBox="0 0 500 240"
    const getMaintenanceSvgPath = () => {
        if (maintChartData.length === 0) return '';
        const paddingLeft = 40;
        const paddingRight = 20;
        const width = 500 - paddingLeft - paddingRight;
        const height = 180;
        const paddingTop = 20;

        return maintChartData.map((d, i) => {
            const x = paddingLeft + (i / (maintChartData.length - 1)) * width;
            // invert y (100% health -> top, 0% -> bottom)
            const y = paddingTop + height - (d.y / 100) * height;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    const getCropSvgPath = () => {
        if (cropChartData.length === 0) return '';
        const paddingLeft = 40;
        const paddingRight = 20;
        const width = 500 - paddingLeft - paddingRight;
        const height = 180;
        const paddingTop = 20;
        
        // Find max price for dynamic Y scaling
        const maxVal = Math.max(...cropChartData.map(d => d.y), 100) * 1.15;

        return cropChartData.map((d, i) => {
            const x = paddingLeft + (i / (cropChartData.length - 1)) * width;
            const y = paddingTop + height - (d.y / maxVal) * height;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    // Color helpers for maintenance health
    const getHealthColorClass = (health) => {
        if (health >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
        if (health >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
        return 'text-rose-500 bg-rose-500/10 border-rose-500/30 animate-pulse';
    };

    return (
        <section id="playground" className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300 relative overflow-hidden">
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div variants={fadeInUp} className="inline-block px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4 shadow-sm">
                        <span className="text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 flex items-center gap-2">
                            <FaCogs /> ML Models Simulator
                        </span>
                    </motion.div>
                    
                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
                        Interactive ML Sandbox
                    </motion.h2>
                    
                    <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-slate-400">
                        Adjust parameters to interact with real-time simulations of custom-trained LSTM models in prediction scenarios.
                    </motion.p>
                </motion.div>

                {/* Glassmorphic Tabs Selector */}
                <div className="flex justify-center mb-12">
                    <div className="p-1.5 bg-slate-200/50 dark:bg-slate-800/80 backdrop-blur-md rounded-full border border-slate-300/30 dark:border-slate-700/50 flex gap-2">
                        <button
                            onClick={() => setActiveTab('maintenance')}
                            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                                activeTab === 'maintenance'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                            }`}
                        >
                            <FaCogs size={16} /> Predictive Maintenance
                        </button>
                        <button
                            onClick={() => setActiveTab('prices')}
                            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                                activeTab === 'prices'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                            }`}
                        >
                            <FaLeaf size={16} /> Crop Price Predictor
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'maintenance' ? (
                        <motion.div
                            key="maintenance"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                        >
                            {/* Inputs Panel (Left) */}
                            <div className="lg:col-span-5 p-8 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
                                        <FaCogs className="text-primary" /> Parameters Setup
                                    </h3>

                                    {/* Sliders Grid */}
                                    <div className="space-y-8">
                                        {/* Slider 1: Hours */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <FaHourglassHalf className="text-primary" /> Operating Hours
                                                </label>
                                                <span className="font-bold text-primary">{operatingHours.toLocaleString()} hrs</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="100"
                                                max="10000"
                                                step="100"
                                                value={operatingHours}
                                                onChange={(e) => setOperatingHours(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>100h</span>
                                                <span>Optimal Wear Range (≤2,000h)</span>
                                                <span>10,000h</span>
                                            </div>
                                        </div>

                                        {/* Slider 2: Vibration */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <FaWind className="text-primary" /> Vibration Intensity
                                                </label>
                                                <span className="font-bold text-primary">{vibration} mm/s</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1.0"
                                                max="15.0"
                                                step="0.1"
                                                value={vibration}
                                                onChange={(e) => setVibration(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>1.0 mm/s</span>
                                                <span>Normal Limit (≤3.0)</span>
                                                <span>15.0 mm/s</span>
                                            </div>
                                        </div>

                                        {/* Slider 3: Temperature */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <FaThermometerHalf className="text-primary" /> Machine Temperature
                                                </label>
                                                <span className="font-bold text-primary">{temperature}°C</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="30"
                                                max="120"
                                                step="1"
                                                value={temperature}
                                                onChange={(e) => setTemperature(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>30°C</span>
                                                <span>Standard (40-65°C)</span>
                                                <span>120°C</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    <strong>LSTM Predictor Logic:</strong> The underlying algorithm mimics historical model weights, analyzing operating cycles, high temperature friction, and mechanical fatigue.
                                </div>
                            </div>

                            {/* Outputs & Charts Dashboard (Right) */}
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                {/* Insights Row */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Insight Card 1 */}
                                    <div className="p-6 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl flex flex-col justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Equipment Health</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">{maintHealth}</span>
                                            <span className="text-lg font-bold text-slate-400">%</span>
                                        </div>
                                        <div className={`mt-4 px-3 py-1.5 text-xs font-bold rounded-lg border text-center w-full ${getHealthColorClass(maintHealth)}`}>
                                            {maintHealth >= 80 ? 'Optimal Status' : maintHealth >= 50 ? 'Maintenance Scheduled' : 'CRITICAL FAILURE RISK'}
                                        </div>
                                    </div>

                                    {/* Insight Card 2 */}
                                    <div className="p-6 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl flex flex-col justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Time-to-Failure</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl sm:text-5xl font-black text-primary">{maintRul}</span>
                                            <span className="text-sm font-bold text-slate-400">hours</span>
                                        </div>
                                        <div className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400 text-center">
                                            LSTM Horizon: 72 hrs max
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Chart Container */}
                                <div className="p-8 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl flex-grow flex flex-col justify-between min-h-[300px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <FaChartLine className="text-primary" /> Remaining Useful Life Trajectory
                                        </h4>
                                        <span className="text-xs font-medium text-slate-400">Values updated in real time</span>
                                    </div>

                                    {/* Custom SVG Line Chart */}
                                    <div className="relative w-full h-[180px] sm:h-[220px]">
                                        <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                                                </linearGradient>
                                                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#6366f1" />
                                                    <stop offset="50%" stopColor="#a855f7" />
                                                    <stop offset="100%" stopColor="#4f46e5" />
                                                </linearGradient>
                                            </defs>

                                            {/* Horizontal Gridlines */}
                                            <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                            <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                            <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                            <line x1="40" y1="200" x2="480" y2="200" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />

                                            {/* Y-Axis Labels */}
                                            <text x="30" y="25" textAnchor="end" className="text-[10px] font-semibold fill-slate-400">100%</text>
                                            <text x="30" y="85" textAnchor="end" className="text-[10px] font-semibold fill-slate-400">70%</text>
                                            <text x="30" y="145" textAnchor="end" className="text-[10px] font-semibold fill-slate-400">40%</text>
                                            <text x="30" y="205" textAnchor="end" className="text-[10px] font-semibold fill-slate-400">0%</text>

                                            {/* Chart Line Path */}
                                            <path
                                                d={getMaintenanceSvgPath()}
                                                fill="none"
                                                stroke="url(#lineGrad)"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-all duration-300"
                                            />

                                            {/* Shaded Area underneath chart */}
                                            <path
                                                d={`${getMaintenanceSvgPath()} L 480 200 L 40 200 Z`}
                                                fill="url(#chartGradient)"
                                                className="transition-all duration-300"
                                            />

                                            {/* Animated Dots on steps */}
                                            {maintChartData.map((d, i) => {
                                                const x = 40 + (i / (maintChartData.length - 1)) * (500 - 40 - 20);
                                                const y = 20 + 180 - (d.y / 100) * 180;
                                                return (
                                                    <g key={i} className="transition-all duration-300">
                                                        <circle cx={x} cy={y} r="6" fill="#fff" stroke="#6366f1" strokeWidth="2.5" />
                                                        {i === 0 && (
                                                            <circle cx={x} cy={y} r="12" fill="#6366f1" opacity="0.2" className="animate-ping" />
                                                        )}
                                                    </g>
                                                );
                                            })}

                                            {/* X-Axis Labels */}
                                            <text x="40" y="222" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400">Now</text>
                                            <text x="187" y="222" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400">24h</text>
                                            <text x="333" y="222" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400">48h</text>
                                            <text x="480" y="222" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400">72h</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="prices"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                        >
                            {/* Inputs Panel (Left) */}
                            <div className="lg:col-span-5 p-8 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
                                        <FaLeaf className="text-primary" /> Crop Climate Metrics
                                    </h3>

                                    {/* Sliders Grid */}
                                    <div className="space-y-8">
                                        {/* Slider 1: Rainfall */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <FaCloudRain className="text-primary" /> Monthly Rainfall
                                                </label>
                                                <span className="font-bold text-primary">{rainfall} mm</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="50"
                                                max="400"
                                                step="5"
                                                value={rainfall}
                                                onChange={(e) => setRainfall(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>50 mm (Drought)</span>
                                                <span>Optimal (200mm)</span>
                                                <span>400 mm (Flood)</span>
                                            </div>
                                        </div>

                                        {/* Slider 2: Temperature */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <FaThermometerHalf className="text-primary" /> Climate Temp
                                                </label>
                                                <span className="font-bold text-primary">{cropTemp}°C</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="15"
                                                max="45"
                                                step="1"
                                                value={cropTemp}
                                                onChange={(e) => setCropTemp(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>15°C</span>
                                                <span>Optimal Yield (22-26°C)</span>
                                                <span>45°C</span>
                                            </div>
                                        </div>

                                        {/* Slider 3: Inflation */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <FaPercentage className="text-primary" /> Inflation Rate
                                                </label>
                                                <span className="font-bold text-primary">{inflation}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.0"
                                                max="15.0"
                                                step="0.1"
                                                value={inflation}
                                                onChange={(e) => setInflation(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>0%</span>
                                                <span>Stable Range (3-5%)</span>
                                                <span>15% (Hyperinflation)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    <strong>Predictor Logic:</strong> Pricing time-series models integrate seasonal indexing, price curves for yield deficit (non-optimal temperatures/droughts), and cumulative inflation compounding.
                                </div>
                            </div>

                            {/* Outputs & Charts Dashboard (Right) */}
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                {/* Insights Row */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Price Insight Card */}
                                    <div className="p-6 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl flex flex-col justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Simulated Price / kg</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-bold text-slate-400">₹</span>
                                            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">{cropPrice}</span>
                                        </div>
                                        <div className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 rounded-lg p-2 text-center">
                                            Weighted Yield Deficit Index
                                        </div>
                                    </div>

                                    {/* Market Trend Insight Card */}
                                    <div className="p-6 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl flex flex-col justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Predictive Market Trend</span>
                                        <span className="text-lg font-black text-primary leading-tight block truncate mt-2 mb-4">
                                            {cropTrend.split(' ')[0]}
                                        </span>
                                        <div className="text-xs text-slate-400 font-semibold truncate leading-none">
                                            {cropTrend.includes('(') ? cropTrend.split('(')[1].replace(')', '') : 'Balanced Supply'}
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Chart Container */}
                                <div className="p-8 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl flex-grow flex flex-col justify-between min-h-[300px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <FaChartLine className="text-primary" /> 6-Month Projected Crop Price Curve
                                        </h4>
                                        <span className="text-xs font-medium text-slate-400">Recalculates instantly</span>
                                    </div>

                                    {/* Custom SVG Line Chart */}
                                    <div className="relative w-full h-[180px] sm:h-[220px]">
                                        <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="cropChartGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                                </linearGradient>
                                                <linearGradient id="cropLineGrad" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#10b981" />
                                                    <stop offset="50%" stopColor="#3b82f6" />
                                                    <stop offset="100%" stopColor="#6366f1" />
                                                </linearGradient>
                                            </defs>

                                            {/* Horizontal Gridlines */}
                                            <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                            <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                            <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                            <line x1="40" y1="200" x2="480" y2="200" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />

                                            {/* Dynamic Y-Axis Labels based on max crop value */}
                                            <text x="30" y="25" textAnchor="end" className="text-[10px] font-semibold fill-slate-400">
                                                ₹{Math.max(100, Math.round(cropPrice * 1.35))}
                                            </text>
                                            <text x="30" y="85" textAnchor="end" className="text-[10px] font-semibold fill-slate-400">
                                                ₹{Math.max(65, Math.round(cropPrice * 0.9))}
                                            </text>
                                            <text x="30" y="145" textAnchor="end" className="text-[10px] font-semibold fill-slate-400">
                                                ₹{Math.max(35, Math.round(cropPrice * 0.45))}
                                            </text>
                                            <text x="30" y="205" textAnchor="end" className="text-[10px] font-semibold fill-slate-400">₹0</text>

                                            {/* Chart Line Path */}
                                            <path
                                                d={getCropSvgPath()}
                                                fill="none"
                                                stroke="url(#cropLineGrad)"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-all duration-300"
                                            />

                                            {/* Shaded Area underneath chart */}
                                            <path
                                                d={`${getCropSvgPath()} L 480 200 L 40 200 Z`}
                                                fill="url(#cropChartGrad)"
                                                className="transition-all duration-300"
                                            />

                                            {/* Dynamic Nodes */}
                                            {cropChartData.map((d, i) => {
                                                const x = 40 + (i / (cropChartData.length - 1)) * (500 - 40 - 20);
                                                const maxVal = Math.max(...cropChartData.map(d => d.y), 100) * 1.15;
                                                const y = 20 + 180 - (d.y / maxVal) * 180;
                                                return (
                                                    <g key={i} className="transition-all duration-300">
                                                        <circle cx={x} cy={y} r="6" fill="#fff" stroke="#10b981" strokeWidth="2.5" />
                                                        {i === 0 && (
                                                            <circle cx={x} cy={y} r="12" fill="#10b981" opacity="0.2" className="animate-ping" />
                                                        )}
                                                    </g>
                                                );
                                            })}

                                            {/* X-Axis Labels */}
                                            {cropChartData.map((d, i) => {
                                                const x = 40 + (i / (cropChartData.length - 1)) * (500 - 40 - 20);
                                                return (
                                                    <text key={i} x={x} y="222" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400">
                                                        {d.name}
                                                    </text>
                                                );
                                            })}
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Playground;
