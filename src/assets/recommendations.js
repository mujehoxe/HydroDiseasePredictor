const recommendations = {
    pythium: {
      fr: [
        { range: [0, 50], action: null },
        { range: [50, 70], action: "Appliquer un traitement préventif." },
        { range: [70, 100], action: "Appliquer un traitement curatif." },
      ],
      ar: [
        { range: [0, 50], action: null },
        { range: [50, 70], action: "قم بتطبيق علاج وقائي." },
        { range: [70, 100], action: "قم بتطبيق علاج علاجي." },
      ],
    },
    botrytis: {
      fr: [
        { range: [0, 40], action: null },
        { range: [40, 70], action: "Surveiller les plantes et réduire l'humidité." },
        { range: [70, 100], action: "Appliquer un fongicide spécifique." },
      ],
      ar: [
        { range: [0, 40], action: null },
        { range: [40, 70], action: "راقب النباتات وقلل الرطوبة." },
        { range: [70, 100], action: "قم بتطبيق مبيد فطري محدد." },
      ],
    },
    xanthomonas: {
      fr: [
        { range: [0, 60], action: null },
        { range: [60, 80], action: "Renforcer la ventilation et surveiller." },
        { range: [80, 100], action: "Utiliser un traitement antifongique." },
      ],
      ar: [
        { range: [0, 60], action: null },
        { range: [60, 80], action: "عزز التهوية وراقب." },
        { range: [80, 100], action: "استخدم علاج مضاد للفطريات." },
      ],
    },
    mildiou: {
      fr: [
        { range: [0, 30], action: null },
        { range: [30, 60], action: "Appliquer un traitement préventif léger." },
        { range: [60, 100], action: "Appliquer un traitement curatif." },
      ],
      ar: [
        { range: [0, 30], action: null },
        { range: [30, 60], action: "قم بتطبيق علاج وقائي خفيف." },
        { range: [60, 100], action: "قم بتطبيق علاج علاجي." },
      ],
    },
    oidium: {
      fr: [
        { range: [0, 40], action: null },
        { range: [40, 70], action: "Utiliser un traitement préventif." },
        { range: [70, 100], action: "Appliquer un traitement curatif." },
      ],
      ar: [
        { range: [0, 40], action: null },
        { range: [40, 70], action: "استخدم علاجًا وقائيًا." },
        { range: [70, 100], action: "قم بتطبيق علاج علاجي." },
      ],
    },
  };
  
  export default recommendations;
  