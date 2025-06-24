export const translations = {
  en: {
    welcomeTitle: "Welcome to MockInterviewAI",
    welcomeSubtitle:
      "Select your interviewer and interview type from the sidebar, then click Start Interview to begin your mock session.",
    startButton: "Start Interview",
  },
  es: {
    welcomeTitle: "Bienvenido a MockInterviewAI",
    welcomeSubtitle:
      "Selecciona tu entrevistador y tipo de entrevista en la barra lateral, luego haz clic en Iniciar entrevista para comenzar tu sesión de simulación.",
    startButton: "Iniciar Entrevista",
  },
  fr: {
    welcomeTitle: "Bienvenue sur MockInterviewAI",
    welcomeSubtitle:
      "Sélectionnez votre intervieweur et type d'entretien dans la barre latérale, puis cliquez sur Démarrer l'entretien pour commencer votre session simulée.",
    startButton: "Démarrer l'Entretien",
  },
  hi: {
    welcomeTitle: "Welcome to MockInterviewAI (Hindi)",
    welcomeSubtitle:
      "Select your interviewer and interview type from the sidebar, then click Start Interview to begin your mock session. (Hindi)",
    startButton: "Start Interview (Hindi)",
  },
};

export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (language: string, key: TranslationKey): string => {
  return translations[language as keyof typeof translations]?.[key] || translations.en[key];
}; 