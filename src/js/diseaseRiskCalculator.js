
const diseaseRiskCalculators = {
  pythium: (temperature, dissolvedOxygen, humidity) => {
    let risk = 0;

    // Risque lié à la température
   /* if (temperature > 30) {
        risk += 100; // Risque maximal
    } else if (temperature > 25) {
        risk += (temperature - 25) * 20; // Risque proportionnel
    } */

    if (2==2){
      risk=dissolvedOxygen
    } 
    // Risque lié à l'oxygène dissous
    /*if (dissolvedOxygen < 5) {
        risk += 50; // Risque important si faible oxygène
    } else {
        risk += (5 - dissolvedOxygen) * 10; // Risque proportionnel
    }*/

    // Risque lié à l'humidité
   /* if (humidity > 80) {
        risk += 50; // Risque élevé si humidité élevée
    } else if (humidity > 60) {
        risk += (humidity - 60) * 5; // Risque proportionnel
    }*/

    // Limiter le risque à 100
    return Math.min(risk, 100);
    //return Math.max(Math.min(risk, 100), 0);
},
    botrytis: (temperature, humidity) => {
      if (temperature < 10 || humidity < 70) return 0;
      if (temperature >= 10 && temperature <= 20 && humidity >= 70 && humidity <= 90) return 60;
      if (temperature > 20 && humidity > 90) return 80;
      else return 70;
    },
    fusarium: (temperature, humidity) => {
      if (temperature < 20 || humidity < 50) return 0;
      if (temperature >= 20 && temperature <= 30 && humidity >= 50 && humidity <= 70) return 40;
      if (temperature > 30 && humidity > 70) return 70;
      else return 90;
    },
    mildiou: (temperature, humidity) => {
      if (temperature < 15 || humidity < 70) return 0;
      if (temperature >= 15 && temperature <= 25 && humidity >= 70 && humidity <= 90) return 50;
      if (temperature > 25 && humidity > 90) return 85;
      else return 80;
    },
    oidium: (temperature, humidity) => {
      if (temperature < 18 || humidity < 40) return 0;
      if (temperature >= 18 && temperature <= 28 && humidity >= 40 && humidity <= 60) return 50;
      if (temperature > 28 && humidity > 60) return 70;
      else return 75;
    },
  };
  
  export default diseaseRiskCalculators;
  