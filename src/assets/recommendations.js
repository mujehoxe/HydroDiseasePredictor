/**
 * @typedef {Object} Recommendation
 * @property {[number, number]} range - Risk range [min, max]
 * @property {string|null} action - Recommended action or null
 */

/**
 * @typedef {Object} AdditionalCondition
 * @property {number} threshold - Threshold value
 * @property {string} fr - French recommendation
 * @property {string} ar - Arabic recommendation
 * @property {string} [comparison] - Comparison type ('above' or 'below')
 */

/**
 * @typedef {Object} DiseaseRecommendations
 * @property {Recommendation[]} fr - French recommendations
 * @property {Recommendation[]} ar - Arabic recommendations
 * @property {Object} [additionalConditions] - Additional environmental conditions
 * @property {AdditionalCondition} [additionalConditions.humidity]
 * @property {AdditionalCondition} [additionalConditions.dissolvedOxygen]
 */

/** @type {Object.<string, DiseaseRecommendations>} */

const recommendations = {
  pythium: {
    fr: [
      { range: [0, 50], action: null },
      { range: [50, 70], action: "Appliquer un traitement préventif." },
      { range: [70, 101], action: "Appliquer un traitement curatif." },
    ],
    ar: [
      { range: [0, 50], action: null },
      { range: [50, 70], action: "قم بتطبيق علاج وقائي." },
      { range: [70, 101], action: "قم بتطبيق علاج علاجي." },
    ],
    additionalConditions: {
      humidity: {
        threshold: 85,
        fr: "Aérer la serre",
        ar: "تهوية الدفيئة"
      },
      dissolvedOxygen: {
        threshold: 6,
        comparison: "below",
        fr: "Oxygener la solution nutritive jusqu'à atteindre 6 ppm (mg/L) minimum",
        ar: "أكسج المحلول المغذي"
      }
    }
  },
  botrytis: {
    fr: [
      { range: [0, 40], action: null },
      { range: [40, 70], action: "Surveiller les plantes et réduire l'humidité." },
      { range: [70, 101], action: "Appliquer un fongicide spécifique." },
    ],
    ar: [
      { range: [0, 40], action: null },
      { range: [40, 70], action: "راقب النباتات وقلل الرطوبة." },
      { range: [70, 101], action: "قم بتطبيق مبيد فطري محدد." },
    ],
    additionalConditions: {
      humidity: {
        threshold: 85,
        fr: "Aérer la serre",
        ar: "تهوية الدفيئة"
      }
    }
  },
  xanthomonas: {
    fr: [
      { range: [0, 60], action: null },
      { range: [60, 80], action: "Renforcer la ventilation et surveiller." },
      { range: [80, 101], action: "Utiliser un traitement antifongique." },
    ],
    ar: [
      { range: [0, 60], action: null },
      { range: [60, 80], action: "عزز التهوية وراقب." },
      { range: [80, 101], action: "استخدم علاج مضاد للفطريات." },
    ],
    additionalConditions: {
      humidity: {
        threshold: 85,
        fr: "Aérer la serre",
        ar: "تهوية الدفيئة"
      }
    }
  },
  mildiou: {
    fr: [
      { range: [0, 30], action: null },
      { range: [30, 60], action: "Appliquer un traitement préventif léger." },
      { range: [60, 101], action: "Appliquer un traitement curatif." },
    ],
    ar: [
      { range: [0, 30], action: null },
      { range: [30, 60], action: "قم بتطبيق علاج وقائي خفيف." },
      { range: [60, 101], action: "قم بتطبيق علاج علاجي." },
    ],
    additionalConditions: {
      humidity: {
        threshold: 85,
        fr: "Aérer la serre",
        ar: "تهوية الدفيئة"
      }
    }
  },
  oidium: {
    fr: [
      { range: [0, 40], action: null },
      { range: [40, 70], action: "Utiliser un traitement préventif." },
      { range: [70, 101], action: "Appliquer un traitement curatif." },
    ],
    ar: [
      { range: [0, 40], action: null },
      { range: [40, 70], action: "استخدم علاجًا وقائيًا." },
      { range: [70, 101], action: "قم بتطبيق علاج علاجي." },
    ],
    // No additionalConditions for oidium as per requirements
  },
};

export default recommendations;