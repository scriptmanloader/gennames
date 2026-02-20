import { maleNames, femaleNames, patronymics, maleSurnames, femaleSurnames } from './_data.js';

export default function handler(req, res) {
  // Настройка заголовков для работы с любого домена (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Обработка предварительного запроса браузера (Preflight request)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Функция для получения случайного элемента из массива
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Читаем параметр ?gender из URL
  let gender = req.query.gender;

  // Если пол не указан или указан неверно — выбираем случайно
  if (gender !== 'male' && gender !== 'female') {
    gender = Math.random() > 0.5 ? 'male' : 'female';
  }

  // Генерируем данные на основе выбранного пола
  const firstName = gender === 'male' ? getRandom(maleNames) : getRandom(femaleNames);
  const lastName = gender === 'male' ? getRandom(maleSurnames) : getRandom(femaleSurnames);
  
  // Берем готовую пару отчеств из твоего расширенного словаря
  const patronRecord = getRandom(patronymics);
  const patronymic = gender === 'male' ? patronRecord.male : patronRecord.female;

  // Формируем финальный объект
  const responseData = {
    status: 'success',
    data: {
      gender: gender,
      firstName: firstName,
      lastName: lastName,
      patronymic: patronymic,
      fullName: `${lastName} ${firstName} ${patronymic}`
    },
    meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    }
  };

  // Отправляем ответ
  res.status(200).json(responseData);
}
