// Translation keys for the Hydro Disease Predictor application
// All text content should be centralized here for better maintainability

export const translations = {
  fr: {
    // Authentication
    signIn: "Se connecter",
    signUp: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    enterEmail: "Entrez votre adresse e-mail",
    enterPassword: "Entrez votre mot de passe",
    signingIn: "Connexion...",
    signingUp: "Inscription...",
    signInSuccess: "Connexion réussie",
    signUpSuccess: "Inscription réussie",
    loginError: "Erreur de connexion",
    generalError: "Une erreur s'est produite",
    logout: "Se déconnecter",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    
    // Navigation & Layout
    dashboard: "Tableau de bord",
    yourFarms: "Vos fermes",
    addFarm: "Ajouter une ferme",
    userManagement: "Gestion des utilisateurs",
    preferences: "Préférences",
    close: "Fermer",
    cancel: "Annuler",
    save: "Enregistrer",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    update: "Mettre à jour",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    
    // Farm Management
    farmName: "Nom de la ferme",
    farmDescription: "Description (optionnel)",
    farmLocation: "Ville/Localisation",
    selectCity: "Sélectionnez une ville",
    enterFarmName: "Entrez le nom de votre ferme",
    farmAdded: "Ferme ajoutée avec succès",
    farmUpdated: "Ferme mise à jour avec succès",
    farmDeleted: "Ferme supprimée avec succès",
    deleteFarmConfirm: "Êtes-vous sûr de vouloir supprimer cette ferme ?\nCette action est irréversible.",
    noFarmsAvailable: "Aucune ferme disponible",
    failedToFetchFarms: "Échec de la récupération des fermes.",
    errorOccurred: "Une erreur s'est produite.",
    newFarm: "Nouvelle ferme",
    farmInfo: "Informations de la ferme",
    fillFarmInfo: "Remplissez les informations ci-dessous pour votre ferme.",
    
    // User Management
    users: "Utilisateurs",
    manageUserAccounts: "Gérez les comptes utilisateurs du système",
    addUser: "Ajouter un utilisateur",
    userName: "Nom",
    userEmail: "Email",
    userPassword: "Mot de passe",
    userRole: "Rôle",
    selectRole: "Sélectionner le rôle",
    farmer: "Fermier",
    administrator: "Administrateur",
    admin: "Admin",
    user: "Utilisateur",
    actions: "Actions",
    searchUsers: "Rechercher des utilisateurs...",
    usersList: "Liste des utilisateurs",
    userAdded: "Utilisateur ajouté avec succès",
    userDeleted: "Utilisateur supprimé avec succès",
    deleteUserConfirm: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
    allFieldsRequired: "Tous les champs sont obligatoires",
    noUsersFound: "Aucun utilisateur trouvé",
    noUsersAvailable: "Aucun utilisateur disponible",
    failedToAddUser: "Échec de l'ajout de l'utilisateur",
    failedToDeleteUser: "Échec de la suppression de l'utilisateur",
    
    // Weather & Environment
    currentTemperature: "Température actuelle",
    waterTemperature: "Température de l'eau",
    ambientHumidity: "Humidité ambiante",
    electricalConductivity: "EC",
    outdoorMode: "En plein champs",
    greenhouseMode: "Sous serre",
    
    // Diseases & Recommendations
    diseases: "Maladies",
    risk: "Risque",
    recommendations: "Recommandations",
    noRecommendations: "Pas de recommandations pour le moment",
    noRecommendationsAvailable: "Pas de recommandations disponibles pour l'instant.",
    additionalRecommendations: "recommandations supplémentaires",
    diseaseInfo: "Informations sur la maladie",
    
    // Dashboard
    manageFarms: "Gérez vos fermes et consultez les recommandations basées sur les conditions météorologiques",
    viewAll: "Voir toutes",
    
    // Connection & Server Errors
    connectionError: "Erreur de connexion: Le serveur backend n'est pas accessible. Veuillez vérifier que le serveur backend fonctionne sur le port 8080.",
    serverNotAvailable: "Erreur: Le serveur backend n'est pas disponible. Veuillez démarrer le serveur backend sur le port 8080.",
    connectionErrorServer: "Erreur de connexion au serveur.",
    
    // Language
    languageName: "العربية",
    
    // Validation Messages
    passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    invalidEmail: "Veuillez saisir un email valide",
    nameRequired: "Le nom est requis",
    emailRequired: "L'email est requis",
    passwordRequired: "Le mot de passe est requis",
  },
  
  ar: {
    // Authentication
    signIn: "تسجيل الدخول",
    signUp: "التسجيل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    fullName: "الاسم الكامل",
    enterEmail: "أدخل بريدك الإلكتروني",
    enterPassword: "أدخل كلمة المرور",
    signingIn: "جار تسجيل الدخول...",
    signingUp: "جار التسجيل...",
    signInSuccess: "تم تسجيل الدخول بنجاح",
    signUpSuccess: "تم التسجيل بنجاح",
    loginError: "خطأ في تسجيل الدخول",
    generalError: "حدث خطأ",
    logout: "تسجيل الخروج",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    
    // Navigation & Layout
    dashboard: "لوحة التحكم",
    yourFarms: "مزارعكم",
    addFarm: "إضافة مزرعة",
    userManagement: "إدارة المستخدمين",
    preferences: "التفضيلات",
    close: "غلق",
    cancel: "إلغاء",
    save: "حفظ",
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    update: "تحديث",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    
    // Farm Management
    farmName: "اسم المزرعة",
    farmDescription: "الوصف (اختياري)",
    farmLocation: "المدينة/الموقع",
    selectCity: "اختر مدينة",
    enterFarmName: "أدخل اسم مزرعتك",
    farmAdded: "تم إضافة المزرعة بنجاح",
    farmUpdated: "تم تحديث المزرعة بنجاح",
    farmDeleted: "تم حذف المزرعة بنجاح",
    deleteFarmConfirm: "هل أنت متأكد أنك تريد حذف هذه المزرعة؟\nهذا الإجراء لا رجوع فيه.",
    noFarmsAvailable: "لا توجد مزارع متاحة",
    failedToFetchFarms: "فشل في استرداد المزارع.",
    errorOccurred: "حدث خطأ.",
    newFarm: "مزرعة جديدة",
    farmInfo: "معلومات المزرعة",
    fillFarmInfo: "املأ المعلومات أدناه لمزرعتك.",
    
    // User Management
    users: "المستخدمون",
    manageUserAccounts: "إدارة حسابات المستخدمين في النظام",
    addUser: "إضافة مستخدم",
    userName: "الاسم",
    userEmail: "البريد الإلكتروني",
    userPassword: "كلمة المرور",
    userRole: "الدور",
    selectRole: "حدد الدور",
    farmer: "مزارع",
    administrator: "مدير",
    admin: "مسؤول",
    user: "مستخدم",
    actions: "الإجراءات",
    searchUsers: "البحث عن المستخدمين...",
    usersList: "قائمة المستخدمين",
    userAdded: "تم إضافة المستخدم بنجاح",
    userDeleted: "تم حذف المستخدم بنجاح",
    deleteUserConfirm: "هل أنت متأكد من حذف هذا المستخدم؟",
    allFieldsRequired: "جميع الحقول مطلوبة",
    noUsersFound: "لم يتم العثور على مستخدمين",
    noUsersAvailable: "لا توجد مستخدمون متاحون",
    failedToAddUser: "فشل في إضافة المستخدم",
    failedToDeleteUser: "فشل في حذف المستخدم",
    
    // Weather & Environment
    currentTemperature: "درجة الحرارة الحالية",
    waterTemperature: "درجة حرارة الماء",
    ambientHumidity: "الرطوبة الجوية",
    electricalConductivity: "التوصيلية الكهربائية",
    outdoorMode: "في الهواء الطلق",
    greenhouseMode: "تحت الاحتباس الحراري",
    
    // Diseases & Recommendations
    diseases: "الأمراض",
    risk: "خطر",
    recommendations: "توصيات",
    noRecommendations: "لا توجد توصيات في الوقت الحالي",
    noRecommendationsAvailable: "لا توجد توصيات متاحة حاليًا.",
    additionalRecommendations: "توصيات إضافية",
    diseaseInfo: "معلومات المرض",
    
    // Dashboard
    manageFarms: "إدارة مزارعك ومراجعة التوصيات بناءً على الظروف الجوية",
    viewAll: "عرض الكل",
    
    // Connection & Server Errors
    connectionError: "خطأ في الاتصال: خادم الواجهة الخلفية غير متاح. يرجى التأكد من تشغيل خادم الواجهة الخلفية على المنفذ 8080.",
    serverNotAvailable: "خطأ: خادم الواجهة الخلفية غير متاح. يرجى بدء تشغيل خادم الواجهة الخلفية على المنفذ 8080.",
    connectionErrorServer: "خطأ في الاتصال بالخادم.",
    
    // Language
    languageName: "Français",
    
    // Validation Messages
    passwordTooShort: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
    passwordsDoNotMatch: "كلمات المرور غير متطابقة",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    nameRequired: "الاسم مطلوب",
    emailRequired: "البريد الإلكتروني مطلوب",
    passwordRequired: "كلمة المرور مطلوبة",
  }
};

// Helper function to get translation
export const getTranslation = (key, language = 'fr') => {
  const keys = key.split('.');
  let translation = translations[language];
  
  for (const k of keys) {
    if (translation && typeof translation === 'object') {
      translation = translation[k];
    } else {
      break;
    }
  }
  
  // Fallback to French if translation not found in Arabic
  if (!translation && language === 'ar') {
    translation = translations.fr;
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        break;
      }
    }
  }
  
  // Final fallback to the key itself
  return translation || key;
};

// Export individual translation objects for easy access
export const frTranslations = translations.fr;
export const arTranslations = translations.ar;
