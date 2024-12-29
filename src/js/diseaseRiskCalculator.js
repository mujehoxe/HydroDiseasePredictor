// Risk calculation formulas for each disease
const calculatePythiumRisk = (temperature, humidity) => {
    if (temperature < 15 || humidity < 60) return 0;
    if (temperature >= 15 && temperature <= 25 && humidity >= 60 && humidity <= 80) return 50;
    if (temperature > 25 && humidity > 80) return 90;
    return 20;
  };
  
  const calculateBotrytisRisk = (temperature, humidity) => {
    if (temperature < 10 || humidity < 70) return 0;
    if (temperature >= 10 && temperature <= 20 && humidity >= 70 && humidity <= 90) return 60;
    if (temperature > 20 && humidity > 90) return 80;
    return 30;
  };
  
  const calculateFusariumRisk = (temperature, humidity) => {
    if (temperature < 20 || humidity < 50) return 0;
    if (temperature >= 20 && temperature <= 30 && humidity >= 50 && humidity <= 70) return 40;
    if (temperature > 30 && humidity > 70) return 70;
    return 10;
  };
  
  const calculateMildiouRisk = (temperature, humidity) => {
    if (temperature < 15 || humidity < 70) return 0;
    if (temperature >= 15 && temperature <= 25 && humidity >= 70 && humidity <= 90) return 50;
    if (temperature > 25 && humidity > 90) return 85;
    return 20;
  };
  
  const calculateOidiumRisk = (temperature, humidity) => {
    if (temperature < 18 || humidity < 40) return 0;
    if (temperature >= 18 && temperature <= 28 && humidity >= 40 && humidity <= 60) return 50;
    if (temperature > 28 && humidity > 60) return 70;
    return 25;
  };
  
  export {
    calculatePythiumRisk,
    calculateBotrytisRisk,
    calculateFusariumRisk,
    calculateMildiouRisk,
    calculateOidiumRisk,
  };
  