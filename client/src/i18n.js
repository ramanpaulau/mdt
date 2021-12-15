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
      "Citizen": "Citizen",
      "Fine": "Fine",
      "Detention": "Detention",
      "License": "License",
      "Qualification": "Qualification",
      "Qualifications": "Qualifications",
      "Supervisor": "Supervisor",
      "Plate number": "Plate number",
      "Incident": "Incident",
      "Code": "Code",
      "Model": "Model",
      "Marking": "Marking",
      "Name": "Name",
      "Department": "Department",
      "Leader": "Leader",
      "Rank": "Rank",
      "State": "State",
      "Time": "Time",
      "Location": "Location",
      "Officers": "Officers",
      "Witnesses": "Witnesses",
      "Suspects": "Suspects",
      "Action": "Action",
      "Confiscation": "Confiscation",
      "Criminal Records": "Criminal Records",
      "Not found": "Not found",
      "Paid": "Paid",
      "Not Paid": "Not paid",
      "Created": "Created",
      "Start Time": "Start time",
      "End Time": "End time",
      "Form Title": "Title",
      "Form Location": "Location",
      "Form Phone": "Phone",
      "Form Text": "Text",
      "Form Surname": "Surname",
      "Form Birth Date": "Birth date",
      "Form Reg. num": "Registration number",
      "Form Get Password Link": "Get password link",
      "Form Name": "Name",
      "Form Description": "Description",
      "Form Price": "Price",
      "Form Selected Laws": "Selected laws",
      "Form Short Title": "Short title",
      "Form Abbreviation": "Abbreviation",
      "Form Salary": "Salary",
      "Form Hour": "hour",
      "Form Tag": "Tag",
      "Form Amount": "Amount",
      "Button View": "View",
      "Button Laws": "Laws",
      "Button Edit": "Edit",
      "Button Main": "Main",
      "Input Filter": "Filter",
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
      "Title BOLO Vehicles": "BOLO Транспорт",
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
      "Citizen": "Гражданин",
      "Fine": "Штраф",
      "Detention": "Арест",
      "License": "Лицензия",
      "Qualification": "Квалификация",
      "Qualifications": "Квалификации",
      "Supervisor": "Супервизор",
      "Plate number": "Номер",
      "Incident": "Инцидент",
      "Code": "Код",
      "Model": "Модель",
      "Marking": "Маркировка",
      "Name": "Имя",
      "Department": "Департамент",
      "Rank": "Ранг",
      "State": "Состояние",
      "Time": "Время",
      "Location": "Местоположение",
      "Officers": "Офицеры",
      "Witnesses": "Свидетели",
      "Suspects": "Подозреваемые",
      "Action": "Действия",
      "Confiscation": "Конфискация",
      "Criminal Records": "Судимости",
      "Not found": "Не найдено",
      "Paid": "Оплачено",
      "Not Paid": "Не оплачено",
      "Created": "Создано",
      "Start Time": "Начало",
      "End Time": "Конец",
      "Form Title": "Заголовок",
      "Form Location": "Местоположение",
      "Form Phone": "Телефон",
      "Form Text": "Текст",
      "Form Surname": "Фамилия",
      "Form Birth Date": "День рождения",
      "Form Reg. num": "Регистрационный номер",
      "Form Get Password Link": "Получение пароля",
      "Form Name": "Название",
      "Form Description": "Описание",
      "Form Price": "Цена",
      "Form Selected Laws": "Выбранные законы",
      "Form Short Title": "Краткое название",
      "Form Abbreviation": "Сокращение",
      "Form Salary": "Заработная плата",
      "Form Hour": "час",
      "Form Tag": "Ярлык",
      "Form Amount": "Количество",
      "Button View": "Просмотр",
      "Button Laws": "Законы",
      "Button Edit": "Редактировать",
      "Button Main": "Главный",
      "Input Filter": "Фильтр",
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
      "Citizen": "Občan",
      "Fine": "Pokuta",
      "Detention": "Zadržení ",
      "License": "Licence",
      "Qualification": "Kvalifikace",
      "Qualifications": "Kvalifikace",
      "Supervisor": "Vedoucí",
      "Plate number": "SPZ",
      "Incident": "Incident",
      "Code": "Kód",
      "Model": "Model",
      "Marking": "Označení",
      "Name": "Jméno",
      "Department": "Oddělení",
      "Rank": "Hodnost",
      "State": "Stav",
      "Time": "Čas",
      "Location": "Umístění",
      "Officers": "Jednotky",
      "Witnesses": "Svědci",
      "Suspects": "Podezřelí",
      "Action": "Akce",
      "Confiscation": "Konfiskace",
      "Criminal Records": "Rejstřík trestů",
      "Not found": "Nenalezeno",
      "Paid": "Zaplaceno",
      "Not Paid": "Nezaplaceno",
      "Created": "Vytvořeno",
      "Start Time": "Zahájení",
      "End Time": "Ukončení",
      "Form Title": "Nadpis",
      "Form Location": "Umístění",
      "Form Phone": "Telefon",
      "Form Text": "Text",
      "Form Surname": "Příjmení",
      "Form Birth Date": "Datum narození",
      "Form Reg. num": "Evidenční číslo",
      "Form Get Password Link": "Odkaz na heslo",
      "Form Name": "Název",
      "Form Description": "Popis",
      "Form Price": "Cena",
      "Form Selected Laws": "Vybrané zákony",
      "Form Short Title": "Krátký název",
      "Form Abbreviation": "Zkratka",
      "Form Salary": "Plat",
      "Form Hour": "hodina",
      "Form Tag": "Štítek",
      "Form Amount": "Množství",
      "Button View": "Prohlížet",
      "Button Laws": "Zákony",
      "Button Edit": "Upravit",
      "Button Main": "Hlavní",
      "Input Filter": "Filtr",
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