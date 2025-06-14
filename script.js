document.addEventListener('DOMContentLoaded', function() {
   // Получаем ссылки на элементы
   const folderPicker = document.getElementById('folderPicker');
   const folderNameDisplay = document.getElementById('folderNameDisplay');
   const currentImage = document.getElementById('currentImage');
   const fileNameDisplay = document.getElementById('fileNameDisplay');
   const prevBtn = document.getElementById('prevBtn');
   const nextBtn = document.getElementById('nextBtn');
   const imageDisplayArea = document.querySelector('.image-display'); // Контейнер изображения

   let imageFiles = []; // Массив для хранения объектов File изображений
   let currentIndex = -1; // Текущий индекс отображаемого изображения
   let currentImageUrl = null; // Переменная для хранения URL текущего изображения (для очистки памяти)


   // --- Функция для очистки предыдущего URL изображения ---
   function revokePreviousImageUrl() {
       if (currentImageUrl) {
           URL.revokeObjectURL(currentImageUrl); // Освобождаем память
           currentImageUrl = null;
       }
   }

   // --- Функция для отображения изображения по индексу ---
   function displayImage(index) {
       // Проверяем, что индекс корректен и есть файлы
       if (index >= 0 && index < imageFiles.length) {
           const file = imageFiles[index];

           // Очищаем предыдущий URL перед созданием нового
           revokePreviousImageUrl();

           // Создаем временный URL для файла изображения
           currentImageUrl = URL.createObjectURL(file);

           // Устанавливаем src изображения
           currentImage.src = currentImageUrl;
           // Обновляем текст alt и имя файла
           currentImage.alt = `Изображение ${index + 1} из ${imageFiles.length}`;
           fileNameDisplay.textContent = file.name;

           // Обновляем текущий индекс
           currentIndex = index;

           // Обновляем состояние кнопок навигации
           updateNavigationButtons();

            // Убираем фон, если изображение загрузилось
           imageDisplayArea.style.backgroundColor = 'transparent';

       } else {
            // Если индекс некорректен (например, нет файлов)
            revokePreviousImageUrl(); // Убираем любое старое изображение
            currentImage.src = '';
            currentImage.alt = 'Изображение для просмотра';
            fileNameDisplay.textContent = 'Выберите папку с изображениями';
            currentIndex = -1;
            updateNavigationButtons();
            imageDisplayArea.style.backgroundColor = '#eee'; // Возвращаем фон
       }
   }

   // --- Функция для обновления состояния кнопок Назад/Вперед ---
   function updateNavigationButtons() {
       prevBtn.disabled = currentIndex <= 0; // Неактивна на первом изображении или если нет файлов
       nextBtn.disabled = currentIndex >= imageFiles.length - 1; // Неактивна на последнем изображении или если нет файлов
   }

   // --- Обработчик выбора папки ---
   folderPicker.addEventListener('change', function(event) {
       // event.target.files содержит FileList выбранных файлов
       const files = event.target.files;
       imageFiles = []; // Очищаем предыдущий список

       if (files.length > 0) {
           // Фильтруем только изображения (можно улучшить проверку)
           for (let i = 0; i < files.length; i++) {
               const file = files[i];
               // Проверяем тип файла по mime-типу
               if (file.type.startsWith('image/')) {
                   imageFiles.push(file);
               }
           }

           // Сортируем файлы по имени для последовательного просмотра (опционально)
           imageFiles.sort((a, b) => a.name.localeCompare(b.name));


           // Если найдены изображения, отображаем первое
           if (imageFiles.length > 0) {
               // Показываем имя выбранной папки
               // В webkitdirectory File.webkitRelativePath содержит путь относительно выбранной папки
               // Берем первую часть пути до первого слеша
                const folderPath = files[0].webkitRelativePath;
                const folderName = folderPath.split('/')[0] || folderPath.split('\\')[0]; // Учитываем разные разделители

               folderNameDisplay.textContent = `Выбрана папка: ${folderName || 'Корневая папка'}`;


               displayImage(0); // Показываем первое изображение
               // Кнопки будут обновлены внутри displayImage
           } else {
                // Папка выбрана, но изображений не найдено
                folderNameDisplay.textContent = `Выбрана папка, но изображения не найдены.`;
                displayImage(-1); // Сбрасываем отображение
                prevBtn.disabled = true;
                nextBtn.disabled = true;
           }
       } else {
           // Выбор отменен или что-то пошло не так
           folderNameDisplay.textContent = 'Папка не выбрана';
           imageFiles = [];
           displayImage(-1); // Сбрасываем отображение
           prevBtn.disabled = true;
           nextBtn.disabled = true;
       }
   });

   // --- Обработчик кнопки "Назад" ---
   prevBtn.addEventListener('click', function() {
       if (currentIndex > 0) {
           displayImage(currentIndex - 1);
       }
   });

   // --- Обработчик кнопки "Вперед" ---
   nextBtn.addEventListener('click', function() {
       if (currentIndex < imageFiles.length - 1) {
           displayImage(currentIndex + 1);
       }
   });

   // Инициализация: скрываем кнопки навигации до выбора папки
   updateNavigationButtons();
});