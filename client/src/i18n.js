import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Title Citizens": "Citizens",
      "Title Citizens info": "Citizens info",
      "Title Licenses": "Licenses",
      "Title Vehicles": "Vehicles",
      "Title Incidents": "Incidents",
      "Title Incident info": "Incident info",
      "Title Indictments": "Indictments",
      "Title Fines": "Fines",
      "Title BOLO Citizens": "BOLO Citizens",
      "Title BOLO Vehicles": "BOLO Vehicles",
      "Title Departments": "Departments",
      "Title Ranks": "Ranks",
      "Title Units": "Units",
      "Title Employees": "Employees",
      "Title Work hours": "Work hours",
      "Title Inventory": "Inventory",
      "Title History": "History",
      "Title Active calls": "Active calls",
      "Title Calls": "Calls",
      "Title New": "New",
      "Title Send": "Send",
    }
  },
  ru: {
    translation: {
      "Title Citizens": "Граждане",
      "Title Citizens info": "Информация гражданина",
      "Title Licenses": "Лицензии",
      "Title Vehicles": "Транспорт",
      "Title Incidents": "Инциденты",
      "Title Incident info": "Информация о инциденте",
      "Title Indictments": "Обвинения",
      "Title Fines": "Штрафы",
      "Title BOLO Citizens": "BOLO Граждане",
      "Title BOLO Транспорт": "BOLO Транспорт",
      "Title Departments": "Департаменты",
      "Title Ranks": "Ранги",
      "Title Units": "Подразделения",
      "Title Employees": "Сотрудники",
      "Title Work hours": "Часы работы",
      "Title Inventory": "Инвентарь",
      "Title History": "История",
      "Title Active calls": "Активные вызовы",
      "Title Calls": "Вызовы",
      "Title New": "Новый",
      "Title Send": "Отправить",
    }
  },
  cz: {
    translation: {
      "Title Citizens": "Občané",
      "Title Citizens info": "Informace občana",
      "Title Licenses": "Licence",
      "Title Vehicles": "Vozidla",
      "Title Incidents": "Incidenty",
      "Title Incident info": "Informace o incidentu",
      "Title Indictments": "Rozsudky",
      "Title Fines": "Pokuty",
      "Title BOLO Citizens": "BOLO Občané",
      "Title BOLO Vehicles": "BOLO Vozidla",
      "Title Departments": "Oddělení",
      "Title Ranks": "Hodnosti",
      "Title Units": "Jednotky",
      "Title Employees": "Zaměstnanci",
      "Title Work hours": "Pracovní hodiny",
      "Title Inventory": "Inventář",
      "Title History": "Historie",
      "Title Active calls": "Aktivní požadavky",
      "Title Calls": "Požadavky",
      "Title New": "Nový",
      "Title Send": "Odeslat",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",

    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;