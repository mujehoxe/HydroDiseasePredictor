const recommendations = {
  pythium: {
    fr: [
      { range: [0, 50], action: null },
      { range: [50, 70], action: ["Faire un tour et éliminer les plants malades"] },
      { range: [70, 101], action: ["Faire un tour et éliminer les plants malades"] },
    ],
    ar: [
      { range: [0, 50], action: null },
      { range: [50, 70], action: ["إزالة النباتات المصابة."] },
      { range: [70, 101], action: ["تفقد الدفيئة وإزالة النباتات المصابة وتطبيق علاج علاجي."] },
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
        ar: "أكسجة المحلول المغذي حتى يصل إلى 6 جزء في المليون (ملغ/لتر) على الأقل."
      }
    }
  },
  botrytis: {
    fr: [
      { range: [0, 40], action: null },
      { range: [40, 70], action: ["Faire un tour et éliminer les plants malades"] },
      { range: [70, 101], action: ["Faire un tour et éliminer les plants malades"] },
    ],
    ar: [
      { range: [0, 40], action: null },
      { range: [40, 70], action: ["مراقبة النباتات وتقليل الرطوبة"] },
      { range: [70, 101], action: ["إزالة النباتات المصابة", "تطبيق مبيد فطري مناسب"] },
    ],
    additionalConditions: {
      humidity: {
        threshold: 92,
        fr: "Aérer la serre",
        ar: "تهوية الدفيئة"
      }
    }
  },
  xanthomonas: {
    fr: [
      { range: [0, 60], action: null },
      { range: [60, 80], action: ["Désinfecter periodiquement le système"] },
      { range: [80, 101], action: ["En cas de présence de plantes malades, desinfecter tout le système et détruire les plantes atteintes"] },
    ],
    ar: [
      { range: [0, 60], action: null },
      { range: [60, 80], action: ["تطهير النظام بشكل دوري"] },
      { range: [80, 101], action: ["تطهير النظام بالكامل", "إزالة النباتات المصابة"] },
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
      { range: [30, 60], action: ["Assurer un bon éclairage de la ferme"] },
      { range: [60, 101], action: ["Faire un tour et éliminer les plants malades", "Assurer un bon éclairage de la ferme"] },
    ],
    ar: [
      { range: [0, 30], action: null },
      { range: [30, 60], action: ["ضمان إضاءة جيدة"]  },
      { range: [60, 101], action: ["إزالة النباتات المصابة", "ضمان إضاءة جيدة"] },
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
      { range: [40, 70], action: ["Éviter un excès d'azote dans la fertilisation", "Assurer un bon éclairage de la ferme"] },
      { range: [70, 101], action: ["Faire un tour et éliminer les plants malades", "Éviter un excès d'azote dans la fertilisation", "Assurer un bon éclairage"] },
    ],
    ar: [
      { range: [0, 40], action: null },
      { range: [40, 70], action: ["تجنب الإفراط في استخدام النيتروجين في التسميد", "ضمان إضاءة جيدة"] },
      { range: [70, 101], action: ["إزالة النباتات المصابة", "تجنب الإفراط في استخدام النيتروجين في التسميد", "ضمان إضاءة جيدة"] },
    ],
  },
};

export default recommendations;